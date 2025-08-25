-- Fix remaining functions without proper search_path settings

CREATE OR REPLACE FUNCTION public.get_auth_email()
 RETURNS text
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT email::text FROM auth.users WHERE id = auth.uid();
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