# Workspace Management Feature Test Guide

## Prerequisites
1. Run the `FINAL_DATABASE_SETUP.sql` script in your Supabase SQL Editor
2. Ensure your Supabase project has the correct environment variables

## Test Steps

### 1. Authentication Test
- [ ] Navigate to `/auth`
- [ ] Try signing up with a new account
- [ ] Try signing in with existing credentials
- [ ] Verify redirect to `/chat` after successful login
- [ ] Test logout functionality

### 2. Workspace Creation Test
- [ ] Navigate to `/workspace-management`
- [ ] Click "Create Workspace"
- [ ] Enter a workspace name
- [ ] Verify workspace is created and appears in the list
- [ ] Verify you are automatically added as Admin

### 3. Member Management Test
- [ ] Select a workspace
- [ ] Go to "Members" tab
- [ ] Click "Add Member"
- [ ] Search for users (try typing "test", "admin", or "user")
- [ ] Select a user and assign a role (Admin, Team Lead, or Viewer)
- [ ] Verify member is added to the list
- [ ] Refresh the page and verify member persists
- [ ] Test updating member roles
- [ ] Test removing members (Admin only)

### 4. Document Management Test
- [ ] Go to "Documents" tab
- [ ] Upload a document (PDF, image, or text file)
- [ ] Verify document appears in the list
- [ ] Click the eye icon to view the document
- [ ] Test download functionality
- [ ] Test delete functionality (Admin only)

### 5. Role-Based Access Control Test
- [ ] Create a test user with "Viewer" role
- [ ] Sign in as that user
- [ ] Verify they can only view documents (no upload/delete buttons)
- [ ] Create a test user with "Team Lead" role
- [ ] Verify they can upload and view but not delete documents
- [ ] Verify Admin users have full access

### 6. Error Handling Test
- [ ] Try uploading invalid file types
- [ ] Try adding duplicate members
- [ ] Try accessing workspaces you don't belong to
- [ ] Verify appropriate error messages are shown

## Expected Results
- All authentication flows work correctly
- Workspaces can be created and managed
- Members persist in database after page refresh
- Documents can be uploaded, viewed, and managed
- Role-based permissions are enforced in UI and backend
- Error handling provides clear feedback to users

## Troubleshooting
If any tests fail:
1. Check browser console for errors
2. Check Supabase logs for database errors
3. Verify RLS policies are correctly set up
4. Ensure storage bucket exists and is public
5. Check that all environment variables are set correctly
