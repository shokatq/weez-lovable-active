-- Manual Database Setup for Workspace Management
-- Run this SQL in your Supabase Dashboard > SQL Editor

-- 1. Create workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create workspace_members table
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'team_lead', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, user_id)
);

-- 3. Create documents table
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

-- 4. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_workspace_id ON documents(workspace_id);
CREATE INDEX IF NOT EXISTS idx_documents_uploader_id ON documents(uploader_id);

-- 5. Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for workspaces
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

-- 7. Create RLS policies for workspace_members
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

-- 8. Create RLS policies for documents
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

-- 9. Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public) 
VALUES ('workspace-documents', 'workspace-documents', false)
ON CONFLICT (id) DO NOTHING;

-- 10. Create storage policies
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

-- 11. Create function to automatically add workspace owner as admin member
CREATE OR REPLACE FUNCTION add_workspace_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin');
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 12. Create trigger to automatically add owner as admin
CREATE TRIGGER add_workspace_owner_as_admin_trigger
    AFTER INSERT ON workspaces
    FOR EACH ROW
    EXECUTE FUNCTION add_workspace_owner_as_admin();

-- 13. Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 14. Create triggers for updated_at
CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_workspace_members_updated_at BEFORE UPDATE ON workspace_members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
