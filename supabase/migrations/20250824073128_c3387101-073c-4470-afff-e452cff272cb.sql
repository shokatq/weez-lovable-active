-- =============================================
-- CRITICAL SECURITY FIXES
-- =============================================

-- 1. Fix Critical Data Exposure in Profiles Table
-- Remove the dangerous "Users can view all profiles" policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a secure policy that only allows viewing profiles of team members
CREATE POLICY "Users can view profiles in their teams" 
ON public.profiles 
FOR SELECT 
USING (
  id = auth.uid() OR  -- Users can always see their own profile
  EXISTS (
    SELECT 1 
    FROM user_roles ur1
    JOIN user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid() 
    AND ur2.user_id = profiles.id
  )
);

-- 2. Fix Permission System Exposure
-- Remove the overly permissive permissions viewing policy
DROP POLICY IF EXISTS "Users can view permissions" ON public.permissions;

-- Create admin-only permission viewing policy
CREATE POLICY "Only admins can view permissions" 
ON public.permissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'::app_role
  )
);

-- 3. Fix Database Function Security
-- Update functions to use proper search_path for security
CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT email::text FROM auth.users WHERE id = auth.uid();
$function$;

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
    AND role = 'admin'::app_role
  );
$function$;

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

CREATE OR REPLACE FUNCTION public.get_user_role_in_team(user_id uuid, team_id uuid)
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT role FROM public.user_roles 
  WHERE user_roles.user_id = $1 AND user_roles.team_id = $2;
$function$;