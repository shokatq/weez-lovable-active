# Workspace Management Feature Setup Guide

This guide will help you set up the complete Workspace Management feature for Viz.AI.

## 🚀 Quick Start

### 1. Database Setup

Run the Supabase migration to create the required tables:

```bash
# Apply the migration
supabase db push
```

Or manually run the SQL from `supabase/migrations/20250115000000_create_workspace_management.sql`

### 2. Install Dependencies

```bash
npm install react-dropzone
```

### 3. Storage Bucket Setup

The migration automatically creates a storage bucket called `workspace-documents`. Make sure your Supabase project has storage enabled.

### 4. Environment Variables

Ensure your Supabase environment variables are properly configured in your project.

## 📁 File Structure

```
src/
├── components/workspace/
│   ├── WorkspaceManagement.tsx          # Main workspace management component
│   ├── CreateWorkspaceDialog.tsx        # Dialog for creating workspaces
│   ├── AddMemberDialog.tsx              # Dialog for adding team members
│   ├── UpdateMemberRoleDialog.tsx       # Dialog for updating member roles
│   ├── DocumentUploadDialog.tsx         # Dialog for uploading documents
│   └── WorkspaceNavigation.tsx          # Navigation component
├── hooks/
│   ├── useWorkspace.tsx                 # Workspace context and hooks
│   └── useAuth.tsx                      # Authentication hook
├── pages/
│   ├── WorkspaceManagement.tsx          # Workspace management page
│   └── WorkspaceDetail.tsx              # Individual workspace page
├── services/
│   └── workspaceService.ts              # API service for workspace operations
├── types/
│   └── workspace.ts                     # TypeScript types and interfaces
└── integrations/supabase/
    └── types.ts                         # Updated with workspace tables
```

## 🗄️ Database Schema

### Tables Created

1. **workspaces**
   - `id` (UUID, Primary Key)
   - `name` (TEXT, NOT NULL)
   - `owner_id` (UUID, Foreign Key to auth.users)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

2. **workspace_members**
   - `id` (UUID, Primary Key)
   - `workspace_id` (UUID, Foreign Key to workspaces)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `role` (TEXT: 'admin', 'team_lead', 'viewer')
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

3. **documents**
   - `id` (UUID, Primary Key)
   - `workspace_id` (UUID, Foreign Key to workspaces)
   - `uploader_id` (UUID, Foreign Key to auth.users)
   - `file_url` (TEXT, NOT NULL)
   - `file_name` (TEXT, NOT NULL)
   - `file_size` (BIGINT)
   - `file_type` (TEXT)
   - `created_at` (TIMESTAMP)
   - `updated_at` (TIMESTAMP)

### Storage Bucket

- **workspace-documents**: For storing uploaded files

## 🔐 Security Features

### Row Level Security (RLS)

All tables have RLS enabled with comprehensive policies:

- **Workspaces**: Users can only see workspaces they own or are members of
- **Workspace Members**: Users can only see members of workspaces they belong to
- **Documents**: Users can only access documents in workspaces they belong to
- **Storage**: Files are protected with workspace-based access control

### Role-Based Access Control (RBAC)

Three roles with different permissions:

1. **Admin**
   - Full access: view, edit, delete documents
   - Manage users: add, remove, update roles
   - Workspace owner automatically gets admin role

2. **Team Lead**
   - View and edit documents
   - Cannot delete documents
   - Cannot manage users

3. **Viewer**
   - View documents only
   - Cannot edit, delete, or manage users

## 🎯 Features

### Workspace Management
- ✅ Create new workspaces
- ✅ List all workspaces user owns or is member of
- ✅ View workspace details and statistics
- ✅ Delete workspaces (owner only)

### User Management
- ✅ Add users to workspace by email
- ✅ Update user roles
- ✅ Remove users from workspace
- ✅ View all workspace members with their roles

### Document Management
- ✅ Upload documents (PDF, DOCX, TXT, images)
- ✅ View document list with metadata
- ✅ Download/view documents
- ✅ Delete documents (admin only)
- ✅ File size and type validation

### UI/UX Features
- ✅ Responsive design
- ✅ Drag & drop file upload
- ✅ Real-time search for users
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Confirmation dialogs for destructive actions

## 🛠️ API Endpoints

The service provides these methods:

### Workspace Operations
- `createWorkspace(data)` - Create new workspace
- `getWorkspaces()` - Get user's workspaces
- `getWorkspace(id)` - Get specific workspace
- `updateWorkspace(id, data)` - Update workspace
- `deleteWorkspace(id)` - Delete workspace

### Member Operations
- `getWorkspaceMembers(workspaceId)` - Get workspace members
- `addWorkspaceMember(workspaceId, data)` - Add member
- `updateMemberRole(workspaceId, memberId, data)` - Update role
- `removeWorkspaceMember(workspaceId, memberId)` - Remove member

### Document Operations
- `getWorkspaceDocuments(workspaceId)` - Get documents
- `uploadDocument(workspaceId, file)` - Upload document
- `deleteDocument(documentId)` - Delete document

### Permission Checking
- `getUserWorkspaceRole(workspaceId)` - Get user's role
- `canPerformAction(workspaceId, action)` - Check permissions

## 🚦 Usage

### 1. Access Workspace Management

Navigate to `/workspace-management` to access the main workspace management page.

### 2. Create a Workspace

Click "Create Workspace" and enter a workspace name. You'll automatically become the admin.

### 3. Add Team Members

In the workspace, go to the "Members" tab and click "Add Member". Search for users by email and assign roles.

### 4. Upload Documents

Go to the "Documents" tab and click "Upload Document". Drag and drop files or click to select.

### 5. Manage Permissions

Admins can change member roles and remove members. Team leads can edit documents. Viewers can only view.

## 🔧 Customization

### Adding New File Types

Update the `ALLOWED_FILE_TYPES` array in `src/types/workspace.ts`:

```typescript
export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Add new types here
];
```

### Changing File Size Limit

Update `MAX_FILE_SIZE` in `src/types/workspace.ts`:

```typescript
export const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
```

### Adding New Roles

1. Update the database schema to include new roles
2. Update the `WorkspaceRole` type in `src/types/workspace.ts`
3. Update the `WORKSPACE_ROLES` and `WORKSPACE_PERMISSIONS` constants
4. Update the RLS policies in the migration

## 🐛 Troubleshooting

### Common Issues

1. **Files not uploading**: Check storage bucket permissions and RLS policies
2. **Users not found**: Ensure users exist in the `profiles` table
3. **Permission denied**: Check RLS policies and user roles
4. **Migration fails**: Ensure Supabase is properly configured

### Debug Mode

Enable debug logging by adding to your environment:

```bash
SUPABASE_DEBUG=true
```

## 📝 Notes

- The workspace owner is automatically added as an admin member
- All operations are logged for audit purposes
- File uploads are stored in Supabase Storage with workspace-based organization
- The system uses Supabase Auth for user authentication
- All components are built with shadcn/ui for consistent styling

## 🔄 Future Enhancements

Potential features to add:

- Document versioning
- Document comments and annotations
- Advanced file search and filtering
- Workspace templates
- Bulk operations
- Email notifications for workspace activities
- Document sharing with external users
- Advanced permission granularity

## 📞 Support

If you encounter any issues, check:

1. Supabase dashboard for database errors
2. Browser console for client-side errors
3. Network tab for API request failures
4. Storage bucket permissions

The system is designed to be robust and handle errors gracefully with user-friendly error messages.
