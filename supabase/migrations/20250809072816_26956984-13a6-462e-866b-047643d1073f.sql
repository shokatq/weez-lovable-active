-- Security hardening migration
-- 1) Profiles RLS: restrict global visibility
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Remove overly permissive policy if it exists
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

-- Allow users to read only their own profile
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (id = auth.uid());

-- Allow users to read profiles of members in the same teams
CREATE POLICY "Users can view profiles in their teams"
ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid()
      AND ur2.user_id = profiles.id
  )
);

-- 2) Harden create_audit_log to prevent spoofing and enforce membership
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_user_id uuid,
  p_team_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL::uuid,
  p_old_values jsonb DEFAULT NULL::jsonb,
  p_new_values jsonb DEFAULT NULL::jsonb,
  p_metadata jsonb DEFAULT '{}'::jsonb,
  p_ip_address inet DEFAULT NULL::inet,
  p_user_agent text DEFAULT NULL::text,
  p_severity text DEFAULT 'info'::text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  audit_id uuid;
  current_user_id uuid := auth.uid();
  team_to_use uuid := NULL;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate team membership if a team_id is provided
  IF p_team_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = current_user_id AND team_id = p_team_id
    ) THEN
      team_to_use := p_team_id;
    ELSE
      RAISE EXCEPTION 'User is not a member of the specified team';
    END IF;
  END IF;

  INSERT INTO public.audit_logs (
    user_id, team_id, action, resource_type, resource_id,
    old_values, new_values, metadata, ip_address, user_agent, severity
  )
  VALUES (
    current_user_id, team_to_use, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_metadata, p_ip_address, p_user_agent, p_severity
  )
  RETURNING id INTO audit_id;

  RETURN audit_id;
END;
$function$;