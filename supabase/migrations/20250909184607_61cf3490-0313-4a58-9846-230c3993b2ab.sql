-- Security Fix: Restrict profile data exposure (corrected version)

-- Create more restrictive RLS policies for profiles table
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Team members can view profiles of users in same teams only" ON public.profiles;

-- Create stricter policies
-- 1. Users can only view their complete profile (this policy already exists, so we'll update it)
-- 2. Team admins can view complete profiles of their team members (for management purposes only)
CREATE POLICY "Team admins can view team member profiles" ON public.profiles
  FOR SELECT 
  USING (
    id = auth.uid() OR  -- Users can see their own profile
    EXISTS (
      SELECT 1 FROM public.user_roles ur1
      JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
      WHERE ur1.user_id = auth.uid() 
      AND ur2.user_id = profiles.id
      AND ur1.role = 'admin'
      AND ur1.team_id IS NOT NULL
    )
  );

-- Create a secure function for getting team member basic info (name + avatar only)
CREATE OR REPLACE FUNCTION public.get_team_member_info(target_user_id uuid)
RETURNS TABLE(
  id uuid,
  first_name text,
  last_name text,
  avatar_url text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if the requesting user shares a team with the target user
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid() 
    AND ur2.user_id = target_user_id
    AND ur1.team_id IS NOT NULL
  ) THEN
    -- Return empty result if not team members
    RETURN;
  END IF;
  
  -- Return only safe, non-sensitive profile information
  RETURN QUERY
  SELECT 
    p.id,
    p.first_name,
    p.last_name,
    p.avatar_url
  FROM public.profiles p
  WHERE p.id = target_user_id;
END;
$$;

-- Create a function to get team members list safely
CREATE OR REPLACE FUNCTION public.get_team_members(team_id_param uuid)
RETURNS TABLE(
  user_id uuid,
  first_name text,
  last_name text,
  avatar_url text,
  role app_role,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Check if requesting user is a member of the team
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = auth.uid() 
    AND ur.team_id = team_id_param
  ) THEN
    RAISE EXCEPTION 'Access denied: You are not a member of this team';
  END IF;
  
  -- Return team members with only necessary information (no emails)
  RETURN QUERY
  SELECT 
    ur.user_id,
    p.first_name,
    p.last_name,
    p.avatar_url,
    ur.role,
    te.status
  FROM public.user_roles ur
  JOIN public.profiles p ON p.id = ur.user_id
  LEFT JOIN public.team_employees te ON te.user_id = ur.user_id AND te.team_id = ur.team_id
  WHERE ur.team_id = team_id_param;
END;
$$;

-- Add secure function for email access (only for own email or team admins)
CREATE OR REPLACE FUNCTION public.get_user_email_secure(target_user_id uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  user_email text;
  is_admin boolean := false;
BEGIN
  -- Only allow access to own email
  IF target_user_id = auth.uid() THEN
    SELECT email INTO user_email FROM public.profiles WHERE id = target_user_id;
    RETURN user_email;
  END IF;
  
  -- Check if requesting user is team admin for any team the target user is in
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = auth.uid() 
    AND ur2.user_id = target_user_id
    AND ur1.role = 'admin'
  ) INTO is_admin;
  
  IF is_admin THEN
    SELECT email INTO user_email FROM public.profiles WHERE id = target_user_id;
    
    -- Log admin email access for audit trail
    INSERT INTO public.audit_logs (
      user_id, action, resource_type, resource_id, 
      metadata, severity
    ) VALUES (
      auth.uid(), 
      'admin_email_access', 
      'profile', 
      target_user_id,
      jsonb_build_object('accessed_user_email', user_email, 'access_time', now()),
      'medium'
    );
    
    RETURN user_email;
  END IF;
  
  -- Access denied for non-admins
  RAISE EXCEPTION 'Access denied: Insufficient permissions to view email address';
END;
$$;

-- Create a safe function to check if users are team members (for UI purposes)
CREATE OR REPLACE FUNCTION public.are_team_members(user1_id uuid, user2_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER  
SET search_path TO 'public'
AS $$
BEGIN
  -- Only allow checking if the requesting user is one of the two users
  IF auth.uid() NOT IN (user1_id, user2_id) THEN
    RETURN false;
  END IF;
  
  -- Check if they share any team
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles ur1
    JOIN public.user_roles ur2 ON ur1.team_id = ur2.team_id
    WHERE ur1.user_id = user1_id 
    AND ur2.user_id = user2_id
    AND ur1.team_id IS NOT NULL
  );
END;
$$;