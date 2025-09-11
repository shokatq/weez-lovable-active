-- Additional RLS policies to allow fetching workspace data
-- Run this in your Supabase SQL Editor

-- Allow workspace owners to view members of their workspaces
CREATE POLICY "Workspace owners can view members" ON workspace_members
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

-- Allow workspace owners to view documents in their workspaces
CREATE POLICY "Workspace owners can view documents" ON documents
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

-- Allow workspace owners to count documents
CREATE POLICY "Workspace owners can count documents" ON documents
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );
