-- First add missing columns to existing tables
ALTER TABLE public.space_members 
ADD COLUMN IF NOT EXISTS email text,
ADD COLUMN IF NOT EXISTS role app_role DEFAULT 'viewer',
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Create space invitations table for email invites
CREATE TABLE IF NOT EXISTS public.space_invitations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  space_id uuid NOT NULL,
  email text NOT NULL,
  role app_role NOT NULL DEFAULT 'viewer',
  invited_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamp with time zone,
  token text NOT NULL DEFAULT gen_random_uuid()::text
);

-- Enable RLS on space_invitations
ALTER TABLE public.space_invitations ENABLE ROW LEVEL SECURITY;

-- Update RLS policies for files to use the new space_members structure
DROP POLICY IF EXISTS "Space members can view files based on role" ON public.files;
CREATE POLICY "Space members can view files based on role" ON public.files
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.space_members sm
      WHERE sm.space_id = files.space_id 
      AND sm.user_id = auth.uid()
      AND sm.status = 'active'
    )
  );

DROP POLICY IF EXISTS "Space members can upload files" ON public.files;
CREATE POLICY "Space members can upload files" ON public.files
  FOR INSERT WITH CHECK (
    auth.uid() = owner_id AND
    EXISTS (
      SELECT 1 FROM public.space_members sm
      WHERE sm.space_id = files.space_id 
      AND sm.user_id = auth.uid()
      AND sm.status = 'active'
      AND sm.role IN ('admin', 'team_lead', 'employee')
    )
  );

DROP POLICY IF EXISTS "Admins and team leaders can edit files" ON public.files;
CREATE POLICY "Admins and team leaders can edit files" ON public.files
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.space_members sm
      WHERE sm.space_id = files.space_id 
      AND sm.user_id = auth.uid()
      AND sm.status = 'active'
      AND sm.role IN ('admin', 'team_lead')
    )
  );

DROP POLICY IF EXISTS "Only admins can delete files" ON public.files;
CREATE POLICY "Only admins can delete files" ON public.files
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.space_members sm
      WHERE sm.space_id = files.space_id 
      AND sm.user_id = auth.uid()
      AND sm.status = 'active'
      AND sm.role = 'admin'
    )
  );

-- RLS Policies for space_invitations
CREATE OR REPLACE POLICY "Space admins can manage invitations" ON public.space_invitations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.space_members sm
      WHERE sm.space_id = space_invitations.space_id 
      AND sm.user_id = auth.uid()
      AND sm.status = 'active'
      AND sm.role = 'admin'
    )
  );

-- Function to accept space invitation
CREATE OR REPLACE FUNCTION public.accept_space_invitation(invitation_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_user_id uuid;
  invitation_record record;
  user_email text;
  result jsonb;
BEGIN
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get user email
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  
  -- Get invitation details
  SELECT * INTO invitation_record 
  FROM public.space_invitations 
  WHERE token = invitation_token 
  AND expires_at > now() 
  AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Verify email matches
  IF invitation_record.email != user_email THEN
    RAISE EXCEPTION 'Invitation email does not match your account';
  END IF;
  
  -- Check if user is already in the space
  IF EXISTS (
    SELECT 1 FROM public.space_members 
    WHERE user_id = current_user_id AND space_id = invitation_record.space_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this space';
  END IF;
  
  -- Add user to space
  INSERT INTO public.space_members (space_id, user_id, email, role, added_by, status)
  VALUES (invitation_record.space_id, current_user_id, user_email, invitation_record.role, invitation_record.invited_by, 'active');
  
  -- Mark invitation as accepted
  UPDATE public.space_invitations 
  SET accepted_at = now() 
  WHERE id = invitation_record.id;
  
  result := jsonb_build_object(
    'success', true,
    'space_id', invitation_record.space_id,
    'role', invitation_record.role,
    'message', 'Successfully joined space'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;