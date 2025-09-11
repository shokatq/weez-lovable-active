-- Final Database Setup for Viz.AI Workspace Management
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles for search" ON profiles;
DROP POLICY IF EXISTS "Allow profile viewing for workspace management" ON profiles;
DROP POLICY IF EXISTS "Allow all profile access" ON profiles;

DROP POLICY IF EXISTS "Users can view their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Allow all workspace access" ON workspaces;

DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can add members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can update members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can remove members" ON workspace_members;
DROP POLICY IF EXISTS "Allow all workspace_members access" ON workspace_members;

DROP POLICY IF EXISTS "Users can view workspace documents" ON documents;
DROP POLICY IF EXISTS "Users can upload workspace documents" ON documents;
DROP POLICY IF EXISTS "Users can delete workspace documents" ON documents;
DROP POLICY IF EXISTS "Allow all documents access" ON documents;

DROP POLICY IF EXISTS "Workspace documents are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload workspace documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete workspace documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow all storage access" ON storage.objects;

-- 2. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS workspaces (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    owner_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS workspace_members (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL CHECK (role IN ('admin', 'team_lead', 'viewer')),
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(workspace_id, user_id)
);

CREATE TABLE IF NOT EXISTS documents (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
    uploader_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    file_url text NOT NULL,
    file_name text NOT NULL,
    file_size bigint,
    file_type text,
    created_at timestamp with time zone DEFAULT now()
);

-- 3. Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 4. Create permissive policies for testing
CREATE POLICY "Allow all profile access" ON profiles
    FOR ALL USING (true);

CREATE POLICY "Allow all workspace access" ON workspaces
    FOR ALL USING (true);

CREATE POLICY "Allow all workspace_members access" ON workspace_members
    FOR ALL USING (true);

CREATE POLICY "Allow all documents access" ON documents
    FOR ALL USING (true);

-- 5. Create storage bucket and policies
INSERT INTO storage.buckets (id, name, public)
VALUES ('workspace-documents', 'workspace-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Allow all storage access" ON storage.objects
    FOR ALL USING (true);

-- 6. Create user search function
CREATE OR REPLACE FUNCTION search_users(search_query text)
RETURNS TABLE (
    id uuid,
    email text,
    first_name text,
    last_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.email,
        p.first_name,
        p.last_name
    FROM profiles p
    WHERE 
        p.email ILIKE '%' || search_query || '%'
        OR p.first_name ILIKE '%' || search_query || '%'
        OR p.last_name ILIKE '%' || search_query || '%'
    ORDER BY p.email
    LIMIT 10;
END;
$$;

-- 7. Create function to automatically add workspace owner as admin
CREATE OR REPLACE FUNCTION add_workspace_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 8. Create trigger to automatically add workspace owner as admin
DROP TRIGGER IF EXISTS add_workspace_owner_as_admin_trigger ON workspaces;
CREATE TRIGGER add_workspace_owner_as_admin_trigger
    AFTER INSERT ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION add_workspace_owner_as_admin();

-- 9. Grant permissions
GRANT EXECUTE ON FUNCTION search_users(text) TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON workspaces TO authenticated;
GRANT ALL ON workspace_members TO authenticated;
GRANT ALL ON documents TO authenticated;
GRANT ALL ON profiles TO authenticated;

-- 10. Create some test users in profiles table if they don't exist
INSERT INTO profiles (id, email, first_name, last_name)
VALUES 
    ('mock-1', 'test@example.com', 'Test', 'User'),
    ('mock-2', 'admin@example.com', 'Admin', 'User'),
    ('mock-3', 'user@example.com', 'Regular', 'User')
ON CONFLICT (id) DO NOTHING;
