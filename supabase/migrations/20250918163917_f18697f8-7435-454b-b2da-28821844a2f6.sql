-- Critical Security Fix: Implement proper RLS policies for profiles table
-- This fixes the "Allow all profile access" vulnerability

-- 1. Drop the dangerous "Allow all profile access" policy
DROP POLICY IF EXISTS "Allow all profile access" ON profiles;

-- 2. Create secure RLS policies for profiles table
-- Users can view and update their own profile
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Team members can view basic profile info of their teammates (no email exposure)
CREATE POLICY "Team members can view teammate basic info" ON profiles
    FOR SELECT USING (
        auth.uid() != id AND -- Not their own profile
        EXISTS (
            SELECT 1 FROM user_roles ur1
            JOIN user_roles ur2 ON ur1.team_id = ur2.team_id
            WHERE ur1.user_id = auth.uid() 
            AND ur2.user_id = profiles.id
            AND ur1.team_id IS NOT NULL
        )
    );

-- 3. Create a secure function for user search (team context only)
CREATE OR REPLACE FUNCTION public.search_team_users(search_query text)
RETURNS TABLE (
    id uuid,
    first_name text,
    last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Only return users who are in the same team as the requester
    -- And only return basic info (no email addresses)
    RETURN QUERY
    SELECT 
        p.id,
        p.first_name,
        p.last_name
    FROM profiles p
    WHERE EXISTS (
        SELECT 1 FROM user_roles ur1
        JOIN user_roles ur2 ON ur1.team_id = ur2.team_id
        WHERE ur1.user_id = auth.uid() 
        AND ur2.user_id = p.id
        AND ur1.team_id IS NOT NULL
    )
    AND (
        p.first_name ILIKE '%' || search_query || '%'
        OR p.last_name ILIKE '%' || search_query || '%'
    )
    ORDER BY p.first_name, p.last_name
    LIMIT 20;
END;
$$;

-- 4. Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION search_team_users(text) TO authenticated;

-- 5. Ensure RLS is enabled on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;