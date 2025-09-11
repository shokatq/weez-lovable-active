-- Fix RLS policies to avoid infinite recursion
-- Run this in your Supabase SQL Editor

-- Drop ALL existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view workspaces they own or are members of" ON workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they own" ON workspaces;
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can update their workspaces" ON workspaces;
DROP POLICY IF EXISTS "Workspace owners can delete their workspaces" ON workspaces;

DROP POLICY IF EXISTS "Users can view workspace members of workspaces they belong to" ON workspace_members;
DROP POLICY IF EXISTS "Users can view workspace members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace admins can manage members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can manage members" ON workspace_members;

DROP POLICY IF EXISTS "Users can view documents in workspaces they belong to" ON documents;
DROP POLICY IF EXISTS "Users can upload documents to workspaces they belong to" ON documents;
DROP POLICY IF EXISTS "Users can update documents they uploaded or if they have edit permissions" ON documents;
DROP POLICY IF EXISTS "Only admins can delete documents" ON documents;
DROP POLICY IF EXISTS "Users can view documents in owned workspaces" ON documents;
DROP POLICY IF EXISTS "Users can upload documents to owned workspaces" ON documents;
DROP POLICY IF EXISTS "Users can update documents they uploaded" ON documents;
DROP POLICY IF EXISTS "Workspace owners can delete documents" ON documents;

-- Create simplified, non-recursive policies for workspaces
CREATE POLICY "Users can view workspaces they own" ON workspaces
    FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Users can create workspaces" ON workspaces
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspace owners can update their workspaces" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Workspace owners can delete their workspaces" ON workspaces
    FOR DELETE USING (owner_id = auth.uid());

-- Create simplified policies for workspace_members
CREATE POLICY "Users can view workspace members" ON workspace_members
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can manage members" ON workspace_members
    FOR ALL USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

-- Create simplified policies for documents
CREATE POLICY "Users can view documents in owned workspaces" ON documents
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can upload documents to owned workspaces" ON documents
    FOR INSERT WITH CHECK (
        uploader_id = auth.uid() AND
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Users can update documents they uploaded" ON documents
    FOR UPDATE USING (
        uploader_id = auth.uid() AND
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

CREATE POLICY "Workspace owners can delete documents" ON documents
    FOR DELETE USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );
