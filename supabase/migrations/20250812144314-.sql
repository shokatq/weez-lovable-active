-- Security hardening migration

-- 1) Helper to safely get current user's email without referencing auth.users in policies
CREATE OR REPLACE FUNCTION public.get_auth_email()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT email::text FROM auth.users WHERE id = auth.uid();
$$;

-- 2) Tighten team_invitations SELECT policy to avoid direct auth.users reference
DROP POLICY IF EXISTS "Users can view invitations to their teams" ON public.team_invitations;
CREATE POLICY "Users can view invitations to their teams"
ON public.team_invitations
FOR SELECT
USING (
  is_team_admin(auth.uid(), team_id) OR email = public.get_auth_email()
);

-- 3) Remove overly permissive INSERT on audit_logs (function will continue to work via SECURITY DEFINER)
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- 4) Constrain document_versions INSERT to team members only
DROP POLICY IF EXISTS "Authenticated users can create document versions" ON public.document_versions;
CREATE POLICY "Team members can create document versions"
ON public.document_versions
FOR INSERT
WITH CHECK (
  auth.uid() = user_id
  AND EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() AND ur.team_id = document_versions.team_id
  )
);
