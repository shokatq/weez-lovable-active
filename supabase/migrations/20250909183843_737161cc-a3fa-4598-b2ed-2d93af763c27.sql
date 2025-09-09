-- Security Fix: Update existing RLS policies properly

-- Fix Profile RLS policies - update existing ones
DROP POLICY IF EXISTS "Users can view profiles in their teams" ON public.profiles;

-- Update the existing profile policy to be more restrictive
DROP POLICY IF EXISTS "Team members can view profiles of users in same teams only" ON public.profiles;
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

-- Security Fix 2: Secure team invitations
DROP POLICY IF EXISTS "Users can view invitations sent to their email" ON public.team_invitations;

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
DROP POLICY IF EXISTS "Admins can view all audit logs" ON public.audit_logs;

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