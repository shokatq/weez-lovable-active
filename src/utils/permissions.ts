import type { WorkspaceRole, WorkspaceMemberWithUser } from '../types/workspace';

// Permission definitions
export const PERMISSIONS = {
  admin: {
    canView: true,
    canEdit: true,
    canDelete: true,
    canUpload: true,
    canDownload: true,
    canManageUsers: true,
    canManageWorkspace: true,
    canChangeRoles: true,
    canRemoveMembers: true,
    canAddMembers: true
  },
  team_lead: {
    canView: true,
    canEdit: true,
    canDelete: false,
    canUpload: true,
    canDownload: true,
    canManageUsers: false,
    canManageWorkspace: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canAddMembers: true
  },
  viewer: {
    canView: true,
    canEdit: false,
    canDelete: false,
    canUpload: false,
    canDownload: false,
    canManageUsers: false,
    canManageWorkspace: false,
    canChangeRoles: false,
    canRemoveMembers: false,
    canAddMembers: false
  }
} as const;

// Permission checking utilities
export class PermissionChecker {
  private userRole: WorkspaceRole | null;
  private isOwner: boolean;
  private currentUserId: string | null;

  constructor(userRole: WorkspaceRole | null, isOwner: boolean, currentUserId: string | null) {
    this.userRole = userRole;
    this.isOwner = isOwner;
    this.currentUserId = currentUserId;
  }

  // Basic permission checks
  canView(): boolean {
    return this.userRole !== null;
  }

  canEdit(): boolean {
    return this.userRole === 'admin' || this.userRole === 'team_lead';
  }

  canDelete(): boolean {
    return this.userRole === 'admin';
  }

  canUpload(): boolean {
    return this.userRole === 'admin' || this.userRole === 'team_lead';
  }

  canDownload(): boolean {
    return this.userRole === 'admin' || this.userRole === 'team_lead';
  }

  canManageUsers(): boolean {
    return this.userRole === 'admin';
  }

  canManageWorkspace(): boolean {
    return this.userRole === 'admin';
  }

  canAddMembers(): boolean {
    return this.userRole === 'admin' || this.userRole === 'team_lead';
  }

  // Member-specific permission checks
  canChangeMemberRole(targetMember: WorkspaceMemberWithUser): boolean {
    if (!this.userRole) return false;
    if (this.userRole !== 'admin') return false;
    
    // Cannot change role of workspace owner
    if (this.isOwner && targetMember.user_id === this.currentUserId) return false;
    
    // Cannot change role of other admins (only owner can)
    if (targetMember.role === 'admin' && !this.isOwner) return false;
    
    return true;
  }

  canRemoveMember(targetMember: WorkspaceMemberWithUser): boolean {
    if (!this.userRole) return false;
    if (this.userRole !== 'admin') return false;
    
    // Cannot remove workspace owner
    if (this.isOwner && targetMember.user_id === this.currentUserId) return false;
    
    // Cannot remove other admins (only owner can)
    if (targetMember.role === 'admin' && !this.isOwner) return false;
    
    return true;
  }

  canEditMember(targetMember: WorkspaceMemberWithUser): boolean {
    if (!this.userRole) return false;
    if (this.userRole !== 'admin') return false;
    
    // Cannot edit workspace owner
    if (this.isOwner && targetMember.user_id === this.currentUserId) return false;
    
    return true;
  }

  // Role hierarchy checks
  canAssignRole(targetRole: WorkspaceRole): boolean {
    if (!this.userRole) return false;
    if (this.userRole !== 'admin') return false;
    
    // Only owner can assign admin role
    if (targetRole === 'admin' && !this.isOwner) return false;
    
    return true;
  }

  // Get available roles for assignment
  getAvailableRoles(): WorkspaceRole[] {
    if (!this.userRole) return [];
    if (this.userRole !== 'admin') return [];
    
    const roles: WorkspaceRole[] = ['team_lead', 'viewer'];
    
    // Only owner can assign admin role
    if (this.isOwner) {
      roles.unshift('admin');
    }
    
    return roles;
  }

  // Check if user can perform specific action on member
  canPerformActionOnMember(action: string, targetMember: WorkspaceMemberWithUser): boolean {
    switch (action) {
      case 'change_role':
        return this.canChangeMemberRole(targetMember);
      case 'remove':
        return this.canRemoveMember(targetMember);
      case 'edit':
        return this.canEditMember(targetMember);
      default:
        return false;
    }
  }

