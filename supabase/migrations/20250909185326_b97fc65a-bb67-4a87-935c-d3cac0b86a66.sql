-- Security Fix: Restrict team invitation email access and enhance profile protection

-- 1. Drop overly permissive team invitation policies
DROP POLICY IF EXISTS "Team admins can view team invitations" ON public.team_invitations;
DROP POLICY IF EXISTS "Users can view their own invitations" ON public.team_invitations;

-- 2. Create more restrictive team invitation policies
-- Only team admins can manage invitations (existing policy is fine)
-- Users can only view invitations sent to their email (more restrictive)
CREATE POLICY "Users can view invitations sent to their email only" ON public.team_invitations
  FOR SELECT 
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- Team admins can view team invitations but without exposing emails to non-admins
CREATE POLICY "Team admins can view team invitations" ON public.team_invitations
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.team_id = team_invitations.team_id 
      AND ur.role = 'admin'
    )
  );

-- 3. Create secure function to check invitation status without exposing emails
CREATE OR REPLACE FUNCTION public.check_user_invitation_status(user_email text)
RETURNS TABLE(
  invitation_id uuid,
  team_name text,
  role app_role,
  expires_at timestamp with time zone
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow users to check their own email's invitation status
  IF user_email != (SELECT email FROM auth.users WHERE id = auth.uid()) THEN
    RAISE EXCEPTION 'Access denied: Can only check your own invitation status';
  END IF;
  
  RETURN QUERY
  SELECT 
    ti.id,
    t.name,
    ti.role,
    ti.expires_at
  FROM public.team_invitations ti
  JOIN public.teams t ON t.id = ti.team_id
  WHERE ti.email = user_email 
  AND ti.accepted_at IS NULL 
  AND ti.expires_at > now();
END;
$$;

-- 4. Add audit logging for sensitive profile access
CREATE OR REPLACE FUNCTION public.log_profile_access(accessed_user_id uuid, access_type text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid := auth.uid();
  team_context uuid;
BEGIN
  -- Get team context if users share a team
  SELECT ur1.team_id INTO team_context
  FROM public.user_roles ur1
  JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
  WHERE ur1.user_id = current_user_id 
  AND ur2.user_id = accessed_user_id
  LIMIT 1;
  
  -- Log the profile access
  INSERT INTO public.audit_logs (
    user_id, team_id, action, resource_type, resource_id,
    metadata, severity
  ) VALUES (
    current_user_id,
    team_context,
    access_type,
    'profile',
    accessed_user_id,
    jsonb_build_object(
      'accessed_user_id', accessed_user_id,
      'access_time', now(),
      'access_context', 'profile_view'
    ),
    'medium'
  );
END;
$$;

-- 5. Create function for safe team member lookup (name + avatar only)
CREATE OR REPLACE FUNCTION public.get_team_member_safe_info(target_user_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  avatar_url text,
  role app_role
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if requesting user shares a team with target user
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid() 
    AND ur2.user_id = target_user_id
    AND ur1.team_id IS NOT NULL
  ) THEN
    RAISE EXCEPTION 'Access denied: Users are not team members';
  END IF;
  
  -- Log the access
  PERFORM public.log_profile_access(target_user_id, 'team_member_info_access');
  
  -- Return only safe information
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    ur.role
  FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id = p.id
  WHERE p.id = target_user_id
  LIMIT 1;
END;
$$;