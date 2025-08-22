// =============================================
// 1. ROLE DEFINITIONS & PERMISSIONS
// =============================================

export enum Role {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  TEAM_LEAD = 'team_lead',
  EMPLOYEE = 'employee',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

export enum Permission {
  // Team Management
  MANAGE_TEAM = 'manage_team',
  INVITE_MEMBERS = 'invite_members',
  REMOVE_MEMBERS = 'remove_members',
  ASSIGN_ROLES = 'assign_roles',
  VIEW_TEAM = 'view_team',
  
  // Workspace Management
  MANAGE_WORKSPACE = 'manage_workspace',
  CREATE_WORKSPACE = 'create_workspace',
  DELETE_WORKSPACE = 'delete_workspace',
  CONFIGURE_SETTINGS = 'configure_settings',
  
  // Content Access
  READ_CONTENT = 'read_content',
  WRITE_CONTENT = 'write_content',
  DELETE_CONTENT = 'delete_content',
  
  // AI Features
  USE_AI_CHAT = 'use_ai_chat',
  MANAGE_AI_SETTINGS = 'manage_ai_settings',
  
  // Analytics & Reports
  VIEW_ANALYTICS = 'view_analytics',
  EXPORT_DATA = 'export_data'
}

// Role-Permission Matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.SUPER_ADMIN]: [
    Permission.MANAGE_TEAM,
    Permission.INVITE_MEMBERS,
    Permission.REMOVE_MEMBERS,
    Permission.ASSIGN_ROLES,
    Permission.VIEW_TEAM,
    Permission.MANAGE_WORKSPACE,
    Permission.CREATE_WORKSPACE,
    Permission.DELETE_WORKSPACE,
    Permission.CONFIGURE_SETTINGS,
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.USE_AI_CHAT,
    Permission.MANAGE_AI_SETTINGS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA
  ],
  [Role.ADMIN]: [
    Permission.MANAGE_TEAM,
    Permission.INVITE_MEMBERS,
    Permission.REMOVE_MEMBERS,
    Permission.ASSIGN_ROLES,
    Permission.VIEW_TEAM,
    Permission.MANAGE_WORKSPACE,
    Permission.CONFIGURE_SETTINGS,
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.DELETE_CONTENT,
    Permission.USE_AI_CHAT,
    Permission.MANAGE_AI_SETTINGS,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA
  ],
  [Role.TEAM_LEAD]: [
    Permission.VIEW_TEAM,
    Permission.INVITE_MEMBERS,
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.USE_AI_CHAT,
    Permission.VIEW_ANALYTICS
  ],
  [Role.EMPLOYEE]: [
    Permission.VIEW_TEAM,
    Permission.READ_CONTENT,
    Permission.WRITE_CONTENT,
    Permission.USE_AI_CHAT
  ],
  [Role.VIEWER]: [
    Permission.VIEW_TEAM,
    Permission.READ_CONTENT,
    Permission.USE_AI_CHAT
  ],
  [Role.GUEST]: [
    Permission.READ_CONTENT
  ]
};

export interface TeamMember {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: Role;
  status: 'active' | 'pending' | 'inactive';
  invited_at?: string;
  joined_at?: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  owner_id: string;
}