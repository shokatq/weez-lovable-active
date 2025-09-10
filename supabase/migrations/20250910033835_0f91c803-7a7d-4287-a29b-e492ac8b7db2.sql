-- Fix security vulnerability: Restrict access to space_members email addresses
-- Ensure RLS is enabled and only authenticated team members can access data

-- Enable RLS on space_members (ensure it's enabled)
ALTER TABLE public.space_members ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with stricter security
DROP POLICY IF EXISTS "Space members can view space membership" ON public.space_members;
DROP POLICY IF EXISTS "Team admins can manage space membership" ON public.space_members;

-- Create restrictive policy for SELECT - only authenticated team members can view
CREATE POLICY "Authenticated team members can view space membership" 
ON public.space_members 
FOR SELECT 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 
    FROM public.spaces s
    JOIN public.user_roles ur ON ur.team_id = s.team_id
    WHERE s.id = space_members.space_id 
    AND ur.user_id = auth.uid()
  )
);

-- Create restrictive policy for INSERT - only authenticated team admins/leads
CREATE POLICY "Team admins can add space members" 
ON public.space_members 
FOR INSERT 
TO authenticated
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 
    FROM public.spaces s
    JOIN public.user_roles ur ON ur.team_id = s.team_id
    WHERE s.id = space_members.space_id 
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'team_lead')
  )
);

-- Create restrictive policy for UPDATE - only authenticated team admins/leads
CREATE POLICY "Team admins can update space members" 
ON public.space_members 
FOR UPDATE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 
    FROM public.spaces s
    JOIN public.user_roles ur ON ur.team_id = s.team_id
    WHERE s.id = space_members.space_id 
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'team_lead')
  )
)
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 
    FROM public.spaces s
    JOIN public.user_roles ur ON ur.team_id = s.team_id
    WHERE s.id = space_members.space_id 
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'team_lead')
  )
);

-- Create restrictive policy for DELETE - only authenticated team admins/leads
CREATE POLICY "Team admins can remove space members" 
ON public.space_members 
FOR DELETE 
TO authenticated
USING (
  auth.uid() IS NOT NULL AND 
  EXISTS (
    SELECT 1 
    FROM public.spaces s
    JOIN public.user_roles ur ON ur.team_id = s.team_id
    WHERE s.id = space_members.space_id 
    AND ur.user_id = auth.uid()
    AND ur.role IN ('admin', 'team_lead')
  )
);

-- Ensure no anonymous access is possible
-- Revoke all permissions from anon role
REVOKE ALL ON public.space_members FROM anon;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON public.space_members TO authenticated;