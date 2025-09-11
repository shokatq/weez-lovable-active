-- Simple Fix for Workspace Management
-- Run this in your Supabase SQL Editor

-- 1. Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles for search" ON profiles;
DROP POLICY IF EXISTS "Allow profile viewing for workspace management" ON profiles;

DROP POLICY IF EXISTS "Users can view their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can update their own workspaces" ON workspaces;
DROP POLICY IF EXISTS "Users can delete their own workspaces" ON workspaces;

DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can add members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can update members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can remove members" ON workspace_members;

DROP POLICY IF EXISTS "Users can view workspace documents" ON documents;
DROP POLICY IF EXISTS "Users can upload workspace documents" ON documents;
DROP POLICY IF EXISTS "Users can delete workspace documents" ON documents;

DROP POLICY IF EXISTS "Workspace documents are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload workspace documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete workspace documents" ON storage.objects;

-- 2. Create simple policies
CREATE POLICY "Allow profile viewing for workspace management" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can view their own workspaces" ON workspaces
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create workspaces" ON workspaces
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Users can update their own workspaces" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Users can delete their own workspaces" ON workspaces
    FOR DELETE USING (owner_id = auth.uid());

CREATE POLICY "Users can view workspace members" ON workspace_members
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can add members" ON workspace_members
    FOR INSERT WITH CHECK (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can update members" ON workspace_members
    FOR UPDATE USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can remove members" ON workspace_members
    FOR DELETE USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can view workspace documents" ON documents
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can upload workspace documents" ON documents
    FOR INSERT WITH CHECK (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete workspace documents" ON documents
    FOR DELETE USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

-- 3. Create storage policies
CREATE POLICY "Workspace documents are publicly accessible" ON storage.objects
    FOR SELECT USING (bucket_id = 'workspace-documents');

CREATE POLICY "Users can upload workspace documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'workspace-documents');

CREATE POLICY "Users can delete workspace documents" ON storage.objects
    FOR DELETE USING (bucket_id = 'workspace-documents');

-- 4. Create user search function
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

-- 5. Grant permissions
GRANT EXECUTE ON FUNCTION search_users(text) TO authenticated;
