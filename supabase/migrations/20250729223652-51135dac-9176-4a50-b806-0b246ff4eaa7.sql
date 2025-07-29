-- Fix infinite recursion in user_roles policies by using security definer functions

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view roles in their teams" ON public.user_roles;
DROP POLICY IF EXISTS "Team admins can manage user roles" ON public.user_roles;

-- Create security definer function to check if user can view user_roles
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

-- Recreate policies using the security definer function
CREATE POLICY "Users can view roles in their teams"
ON public.user_roles
FOR SELECT
USING (can_view_user_roles(auth.uid(), team_id));

CREATE POLICY "Team admins can manage user roles"
ON public.user_roles
FOR ALL
USING (is_team_admin(auth.uid(), team_id));