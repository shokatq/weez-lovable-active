-- Verify Database Data - Run this in Supabase SQL Editor to check your data

-- 1. Check if workspaces exist
SELECT 'Workspaces' as table_name, COUNT(*) as count FROM workspaces;

-- 2. Check if workspace_members exist
SELECT 'Workspace Members' as table_name, COUNT(*) as count FROM workspace_members;

-- 3. Check if profiles exist
SELECT 'Profiles' as table_name, COUNT(*) as count FROM profiles;

-- 4. Show all workspaces with their owners
SELECT 
    w.id,
    w.name,
    w.owner_id,
    p.email as owner_email,
    p.first_name as owner_first_name,
    p.last_name as owner_last_name,
    w.created_at
FROM workspaces w
LEFT JOIN profiles p ON w.owner_id = p.id
ORDER BY w.created_at DESC;

-- 5. Show all workspace members with their details
SELECT 
    wm.id,
    wm.workspace_id,
    w.name as workspace_name,
    wm.user_id,
    p.email as member_email,
    p.first_name as member_first_name,
    p.last_name as member_last_name,
    wm.role,
    wm.created_at
FROM workspace_members wm
LEFT JOIN workspaces w ON wm.workspace_id = w.id
LEFT JOIN profiles p ON wm.user_id = p.id
ORDER BY wm.created_at DESC;

-- 6. Show all profiles
SELECT 
    id,
    email,
    first_name,
    last_name,
    created_at
FROM profiles
ORDER BY created_at DESC;

-- 7. Check if there are any workspaces without members (should have at least the owner as admin)
SELECT 
    w.id,
    w.name,
    w.owner_id,
    COUNT(wm.id) as member_count
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id
GROUP BY w.id, w.name, w.owner_id
HAVING COUNT(wm.id) = 0;

-- 8. Check if workspace owners are properly added as admin members
SELECT 
    w.id as workspace_id,
    w.name as workspace_name,
    w.owner_id,
    wm.user_id as member_user_id,
    wm.role,
    CASE 
        WHEN w.owner_id = wm.user_id AND wm.role = 'admin' THEN 'OK'
        WHEN w.owner_id = wm.user_id AND wm.role != 'admin' THEN 'WRONG ROLE'
        WHEN w.owner_id != wm.user_id THEN 'NOT OWNER'
        ELSE 'MISSING'
    END as status
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND w.owner_id = wm.user_id;
