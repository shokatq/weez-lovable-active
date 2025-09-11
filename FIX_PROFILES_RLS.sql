-- Fix RLS policies for profiles table to allow user search
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- Create policy to allow viewing profiles for user search
CREATE POLICY "Users can view profiles for search" ON profiles
    FOR SELECT USING (true);

-- Ensure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
