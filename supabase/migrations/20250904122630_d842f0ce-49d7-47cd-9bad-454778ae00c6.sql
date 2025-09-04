-- Fix Function Search Path Mutable warnings by adding SET search_path = public
-- This prevents search_path injection attacks

-- Update get_auth_email function
CREATE OR REPLACE FUNCTION public.get_auth_email()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT email::text FROM auth.users WHERE id = auth.uid();
$function$;

-- Update can_view_user_roles function  
CREATE OR REPLACE FUNCTION public.can_view_user_roles(user_id uuid, team_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.team_id = $2
  );
$function$;

-- Update get_user_role_in_team function
CREATE OR REPLACE FUNCTION public.get_user_role_in_team(user_id uuid, team_id uuid)
 RETURNS app_role
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = $1 AND user_roles.team_id = $2;
$function$;

-- Update is_team_admin function
CREATE OR REPLACE FUNCTION public.is_team_admin(user_id uuid, team_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.team_id = $2 
    AND role = 'admin'
  );
$function$;

-- Fix Email Harvesting Vulnerability in team_invitations
-- Replace the existing policy with a more restrictive one
DROP POLICY IF EXISTS "Users can view invitations to their teams" ON public.team_invitations;

CREATE POLICY "Users can view invitations sent to their email" 
ON public.team_invitations 
FOR SELECT 
USING (
  -- Users can only see invitations sent to their own email address
  email = get_auth_email()
);

-- Team admins can still manage invitations but with restricted visibility
CREATE POLICY "Team admins can manage invitations for their teams" 
ON public.team_invitations 
FOR ALL 
USING (
  is_team_admin(auth.uid(), team_id)
) 
WITH CHECK (
  is_team_admin(auth.uid(), team_id)
);

-- Add input validation function for emails
CREATE OR REPLACE FUNCTION public.validate_email_format(email_input text)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Basic email validation regex
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$function$;

-- Add trigger to validate email format on team_invitations
CREATE OR REPLACE FUNCTION public.validate_invitation_email()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  IF NOT validate_email_format(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  RETURN NEW;
END;
$function$;

CREATE TRIGGER validate_invitation_email_trigger
  BEFORE INSERT OR UPDATE ON public.team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.validate_invitation_email();

-- Add rate limiting for invitation creation
CREATE OR REPLACE FUNCTION public.check_invitation_rate_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_invitations integer;
BEGIN
  -- Check if user has sent more than 10 invitations in the last hour
  SELECT COUNT(*) INTO recent_invitations
  FROM public.team_invitations
  WHERE invited_by = auth.uid()
  AND created_at > (now() - interval '1 hour');
  
  IF recent_invitations >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before sending more invitations.';
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE TRIGGER invitation_rate_limit_trigger
  BEFORE INSERT ON public.team_invitations
  FOR EACH ROW
  EXECUTE FUNCTION public.check_invitation_rate_limit();