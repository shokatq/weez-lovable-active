# Member Functionality Test Guide

## Prerequisites
1. Run the `COMPLETE_DATABASE_FIX.sql` script in your Supabase SQL Editor
2. Ensure your app is running with `npm run dev`

## Test Steps

### 1. Dynamic Member Count Test
- [ ] Navigate to `/workspace-management`
- [ ] Create a new workspace
- [ ] Verify the workspace shows "1 members" (the creator as Admin)
- [ ] Check that the count is dynamic, not static "0 members"

### 2. Member List Display Test
- [ ] In the workspace card, verify you see:
  - Member count (e.g., "1 members")
  - Member list showing "Your Name (admin)"
- [ ] Click on the workspace to open details
- [ ] In the Overview tab, verify:
  - Member count shows correct number
  - Member list shows all members with their roles

### 3. Add Member Test
- [ ] Go to the "Members" tab
- [ ] Click "Add Member"
- [ ] Search for a user (try "test", "admin", or "user")
- [ ] Select a user and assign a role (e.g., "Team Lead")
- [ ] Click "Add Member"
- [ ] Verify:
  - Success toast appears
  - Member count increases by 1
  - New member appears in the list with correct role
  - Workspace card shows updated count and member list

### 4. Auto-Update Test
- [ ] Add another member with "Viewer" role
- [ ] Verify:
  - No manual refresh needed
  - Count updates immediately
  - Member list updates immediately
  - Both workspace card and detail view show updated info

### 5. Workspace Visibility Test
- [ ] Sign in as the added member
- [ ] Navigate to `/workspace-management`
- [ ] Verify the workspace appears in their list
- [ ] Verify they can see the workspace with their role

### 6. Role-Based Access Test
- [ ] As a Viewer, verify:
  - Can view documents
  - Cannot upload documents
  - Cannot delete documents
  - Cannot download documents
- [ ] As a Team Lead, verify:
  - Can view and upload documents
  - Cannot delete documents
  - Cannot download documents
- [ ] As an Admin, verify:
  - Full access to all features
  - Can manage members
  - Can delete documents
  - Can download documents

## Expected Results

### Workspace Card Display
```
Workspace Name
[Your Role] 2 members
John Doe (admin), Jane Smith (team_lead)
```

### Overview Tab Display
```
Members
2
John Doe (admin)
Jane Smith (team_lead)
```

### Member Addition Flow
1. Click "Add Member" → Dialog opens
2. Search for user → Results appear
3. Select user and role → User selected
4. Click "Add Member" → Success toast
5. Member count increases → List updates
6. No page refresh needed → Everything updates automatically

## Troubleshooting

### If member count shows 0:
1. Check if workspace owner is in workspace_members table
2. Run the database fix script again
3. Check browser console for errors

### If members don't appear in list:
1. Verify RLS policies are set correctly
2. Check if profiles table has user data
3. Ensure workspace_members table has correct data

### If auto-update doesn't work:
1. Check if hooks are properly refreshing data
2. Verify error handling in console
3. Check network tab for failed API calls

## Database Verification

Run these queries in Supabase SQL Editor to verify data:

```sql
-- Check workspace members
SELECT w.name, wm.role, p.first_name, p.last_name, p.email
FROM workspaces w
JOIN workspace_members wm ON w.id = wm.workspace_id
JOIN profiles p ON wm.user_id = p.id
ORDER BY w.name, wm.role;

-- Check if workspace owners are members
SELECT w.name, w.owner_id, wm.user_id, wm.role
FROM workspaces w
LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND w.owner_id = wm.user_id
WHERE wm.user_id IS NULL;
```

The second query should return no rows if all workspace owners are properly added as members.
