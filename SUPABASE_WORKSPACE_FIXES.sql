-- Supabase Workspace Management Fixes
-- This migration fixes critical issues with workspace management

-- 1. Fix role constraints to match the application logic
-- Update the workspace_members table to use the correct role values
ALTER TABLE workspace_members 
DROP CONSTRAINT IF EXISTS workspace_members_role_check;

ALTER TABLE workspace_members 
ADD CONSTRAINT workspace_members_role_check 
CHECK (role IN ('admin', 'team_lead', 'viewer'));

-- 2. Ensure proper foreign key relationships
-- Verify that all foreign keys are properly set up
DO $$
BEGIN
    -- Check if foreign key exists, if not create it
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'workspace_members_workspace_id_fkey'
        AND table_name = 'workspace_members'
    ) THEN
        ALTER TABLE workspace_members 
        ADD CONSTRAINT workspace_members_workspace_id_fkey 
        FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'workspace_members_user_id_fkey'
        AND table_name = 'workspace_members'
    ) THEN
        ALTER TABLE workspace_members 
        ADD CONSTRAINT workspace_members_user_id_fkey 
        FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Ensure unique constraint exists to prevent duplicate memberships
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'workspace_members_workspace_id_user_id_key'
        AND table_name = 'workspace_members'
    ) THEN
        ALTER TABLE workspace_members 
        ADD CONSTRAINT workspace_members_workspace_id_user_id_key 
        UNIQUE (workspace_id, user_id);
    END IF;
END $$;

-- 4. Create or update the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    first_name TEXT,
    last_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- 6. Create RLS policies for profiles
DROP POLICY IF EXISTS "Users can view all profiles" ON profiles;
CREATE POLICY "Users can view all profiles" ON profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
CREATE POLICY "Users can insert their own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Create function to handle user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, first_name, last_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. Fix the workspace owner membership trigger to handle conflicts properly
CREATE OR REPLACE FUNCTION add_workspace_owner_as_admin()
RETURNS TRIGGER AS $$
BEGIN
    -- Insert the owner as admin member, ignoring conflicts
    INSERT INTO workspace_members (workspace_id, user_id, role)
    VALUES (NEW.id, NEW.owner_id, 'admin')
    ON CONFLICT (workspace_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_role ON workspace_members(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 11. Update existing data to ensure consistency
-- Update any existing members with invalid roles
UPDATE workspace_members 
SET role = 'viewer' 
WHERE role NOT IN ('admin', 'team_lead', 'viewer');

-- 12. Create a function to get workspace member count efficiently
CREATE OR REPLACE FUNCTION get_workspace_member_count(workspace_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
    member_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO member_count
    FROM workspace_members
    WHERE workspace_id = workspace_uuid;
    
    RETURN COALESCE(member_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Create a function to check if user is workspace member
CREATE OR REPLACE FUNCTION is_workspace_member(workspace_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_id = workspace_uuid AND user_id = user_uuid
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- 15. Create a view for workspace statistics
CREATE OR REPLACE VIEW workspace_stats AS
SELECT 
    w.id,
    w.name,
    w.owner_id,
    w.created_at,
    COUNT(DISTINCT wm.user_id) as member_count,
    COUNT(DISTINCT d.id) as document_count,
    p.email as owner_email,
    p.full_name as owner_name
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
LEFT JOIN documents d ON w.id = d.workspace_id
LEFT JOIN profiles p ON w.owner_id = p.id
GROUP BY w.id, w.name, w.owner_id, w.created_at, p.email, p.full_name;

-- Grant access to the view
GRANT SELECT ON workspace_stats TO authenticated;

-- 16. Add helpful comments
COMMENT ON TABLE workspaces IS 'Workspaces table for organizing users and documents';
COMMENT ON TABLE workspace_members IS 'Junction table for workspace membership with roles';
COMMENT ON TABLE profiles IS 'User profiles with additional information';
COMMENT ON FUNCTION get_workspace_member_count(UUID) IS 'Returns the number of members in a workspace';
COMMENT ON FUNCTION is_workspace_member(UUID, UUID) IS 'Checks if a user is a member of a workspace';
COMMENT ON VIEW workspace_stats IS 'Aggregated statistics for workspaces including member and document counts';
