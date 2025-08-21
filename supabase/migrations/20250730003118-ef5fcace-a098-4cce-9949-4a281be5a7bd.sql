-- Fix team invitation flow and enhance permissions
-- Create a secure function for team invitations that handles profile creation

CREATE OR REPLACE FUNCTION public.handle_team_invitation(
  invitation_email text,
  team_id uuid,
  role app_role,
  invited_by uuid,
  custom_department text DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_id uuid;
  invitation_id uuid;
  result jsonb;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Verify user is authenticated and has permission to invite
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if user can manage team (admin or team_lead)
  IF NOT (is_team_admin(current_user_id, team_id) OR 
          get_user_role_in_team(current_user_id, team_id) = 'team_lead') THEN
    RAISE EXCEPTION 'Insufficient permissions to invite team members';
  END IF;
  
  -- Check if email is already invited to this team
  IF EXISTS (
    SELECT 1 FROM public.team_invitations 
    WHERE email = invitation_email 
    AND team_id = handle_team_invitation.team_id 
    AND accepted_at IS NULL
    AND expires_at > now()
  ) THEN
    RAISE EXCEPTION 'User is already invited to this team';
  END IF;
  
  -- Create the invitation
  INSERT INTO public.team_invitations (email, team_id, role, invited_by)
  VALUES (invitation_email, team_id, role, invited_by)
  RETURNING id INTO invitation_id;
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'invitation_id', invitation_id,
    'message', 'Invitation created successfully'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;

-- Create function to accept team invitation
CREATE OR REPLACE FUNCTION public.accept_team_invitation(invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  current_user_id uuid;
  invitation_record record;
  result jsonb;
  user_email text;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Verify user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get user email
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  
  -- Get invitation details
  SELECT * INTO invitation_record 
  FROM public.team_invitations 
  WHERE id = invitation_id 
  AND expires_at > now() 
  AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Verify email matches
  IF invitation_record.email != user_email THEN
    RAISE EXCEPTION 'Invitation email does not match your account';
  END IF;
  
  -- Check if user is already in the team
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND team_id = invitation_record.team_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this team';
  END IF;
  
  -- Add user to team
  INSERT INTO public.user_roles (user_id, team_id, role)
  VALUES (current_user_id, invitation_record.team_id, invitation_record.role);
  
  -- Add to team employees
  INSERT INTO public.team_employees (user_id, team_id, status, invited_by)
  VALUES (current_user_id, invitation_record.team_id, 'active', invitation_record.invited_by);
  
  -- Mark invitation as accepted
  UPDATE public.team_invitations 
  SET accepted_at = now() 
  WHERE id = invitation_id;
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'team_id', invitation_record.team_id,
    'role', invitation_record.role,
    'message', 'Successfully joined team'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;

-- Enhance team employees table with more fields
ALTER TABLE public.team_employees 
ADD COLUMN IF NOT EXISTS last_active timestamp with time zone DEFAULT now(),
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_team_employees_team_user ON public.team_employees(team_id, user_id);
CREATE INDEX IF NOT EXISTS idx_team_invitations_email_team ON public.team_invitations(email, team_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_team_user ON public.user_roles(team_id, user_id);