-- Create workspace management tables
-- This migration creates the workspace management system for Viz.AI

-- Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'team_lead', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_size BIGINT,
    file_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploader_id ON documents(uploader_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Workspaces policies
CREATE POLICY "Users can view workspaces they own or are members of" ON workspaces
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        id IN (
            SELECT workspace_id FROM workspace_members 
            WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create workspaces" ON workspaces
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Workspace owners can update their workspaces" ON workspaces
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Workspace owners can delete their workspaces" ON workspaces
    FOR DELETE USING (owner_id = auth.uid());

-- Workspace members policies
CREATE POLICY "Users can view workspace members of workspaces they belong to" ON workspace_members
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces 
            WHERE owner_id = auth.uid() OR 
            id IN (
                SELECT workspace_id FROM workspace_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Workspace admins can manage members" ON workspace_members
    FOR ALL USING (
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        ) OR
        (workspace_id, auth.uid()) IN (
            SELECT workspace_id, user_id FROM workspace_members 
            WHERE role = 'admin'
        )
    );

-- Documents policies
CREATE POLICY "Users can view documents in workspaces they belong to" ON documents
    FOR SELECT USING (
        workspace_id IN (
            SELECT id FROM workspaces 
            WHERE owner_id = auth.uid() OR 
            id IN (
                SELECT workspace_id FROM workspace_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can upload documents to workspaces they belong to" ON documents
    FOR INSERT WITH CHECK (
        uploader_id = auth.uid() AND
        workspace_id IN (
            SELECT id FROM workspaces 
            WHERE owner_id = auth.uid() OR 
            id IN (
                SELECT workspace_id FROM workspace_members 
                WHERE user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update documents they uploaded or if they have edit permissions" ON documents
    FOR UPDATE USING (
        uploader_id = auth.uid() OR
        (workspace_id, auth.uid()) IN (
            SELECT workspace_id, user_id FROM workspace_members 
            WHERE role IN ('admin', 'team_lead')
        )
    );

CREATE POLICY "Only admins can delete documents" ON documents
    FOR DELETE USING (
        (workspace_id, auth.uid()) IN (
            SELECT workspace_id, user_id FROM workspace_members 
            WHERE role = 'admin'
        ) OR
        workspace_id IN (
            SELECT id FROM workspaces WHERE owner_id = auth.uid()
        )
    );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('workspace-documents', 'workspace-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policies
CREATE POLICY "Users can upload documents to workspace bucket" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'workspace-documents' AND
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can view documents in workspaces they belong to" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'workspace-documents' AND
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Users can update documents they uploaded" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'workspace-documents' AND
        auth.uid()::text = (storage.foldername(name))[1]
    );

CREATE POLICY "Only admins can delete documents" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'workspace-documents' AND
        auth.uid() IS NOT NULL
    );

-- Create function to automatically add workspace owner as admin member
CREATE OR REPLACE FUNCTION add_workspace_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically add owner as admin
CREATE TRIGGER add_workspace_owner_as_admin_trigger
    AFTER INSERT ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION add_workspace_owner_as_admin();

-- Create function to get user role in workspace
CREATE OR REPLACE FUNCTION get_user_workspace_role(workspace_uuid UUID, user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    user_role TEXT;
BEGIN
    -- Check if user is workspace owner
    IF EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_uuid AND owner_id = user_uuid) THEN
        RETURN 'admin';
    END IF;
    
    -- Check if user is a member
    SELECT role INTO user_role 
    FROM workspace_members 
    WHERE workspace_id = workspace_uuid AND user_id = user_uuid;
    
    RETURN COALESCE(user_role, 'none');
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create function to check if user can perform action in workspace
CREATE OR REPLACE FUNCTION can_perform_workspace_action(
    workspace_uuid UUID,
    user_uuid UUID,
    action_type TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    user_role := get_user_workspace_role(workspace_uuid, user_uuid);
    
    CASE action_type
        WHEN 'view' THEN
            RETURN user_role IN ('admin', 'team_lead', 'viewer');
        WHEN 'edit' THEN
            RETURN user_role IN ('admin', 'team_lead');
        WHEN 'delete' THEN
            RETURN user_role = 'admin';
        WHEN 'manage_users' THEN
            RETURN user_role = 'admin';
        ELSE
            RETURN FALSE;
    END CASE;
END;
$$ language 'plpgsql' SECURITY DEFINER;