  // Get all permissions for current user
  getAllPermissions() {
    return {
      canView: this.canView(),
      canEdit: this.canEdit(),
      canDelete: this.canDelete(),
      canUpload: this.canUpload(),
      canDownload: this.canDownload(),
      canManageUsers: this.canManageUsers(),
      canManageWorkspace: this.canManageWorkspace(),
      canAddMembers: this.canAddMembers(),
      canChangeRoles: this.userRole === 'admin',
      canRemoveMembers: this.userRole === 'admin'
    };
  }
}

// Factory function to create permission checker
export function createPermissionChecker(
  userRole: WorkspaceRole | null,
  isOwner: boolean,
  currentUserId: string | null
): PermissionChecker {
  return new PermissionChecker(userRole, isOwner, currentUserId);
}

// Hook for getting user permissions in components
export function usePermissions(
  userRole: WorkspaceRole | null,
  isOwner: boolean,
  currentUserId: string | null
) {
  return createPermissionChecker(userRole, isOwner, currentUserId);
}

// Utility functions for common permission checks
export function canUserManageWorkspace(userRole: WorkspaceRole | null): boolean {
  return userRole === 'admin';
}

export function canUserAddMembers(userRole: WorkspaceRole | null): boolean {
  return userRole === 'admin' || userRole === 'team_lead';
}

export function canUserUploadDocuments(userRole: WorkspaceRole | null): boolean {
  return userRole === 'admin' || userRole === 'team_lead';
}

export function canUserDownloadDocuments(userRole: WorkspaceRole | null): boolean {
  return userRole === 'admin' || userRole === 'team_lead';
}

export function canUserDeleteDocuments(userRole: WorkspaceRole | null): boolean {
  return userRole === 'admin';
}

// Role hierarchy utilities
export function getRoleHierarchy(role: WorkspaceRole): number {
  const hierarchy = {
    admin: 3,
    team_lead: 2,
    viewer: 1
  };
  return hierarchy[role] || 0;
}

export function isRoleHigherThan(role1: WorkspaceRole, role2: WorkspaceRole): boolean {
  return getRoleHierarchy(role1) > getRoleHierarchy(role2);
}

export function canRoleManageRole(managerRole: WorkspaceRole, targetRole: WorkspaceRole): boolean {
  if (managerRole === 'admin') {
    return targetRole !== 'admin'; // Only owner can manage admins
  }
  return false;
}

// Member sorting utilities
export function sortMembersByRole(members: WorkspaceMemberWithUser[]): WorkspaceMemberWithUser[] {
  return [...members].sort((a, b) => {
    const roleA = getRoleHierarchy(a.role as WorkspaceRole);
    const roleB = getRoleHierarchy(b.role as WorkspaceRole);
    
    if (roleA !== roleB) {
      return roleB - roleA; // Higher roles first
    }
    
    // If same role, sort by name
    const nameA = `${a.user.first_name || ''} ${a.user.last_name || ''}`.trim();
    const nameB = `${b.user.first_name || ''} ${b.user.last_name || ''}`.trim();
    
    return nameA.localeCompare(nameB);
  });
}

// Search and filter utilities
export function filterMembersByRole(
  members: WorkspaceMemberWithUser[],
  role: WorkspaceRole
): WorkspaceMemberWithUser[] {
  return members.filter(member => member.role === role);
}

export function searchMembers(
  members: WorkspaceMemberWithUser[],
  query: string
): WorkspaceMemberWithUser[] {
  if (!query.trim()) return members;
  
  const lowercaseQuery = query.toLowerCase();
  
  return members.filter(member => {
    const fullName = `${member.user.first_name || ''} ${member.user.last_name || ''}`.toLowerCase();
    const email = member.user.email.toLowerCase();
    const role = member.role.toLowerCase();
    
    return fullName.includes(lowercaseQuery) || 
           email.includes(lowercaseQuery) || 
           role.includes(lowercaseQuery);
  });
}

// Member statistics utilities
export function getMemberStats(members: WorkspaceMemberWithUser[]) {
  const stats = {
    total: members.length,
    admins: 0,
    teamLeads: 0,
    viewers: 0
  };
  
  members.forEach(member => {
    switch (member.role) {
      case 'admin':
        stats.admins++;
        break;
      case 'team_lead':
        stats.teamLeads++;
        break;
      case 'viewer':
        stats.viewers++;
        break;
    }
  });
  
  return stats;
}
