-- Fix RLS policies for user_roles table
-- This migration ensures users can read their own roles

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can insert their own roles" ON user_roles;
DROP POLICY IF EXISTS "Users can update their own roles" ON user_roles;

-- Create new policies for user_roles table
CREATE POLICY "Users can view their own roles" ON user_roles
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own roles" ON user_roles
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own roles" ON user_roles
    FOR UPDATE USING (user_id = auth.uid());

-- Ensure RLS is enabled
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
