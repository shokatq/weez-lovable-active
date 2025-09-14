// Enhanced MemberContext.tsx
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { WorkspaceRole, WorkspaceMemberWithUser } from '@/types/workspace';
import { WorkspaceService } from '@/services/workspaceService';

interface MemberState {
  [workspaceId: string]: {
    members: WorkspaceMemberWithUser[];
    loading: boolean;
    error: string | null;
    lastFetched: number | null;
    initialized: boolean;
  };
}

interface MemberContextValue {
  getMembers: (workspaceId: string) => WorkspaceMemberWithUser[];
  getMemberCount: (workspaceId: string) => number;
  isLoading: (workspaceId: string) => boolean;
  getError: (workspaceId: string) => string | null;
  fetchMembers: (workspaceId: string, force?: boolean) => Promise<void>;
  addMember: (workspaceId: string, memberData: AddMemberData) => Promise<any>;
  removeMember: (workspaceId: string, memberId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, memberId: string, role: WorkspaceRole) => Promise<void>;
  subscribeToMembers: (workspaceId: string) => void;
  unsubscribeFromMembers: (workspaceId: string) => void;
  clearMemberData: (workspaceId: string) => void;
  refreshAllWorkspaces: () => Promise<void>;
}

interface AddMemberData {
  email: string;
  role: WorkspaceRole;
  userId?: string;
  user?: any;
}

type MemberAction = 
  | { type: 'FETCH_START'; workspaceId: string }
  | { type: 'FETCH_SUCCESS'; workspaceId: string; members: WorkspaceMemberWithUser[] }
  | { type: 'FETCH_ERROR'; workspaceId: string; error: string }
  | { type: 'ADD_MEMBER'; workspaceId: string; member: WorkspaceMemberWithUser }
  | { type: 'REMOVE_MEMBER'; workspaceId: string; memberId: string }
  | { type: 'UPDATE_MEMBER_ROLE'; workspaceId: string; memberId: string; role: WorkspaceRole }
  | { type: 'CLEAR_DATA'; workspaceId: string }
  | { type: 'SET_INITIALIZED'; workspaceId: string };

const initialState: MemberState = {};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function memberReducer(state: MemberState, action: MemberAction): MemberState {
  switch (action.type) {
    case 'FETCH_START':
      return {
        ...state,
        [action.workspaceId]: {
          ...state[action.workspaceId],
          loading: true,
          error: null
        }
      };

    case 'FETCH_SUCCESS':
      return {
        ...state,
        [action.workspaceId]: {
          members: action.members,
          loading: false,
          error: null,
          lastFetched: Date.now(),
          initialized: true
        }
      };

    case 'FETCH_ERROR':
      return {
        ...state,
        [action.workspaceId]: {
          ...state[action.workspaceId],
          loading: false,
          error: action.error,
          initialized: true
        }
      };

    case 'ADD_MEMBER':
      const currentState = state[action.workspaceId];
      if (!currentState) return state;
      
      return {
        ...state,
        [action.workspaceId]: {
          ...currentState,
          members: [...currentState.members, action.member]
        }
      };

    case 'REMOVE_MEMBER':
      const removeState = state[action.workspaceId];
      if (!removeState) return state;
      
      return {
        ...state,
        [action.workspaceId]: {
          ...removeState,
          members: removeState.members.filter(m => m.id !== action.memberId)
        }
      };

    case 'UPDATE_MEMBER_ROLE':
      const updateState = state[action.workspaceId];
      if (!updateState) return state;
      
      return {
        ...state,
        [action.workspaceId]: {
          ...updateState,
          members: updateState.members.map(m =>
            m.id === action.memberId ? { ...m, role: action.role } : m
          )
        }
      };

    case 'CLEAR_DATA':
      const { [action.workspaceId]: _, ...rest } = state;
      return rest;

    case 'SET_INITIALIZED':
      return {
        ...state,
        [action.workspaceId]: {
          ...state[action.workspaceId],
          initialized: true
        }
      };

    default:
      return state;
  }
}

const MemberContext = createContext<MemberContextValue | null>(null);

