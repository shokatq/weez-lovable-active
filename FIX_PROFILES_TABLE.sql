-- Fix Profiles Table - Run this in Supabase SQL Editor

-- 1. Check if profiles table exists and has the right structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- 2. Create profiles table if it doesn't exist or is missing columns
CREATE TABLE IF NOT EXISTS profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text,
    first_name text,
    last_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- 3. Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies on profiles
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles for search" ON profiles;
DROP POLICY IF EXISTS "Allow profile viewing for workspace management" ON profiles;
DROP POLICY IF EXISTS "Allow all profile access" ON profiles;

-- 5. Create permissive policy for profiles
CREATE POLICY "Allow all profile access" ON profiles
    FOR ALL USING (true);

-- 6. Grant permissions
GRANT ALL ON profiles TO authenticated;

-- 7. Create or update the function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Insert current user into profiles if they don't exist
INSERT INTO profiles (id, email, first_name, last_name)
SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'first_name', ''),
    COALESCE(au.raw_user_meta_data->>'last_name', '')
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM profiles p WHERE p.id = au.id
);
