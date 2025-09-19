import { Database } from '../integrations/supabase/types';

// Workspace types
export type Workspace = Database['public']['Tables']['workspaces']['Row'];
export type WorkspaceInsert = Database['public']['Tables']['workspaces']['Insert'];
export type WorkspaceUpdate = Database['public']['Tables']['workspaces']['Update'];

// Workspace member types
export type WorkspaceMember = Database['public']['Tables']['workspace_members']['Row'];
export type WorkspaceMemberInsert = Database['public']['Tables']['workspace_members']['Insert'];
export type WorkspaceMemberUpdate = Database['public']['Tables']['workspace_members']['Update'];

// Document types
export type Document = Database['public']['Tables']['documents']['Row'];
export type DocumentInsert = Database['public']['Tables']['documents']['Insert'];
export type DocumentUpdate = Database['public']['Tables']['documents']['Update'];

// Extended types with user information
export interface WorkspaceWithMembers extends Workspace {
  members: (WorkspaceMember & {
    user: {
      id: string;
      email: string;
      first_name: string | null;
      last_name: string | null;
      avatar_url: string | null;
    };
  })[];
  member_count: number;
  document_count: number;
}

export interface WorkspaceMemberWithUser extends WorkspaceMember {
  user: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

export interface DocumentWithUploader extends Document {
  uploader: {
    id: string;
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
  };
}

// Role types
export type WorkspaceRole = 'admin' | 'team_lead' | 'viewer';

// Permission types
export type WorkspacePermission = 'view' | 'edit' | 'delete' | 'manage_users';

// API response types
export interface WorkspaceListResponse {
  workspaces: WorkspaceWithMembers[];
  total: number;
}

export interface WorkspaceMembersResponse {
  members: WorkspaceMemberWithUser[];
  total: number;
}

export interface WorkspaceDocumentsResponse {
  documents: DocumentWithUploader[];
  total: number;
}

// Form types
export interface CreateWorkspaceForm {
  name: string;
}

export interface AddMemberForm {
  email: string;
  role: WorkspaceRole;
}

export interface UpdateMemberRoleForm {
  role: WorkspaceRole;
}

// File upload types
export interface FileUploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface UploadedFile {
  file: File;
  url: string;
  fileName: string;
  fileSize: number;
  fileType: string;
}

// Workspace context types
export interface WorkspaceContextType {
  currentWorkspace: WorkspaceWithMembers | null;
  userRole: WorkspaceRole | null;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  setCurrentWorkspace: (workspace: WorkspaceWithMembers | null) => void;
  refreshWorkspace: () => Promise<void>;
  loadWorkspace: (workspaceId: string) => Promise<void>;
}

// Error types
export interface WorkspaceError {
  message: string;
  code?: string;
  details?: any;
}

// Constants
export const WORKSPACE_ROLES: Record<WorkspaceRole, { label: string; description: string }> = {
  admin: {
    label: 'Admin',
    description: 'Full access: can view, edit, delete documents and manage users'
  },
  team_lead: {
    label: 'Team Lead',
    description: 'Can view and edit documents, but cannot delete'
  },
  viewer: {
    label: 'Viewer',
    description: 'Can only view documents'
  }
};

export const WORKSPACE_PERMISSIONS: Record<WorkspaceRole, WorkspacePermission[]> = {
  admin: ['view', 'edit', 'delete', 'manage_users'],
  team_lead: ['view', 'edit'],
  viewer: ['view']
};

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/msword',
  'text/plain',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp'
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// Employee types (for backwards compatibility)
export interface Employee {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  joinDate: Date;
  lastActive: Date;
  avatar?: string;
  first_name?: string | null;
  last_name?: string | null;
  avatar_url?: string | null;
  status?: string;
  custom_role?: string;
  custom_department?: string;
}

// File stats types
export interface FileStats {
  total_files: number;
  total_size: number;
  recent_uploads: number;
  totalFiles?: number; // Backwards compatibility
  platform?: string; // For platform-specific stats
  fileTypes?: Record<string, number>; // File type breakdown
}