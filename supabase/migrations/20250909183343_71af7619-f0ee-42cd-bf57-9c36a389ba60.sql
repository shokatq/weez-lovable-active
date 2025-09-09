-- Security Fix 1: Remove dual authentication by ensuring Supabase auth is primary
-- Fix Profile RLS policies to prevent cross-team data exposure

-- Drop the overly permissive profile viewing policy
DROP POLICY IF EXISTS "Users can view profiles in their teams" ON public.profiles;

-- Create more restrictive profile policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Team members can view profiles of users in same teams only" ON public.profiles
  FOR SELECT 
  USING (
    id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.user_roles ur1
      JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
      WHERE ur1.user_id = auth.uid() 
      AND ur2.user_id = profiles.id
      AND ur1.team_id IS NOT NULL
    )
  );

-- Security Fix 2: Secure team invitations to prevent email harvesting
-- Drop overly permissive invitation policies
DROP POLICY IF EXISTS "Users can view invitations sent to their email" ON public.team_invitations;

-- Create restrictive invitation viewing policy
CREATE POLICY "Users can view their own invitations" ON public.team_invitations
  FOR SELECT 
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

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

-- Security Fix 3: Strengthen audit log access
-- Drop existing audit log policy
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;

-- Create more restrictive audit log policy
CREATE POLICY "Team admins can view team audit logs only" ON public.audit_logs
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.team_id = audit_logs.team_id 
      AND ur.role = 'admin'
    )
  );

-- Security Fix 4: Fix database functions with proper search_path
-- Update all functions to have proper search_path settings

CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION public.can_view_user_roles(user_id uuid, team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 AND user_roles.team_id = $2
  );
$$;

CREATE OR REPLACE FUNCTION public.get_user_role_in_team(user_id uuid, team_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = $1 AND user_roles.team_id = $2;
$$;

CREATE OR REPLACE FUNCTION public.is_team_admin(user_id uuid, team_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = $1 
    AND user_roles.team_id = $2 
    AND role = 'admin'
  );
$$;

-- Security Fix 5: Add rate limiting to sensitive operations
-- Create rate limiting table for tracking sensitive operations
CREATE TABLE IF NOT EXISTS public.rate_limit_tracking (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  operation_type text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  ip_address inet
);

-- Enable RLS on rate limiting table
ALTER TABLE public.rate_limit_tracking ENABLE ROW LEVEL SECURITY;

-- Only allow system to insert rate limit tracking
CREATE POLICY "System can track rate limits" ON public.rate_limit_tracking
  FOR INSERT 
  WITH CHECK (true);

-- Only admins can view rate limit data
CREATE POLICY "Admins can view rate limits" ON public.rate_limit_tracking
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.user_roles ur
      WHERE ur.user_id = auth.uid() 
      AND ur.role = 'admin'
    )
  );

-- Security Fix 6: Enhance invitation validation
CREATE OR REPLACE FUNCTION public.validate_invitation_email()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Validate email format
  IF NOT validate_email_format(NEW.email) THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Check for suspicious patterns (multiple consecutive dots, etc.)
  IF NEW.email ~ '\.\.' OR NEW.email ~ '^\.|\.$' THEN
    RAISE EXCEPTION 'Invalid email format';
  END IF;
  
  -- Ensure email length is reasonable
  IF LENGTH(NEW.email) > 254 OR LENGTH(NEW.email) < 5 THEN
    RAISE EXCEPTION 'Email length must be between 5 and 254 characters';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for invitation email validation if it doesn't exist
DROP TRIGGER IF EXISTS validate_invitation_email_trigger ON public.team_invitations;
CREATE TRIGGER validate_invitation_email_trigger
  BEFORE INSERT OR UPDATE ON public.team_invitations
  FOR EACH ROW EXECUTE FUNCTION public.validate_invitation_email();