export function MemberProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(memberReducer, initialState);
  const { toast } = useToast();


  // Initialize workspace member data
  const initializeWorkspace = useCallback((workspaceId: string) => {
    if (!state[workspaceId]) {
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        workspaceId, 
        members: [] 
      });
    }
  }, [state]);

  // Check if data needs refresh
  const needsRefresh = useCallback((workspaceId: string, force = false): boolean => {
    const workspaceState = state[workspaceId];
    if (!workspaceState || !workspaceState.initialized) return true;
    if (force) return true;
    if (!workspaceState.lastFetched) return true;
    
    const elapsed = Date.now() - workspaceState.lastFetched;
    return elapsed > CACHE_DURATION;
  }, [state]);

  // Fetch members for a workspace
  const fetchMembers = useCallback(async (workspaceId: string, force = false) => {
    console.log(`🔍 Fetching members for workspace ${workspaceId}, force: ${force}`);
    
    if (!workspaceId) {
      console.error('❌ No workspace ID provided');
      return;
    }

    // Check if we need to fetch
    if (!needsRefresh(workspaceId, force)) {
      console.log('📋 Using cached member data');
      return;
    }

    dispatch({ type: 'FETCH_START', workspaceId });

    try {
      // Use WorkspaceService instead of non-existent API endpoints
      const response = await WorkspaceService.getWorkspaceMembers(workspaceId);
      const members = response.members || [];
      
      console.log(`✅ Successfully fetched ${members.length} members`);
      
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        workspaceId, 
        members 
      });

    } catch (error: any) {
      console.error('❌ Error fetching members:', error);
      const errorMessage = error.message || 'Failed to fetch workspace members';
      
      dispatch({ 
        type: 'FETCH_ERROR', 
        workspaceId, 
        error: errorMessage 
      });

      toast({
        title: 'Failed to Load Members',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [needsRefresh, toast]);

  // Add member to workspace
  const addMember = useCallback(async (workspaceId: string, memberData: AddMemberData) => {
    console.log(`🚀 Adding member to workspace ${workspaceId}:`, memberData);

    if (!workspaceId) {
      throw new Error('Workspace ID is required');
    }

    if (!memberData.email?.trim()) {
      throw new Error('Email is required');
    }

    // Check if member already exists
    const currentMembers = state[workspaceId]?.members || [];
    const existingMember = currentMembers.find(m => 
      m.user.email.toLowerCase() === memberData.email.toLowerCase()
    );

    if (existingMember) {
      const error = new Error('MEMBER_ALREADY_EXISTS');
      error.name = 'MEMBER_ALREADY_EXISTS';
      throw error;
    }

    try {
      // Use WorkspaceService instead of non-existent API endpoints
      await WorkspaceService.addWorkspaceMember(workspaceId, {
        email: memberData.email.trim(),
        role: memberData.role,
        ...(memberData.userId && { userId: memberData.userId })
      });

      // Fetch the updated members list to get the full member data with user info
      const response = await WorkspaceService.getWorkspaceMembers(workspaceId);
      const members = response.members || [];
      
      // Find the newly added member
      const newMember = members.find(m => 
        m.user.email === memberData.email.trim() && m.role === memberData.role
      );

      if (newMember) {
        console.log('✅ Successfully added member:', newMember);

        dispatch({ 
          type: 'ADD_MEMBER', 
          workspaceId, 
          member: newMember 
        });
      } else {
        // If we can't find the new member, refresh the entire list
        dispatch({ 
          type: 'FETCH_SUCCESS', 
          workspaceId, 
          members 
        });
      }

      toast({
        title: 'Member Added',
        description: `Successfully added ${memberData.email} to the workspace`,
        variant: 'default'
      });

      return newMember;

    } catch (error: any) {
      console.error('❌ Error adding member:', error);
      
      // Handle specific error cases with user-friendly messages
      if (error.message?.includes('already a member') || error.message?.includes('already exists')) {
        toast({
          title: 'Member Already Added',
          description: `The member ${memberData.email} is already added to the space`,
          variant: 'destructive'
        });
        throw error;
      }

      if (error.message?.includes('User not found')) {
        toast({
          title: 'User Not Found',
          description: `No user found with email ${memberData.email}. Please check the email address.`,
          variant: 'destructive'
        });
        throw error;
      }

      if (error.message?.includes('permission') || error.message?.includes('Permission')) {
        toast({
          title: 'Permission Denied',
          description: 'You do not have permission to add members to this workspace.',
          variant: 'destructive'
        });
        throw error;
      }

      // Generic error fallback
      toast({
        title: 'Failed to Add Member',
        description: error.message || 'An unexpected error occurred while adding the member',
        variant: 'destructive'
      });
      
      throw error;
    }
  }, [state, toast]);

  // Remove member from workspace
  const removeMember = useCallback(async (workspaceId: string, memberId: string) => {
    console.log(`🗑️ Removing member ${memberId} from workspace ${workspaceId}`);

    try {
      // Use WorkspaceService instead of non-existent API endpoints
      await WorkspaceService.removeWorkspaceMember(workspaceId, memberId);

      dispatch({ 
        type: 'REMOVE_MEMBER', 
        workspaceId, 
        memberId 
      });

      toast({
        title: 'Member Removed',
        description: 'Member has been removed from the workspace',
        variant: 'default'
      });

    } catch (error: any) {
      console.error('❌ Error removing member:', error);
      
      toast({
        title: 'Failed to Remove Member',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      
      throw error;
    }
  }, [toast]);

  // Update member role
  const updateMemberRole = useCallback(async (workspaceId: string, memberId: string, role: WorkspaceRole) => {
    console.log(`🔄 Updating member ${memberId} role to ${role} in workspace ${workspaceId}`);

    try {
      // Use WorkspaceService instead of non-existent API endpoints
      await WorkspaceService.updateMemberRole(workspaceId, memberId, { role });

      dispatch({ 
        type: 'UPDATE_MEMBER_ROLE', 
        workspaceId, 
        memberId, 
        role 
      });

      toast({
        title: 'Role Updated',
        description: `Member role has been updated to ${role}`,
        variant: 'default'
      });

    } catch (error: any) {
      console.error('❌ Error updating member role:', error);
      
      toast({
        title: 'Failed to Update Role',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
      
      throw error;
    }
  }, [toast]);

  // Auto-fetch members when workspace is accessed
  const subscribeToMembers = useCallback((workspaceId: string) => {
    console.log(`📡 Subscribing to members for workspace ${workspaceId}`);
    initializeWorkspace(workspaceId);
    fetchMembers(workspaceId);
  }, [initializeWorkspace, fetchMembers]);

  const unsubscribeFromMembers = useCallback((workspaceId: string) => {
    console.log(`📡 Unsubscribing from members for workspace ${workspaceId}`);
    // Could implement cleanup logic here if needed
  }, []);

  // Clear member data
  const clearMemberData = useCallback((workspaceId: string) => {
    dispatch({ type: 'CLEAR_DATA', workspaceId });
  }, []);

  // Refresh all workspace member counts (for workspace list)
  const refreshAllWorkspaces = useCallback(async () => {
    console.log('🔄 Refreshing all workspace member counts');
    
    const workspaceIds = Object.keys(state);
    await Promise.all(
      workspaceIds.map(workspaceId => fetchMembers(workspaceId, true))
    );
  }, [state, fetchMembers]);

  // Auto-initialize workspaces on mount
  useEffect(() => {
    // This could fetch a list of user's workspaces and initialize them
    console.log('🚀 MemberProvider initialized');
  }, []);

  // Getter functions
  const getMembers = useCallback((workspaceId: string) => {
    const workspaceState = state[workspaceId];
    if (!workspaceState) {
      // Auto-fetch if not initialized
      fetchMembers(workspaceId);
      return [];
    }
    return workspaceState.members || [];
  }, [state, fetchMembers]);

  const getMemberCount = useCallback((workspaceId: string) => {
    const workspaceState = state[workspaceId];
    if (!workspaceState) {
      // Auto-fetch if not initialized
      fetchMembers(workspaceId);
      return 0;
    }
    return workspaceState.members?.length || 0;
  }, [state, fetchMembers]);

  const isLoading = useCallback((workspaceId: string) => {
    return state[workspaceId]?.loading || false;
  }, [state]);

  const getError = useCallback((workspaceId: string) => {
    return state[workspaceId]?.error || null;
  }, [state]);

  const value: MemberContextValue = {
    getMembers,
    getMemberCount,
    isLoading,
    getError,
    fetchMembers,
    addMember,
    removeMember,
    updateMemberRole,
    subscribeToMembers,
    unsubscribeFromMembers,
    clearMemberData,
    refreshAllWorkspaces
  };

  return (
    <MemberContext.Provider value={value}>
      {children}
    </MemberContext.Provider>
  );
}

export function useMemberContext() {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
}