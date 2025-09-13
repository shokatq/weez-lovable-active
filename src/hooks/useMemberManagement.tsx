// Enhanced useMemberManagement with detailed error handling and logging
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useMemberContext } from '../contexts/MemberContext';
import { usePermissions } from '../utils/permissions';
import { useToast } from './use-toast';
import type { WorkspaceRole, WorkspaceMemberWithUser } from '../types/workspace';

interface UseMemberManagementProps {
  workspaceId: string;
  currentUserRole: WorkspaceRole | null;
  isOwner: boolean;
  currentUserId: string | null;
}

export function useMemberManagement({
  workspaceId,
  currentUserRole,
  isOwner,
  currentUserId
}: UseMemberManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<WorkspaceRole | 'all'>('all');
  const [sortBy, setSortBy] = useState<'role' | 'name' | 'date'>('role');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [addingMember, setAddingMember] = useState(false); // Add loading state

  const {
    getMembers,
    getMemberCount,
    isLoading,
    getError,
    fetchMembers,
    addMember,
    removeMember,
    updateMemberRole,
    subscribeToMembers,
    unsubscribeFromMembers
  } = useMemberContext();

  const permissions = usePermissions(currentUserRole, isOwner, currentUserId);
  const { toast } = useToast();

  // Get members and derived data
  const members = getMembers(workspaceId);
  const memberCount = getMemberCount(workspaceId);
  const loading = isLoading(workspaceId);
  const error = getError(workspaceId);

  // Subscribe to real-time updates when workspace changes
  useEffect(() => {
    if (workspaceId) {
      subscribeToMembers(workspaceId);
      return () => unsubscribeFromMembers(workspaceId);
    }
  }, [workspaceId, subscribeToMembers, unsubscribeFromMembers]);

  // Filter and sort members based on current filters
  const filteredMembers = useMemo(() => {
    let filtered = members;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = members.filter(member => {
        const fullName = `${member.user.first_name || ''} ${member.user.last_name || ''}`.toLowerCase();
        const email = member.user.email.toLowerCase();
        const role = member.role.toLowerCase();
        const query = searchQuery.toLowerCase();
        
        return fullName.includes(query) || 
               email.includes(query) || 
               role.includes(query);
      });
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(member => member.role === roleFilter);
    }

    // Apply sorting
    switch (sortBy) {
      case 'role':
        filtered = [...filtered].sort((a, b) => {
          const roleOrder = { admin: 3, team_lead: 2, viewer: 1 };
          const orderA = roleOrder[a.role as WorkspaceRole] || 0;
          const orderB = roleOrder[b.role as WorkspaceRole] || 0;
          
          if (orderA !== orderB) return orderB - orderA;
          
          // If same role, sort by name
          const nameA = `${a.user.first_name || ''} ${a.user.last_name || ''}`.trim();
          const nameB = `${b.user.first_name || ''} ${b.user.last_name || ''}`.trim();
          return nameA.localeCompare(nameB);
        });
        break;
      case 'name':
        filtered = [...filtered].sort((a, b) => {
          const nameA = `${a.user.first_name || ''} ${a.user.last_name || ''}`.trim();
          const nameB = `${b.user.first_name || ''} ${b.user.last_name || ''}`.trim();
          return nameA.localeCompare(nameB);
        });
        break;
      case 'date':
        filtered = [...filtered].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
    }

    return filtered;
  }, [members, searchQuery, roleFilter, sortBy]);

  // Get member statistics
  const memberStats = useMemo(() => {
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
  }, [members]);

  // Enhanced member management functions with better error handling
  const handleAddMember = useCallback(async (memberData: {
    email: string;
    role: WorkspaceRole;
    userId?: string;
    user?: any;
  }) => {
    console.log('🔍 Starting add member process...', {
      workspaceId,
      currentUserRole,
      isOwner,
      memberData: { ...memberData, user: memberData.user ? '[USER_OBJECT]' : undefined }
    });

    // Check permissions first
    const canAdd = permissions.canAddMembers();
    console.log('🔐 Permission check:', {
      canAddMembers: canAdd,
      userRole: currentUserRole,
      isOwner,
      permissionsObject: permissions.getAllPermissions()
    });

    if (!canAdd) {
      const errorMsg = `Permission denied. Current role: ${currentUserRole}, Is owner: ${isOwner}`;
      console.error('❌ Permission denied:', errorMsg);
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to add members',
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    // Validate input data
    if (!memberData.email?.trim()) {
      const errorMsg = 'Email is required';
      console.error('❌ Validation failed:', errorMsg);
      toast({
        title: 'Validation Error',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    if (!memberData.role) {
      const errorMsg = 'Role is required';
      console.error('❌ Validation failed:', errorMsg);
      toast({
        title: 'Validation Error',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    // Check if member already exists
    const existingMember = members.find(m => 
      m.user.email.toLowerCase() === memberData.email.toLowerCase()
    );
    if (existingMember) {
      const errorMsg = 'Member already exists in this workspace';
      console.error('❌ Member already exists:', existingMember);
      toast({
        title: 'Member Already Exists',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    // Check role assignment permissions
    if (!permissions.canAssignRole(memberData.role)) {
      const errorMsg = `Cannot assign role: ${memberData.role}. Available roles: ${permissions.getAvailableRoles().join(', ')}`;
      console.error('❌ Role assignment denied:', errorMsg);
      toast({
        title: 'Role Assignment Denied',
        description: `You cannot assign the role "${memberData.role}"`,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    setAddingMember(true);
    
    try {
      console.log('🚀 Calling addMember function...');
      const startTime = Date.now();
      
      const result = await addMember(workspaceId, memberData);
      
      const endTime = Date.now();
      console.log('✅ Add member completed in', endTime - startTime, 'ms');
      console.log('📝 Add member result:', result);

      toast({
        title: 'Success',
        description: `Member ${memberData.email} has been added to the workspace`,
        variant: 'default'
      });

      // Refresh members to ensure UI is updated
      await fetchMembers(workspaceId);

      return { success: true, result };
    } catch (error: any) {
      console.error('❌ Failed to add member:', {
        error,
        message: error?.message,
        code: error?.code,
        status: error?.status,
        response: error?.response?.data,
        stack: error?.stack
      });

      // Determine error message based on error type
      let errorMessage = 'Failed to add member';
      
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      // Show specific error messages based on common issues
      if (error?.status === 401 || error?.code === 'UNAUTHORIZED') {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error?.status === 403 || error?.code === 'FORBIDDEN') {
        errorMessage = 'You do not have permission to add members to this workspace.';
      } else if (error?.status === 404 || error?.code === 'NOT_FOUND') {
        errorMessage = 'Workspace not found or user not found.';
      } else if (error?.status === 409 || error?.code === 'CONFLICT') {
        errorMessage = 'Member already exists in this workspace.';
      } else if (error?.status === 422 || error?.code === 'VALIDATION_ERROR') {
        errorMessage = 'Invalid member data provided.';
      }

      toast({
        title: 'Failed to Add Member',
        description: errorMessage,
        variant: 'destructive'
      });

      return { success: false, error: errorMessage, originalError: error };
    } finally {
      setAddingMember(false);
    }
  }, [workspaceId, addMember, members, permissions, toast, currentUserRole, isOwner, fetchMembers]);

  // Enhanced remove member function
  const handleRemoveMember = useCallback(async (memberId: string) => {
    console.log('🔍 Starting remove member process...', { memberId, workspaceId });
    
    const member = members.find(m => m.id === memberId);
    if (!member) {
      console.error('❌ Member not found:', memberId);
      return { success: false, error: 'Member not found' };
    }

    console.log('🔐 Checking remove permissions for member:', member);
    
    if (!permissions.canRemoveMember(member)) {
      const errorMsg = 'You do not have permission to remove this member';
      console.error('❌ Permission denied:', errorMsg);
      toast({
        title: 'Permission Denied',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    try {
      console.log('🚀 Calling removeMember function...');
      await removeMember(workspaceId, memberId);
      console.log('✅ Member removed successfully');
      
      toast({
        title: 'Success',
        description: 'Member has been removed from the workspace',
        variant: 'default'
      });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to remove member:', error);
      
      toast({
        title: 'Failed to Remove Member',
        description: error?.message || 'An error occurred while removing the member',
        variant: 'destructive'
      });

      return { success: false, error: error?.message || 'Failed to remove member' };
    }
  }, [workspaceId, removeMember, members, permissions, toast]);

  // Enhanced update member role function
  const handleUpdateMemberRole = useCallback(async (memberId: string, newRole: WorkspaceRole) => {
    console.log('🔍 Starting update member role process...', { memberId, newRole, workspaceId });
    
    const member = members.find(m => m.id === memberId);
    if (!member) {
      console.error('❌ Member not found:', memberId);
      return { success: false, error: 'Member not found' };
    }

    console.log('🔐 Checking role change permissions for member:', member);

    if (!permissions.canChangeMemberRole(member)) {
      const errorMsg = 'You do not have permission to change this member\'s role';
      console.error('❌ Permission denied:', errorMsg);
      toast({
        title: 'Permission Denied',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    if (!permissions.canAssignRole(newRole)) {
      const errorMsg = `You cannot assign the role "${newRole}"`;
      console.error('❌ Role assignment denied:', errorMsg);
      toast({
        title: 'Role Assignment Denied',
        description: errorMsg,
        variant: 'destructive'
      });
      return { success: false, error: errorMsg };
    }

    try {
      console.log('🚀 Calling updateMemberRole function...');
      await updateMemberRole(workspaceId, memberId, newRole);
      console.log('✅ Member role updated successfully');
      
      toast({
        title: 'Success',
        description: `Member role has been updated to ${newRole}`,
        variant: 'default'
      });

      return { success: true };
    } catch (error: any) {
      console.error('❌ Failed to update member role:', error);
      
      toast({
        title: 'Failed to Update Role',
        description: error?.message || 'An error occurred while updating the member role',
        variant: 'destructive'
      });

      return { success: false, error: error?.message || 'Failed to update member role' };
    }
  }, [workspaceId, updateMemberRole, members, permissions, toast]);

  // Bulk operations with enhanced error handling
  const handleBulkRemoveMembers = useCallback(async (memberIds: string[]) => {
    if (!permissions.canManageUsers()) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to remove members',
        variant: 'destructive'
      });
      return { success: false, error: 'Permission denied' };
    }

    try {
      const results = await Promise.allSettled(
        memberIds.map(id => removeMember(workspaceId, id))
      );

      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length === 0) {
        setSelectedMembers([]);
        toast({
          title: 'Success',
          description: `Removed ${memberIds.length} members`,
          variant: 'default'
        });
        return { success: true };
      } else {
        const successCount = memberIds.length - failed.length;
        toast({
          title: 'Partial Success',
          description: `Removed ${successCount} members, ${failed.length} failed`,
          variant: 'destructive'
        });
        return { success: false, error: `${failed.length} operations failed` };
      }
    } catch (error: any) {
      console.error('Failed to remove members:', error);
      toast({
        title: 'Failed to Remove Members',
        description: error?.message || 'An error occurred',
        variant: 'destructive'
      });
      return { success: false, error: error?.message || 'Failed to remove members' };
    }
  }, [workspaceId, removeMember, permissions, toast]);

  const handleBulkUpdateRoles = useCallback(async (memberIds: string[], newRole: WorkspaceRole) => {
    if (!permissions.canManageUsers()) {
      toast({
        title: 'Permission Denied',
        description: 'You do not have permission to change member roles',
        variant: 'destructive'
      });
      return { success: false, error: 'Permission denied' };
    }

    try {
      const results = await Promise.allSettled(
        memberIds.map(id => updateMemberRole(workspaceId, id, newRole))
      );

      const failed = results.filter(r => r.status === 'rejected');
      
      if (failed.length === 0) {
        setSelectedMembers([]);
        toast({
          title: 'Success',
          description: `Updated ${memberIds.length} member roles`,
          variant: 'default'
        });
        return { success: true };
      } else {
        const successCount = memberIds.length - failed.length;
        toast({
          title: 'Partial Success',
          description: `Updated ${successCount} members, ${failed.length} failed`,
          variant: 'destructive'
        });
        return { success: false, error: `${failed.length} operations failed` };
      }
    } catch (error: any) {
      console.error('Failed to update member roles:', error);
      toast({
        title: 'Failed to Update Roles',
        description: error?.message || 'An error occurred',
        variant: 'destructive'
      });
      return { success: false, error: error?.message || 'Failed to update member roles' };
    }
  }, [workspaceId, updateMemberRole, permissions, toast]);

  // Selection management
  const toggleMemberSelection = useCallback((memberId: string) => {
    setSelectedMembers(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  }, []);

  const selectAllMembers = useCallback(() => {
    setSelectedMembers(filteredMembers.map(m => m.id));
  }, [filteredMembers]);

  const clearSelection = useCallback(() => {
    setSelectedMembers([]);
  }, []);

  // Refresh members
  const refreshMembers = useCallback(async () => {
    try {
      console.log('🔄 Refreshing members for workspace:', workspaceId);
      await fetchMembers(workspaceId);
      console.log('✅ Members refreshed successfully');
    } catch (error) {
      console.error('❌ Failed to refresh members:', error);
    }
  }, [workspaceId, fetchMembers]);

  // Get available roles for assignment
  const getAvailableRoles = useCallback(() => {
    const roles = permissions.getAvailableRoles();
    console.log('📋 Available roles:', roles);
    return roles;
  }, [permissions]);

  // Check if member can be managed
  const canManageMember = useCallback((member: WorkspaceMemberWithUser) => {
    const canChange = permissions.canChangeMemberRole(member);
    const canRemove = permissions.canRemoveMember(member);
    return canChange || canRemove;
  }, [permissions]);

  // Get member by ID
  const getMemberById = useCallback((memberId: string) => {
    return members.find(m => m.id === memberId);
  }, [members]);

  // Check if member is selected
  const isMemberSelected = useCallback((memberId: string) => {
    return selectedMembers.includes(memberId);
  }, [selectedMembers]);

  // Debug information
  const getDebugInfo = useCallback(() => {
    return {
      workspaceId,
      currentUserRole,
      isOwner,
      currentUserId,
      memberCount,
      permissions: permissions.getAllPermissions(),
      availableRoles: permissions.getAvailableRoles(),
      loading,
      error,
      addingMember
    };
  }, [workspaceId, currentUserRole, isOwner, currentUserId, memberCount, permissions, loading, error, addingMember]);

  // Log debug info when there are issues
  useEffect(() => {
    if (error) {
      console.error('🐛 Member management error:', {
        error,
        debugInfo: getDebugInfo()
      });
    }
  }, [error, getDebugInfo]);

  return {
    // State
    members,
    filteredMembers,
    memberCount,
    memberStats,
    loading,
    error,
    searchQuery,
    roleFilter,
    sortBy,
    selectedMembers,
    addingMember, // Add loading state for add member
    
    // Actions
    setSearchQuery,
    setRoleFilter,
    setSortBy,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleBulkRemoveMembers,
    handleBulkUpdateRoles,
    refreshMembers,
    
    // Selection
    toggleMemberSelection,
    selectAllMembers,
    clearSelection,
    isMemberSelected,
    
    // Utilities
    getAvailableRoles,
    canManageMember,
    getMemberById,
    permissions,
    getDebugInfo // Add debug function
  };
}

// Helper function to validate member data before adding
export function validateMemberData(memberData: {
  email: string;
  role: WorkspaceRole;
  userId?: string;
  user?: any;
}): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Email validation
  if (!memberData.email?.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(memberData.email)) {
      errors.push('Invalid email format');
    }
  }
  
  // Role validation
  if (!memberData.role) {
    errors.push('Role is required');
  } else {
    const validRoles: WorkspaceRole[] = ['admin', 'team_lead', 'viewer'];
    if (!validRoles.includes(memberData.role)) {
      errors.push('Invalid role specified');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}