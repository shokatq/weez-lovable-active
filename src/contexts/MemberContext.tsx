import React, { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '../integrations/supabase/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/use-toast';
import type { WorkspaceMemberWithUser, WorkspaceRole } from '../types/workspace';

// Member state management types
interface MemberState {
  members: Record<string, WorkspaceMemberWithUser[]>; // workspaceId -> members
  loading: Record<string, boolean>; // workspaceId -> loading state
  error: Record<string, string | null>; // workspaceId -> error message
  optimisticUpdates: Record<string, OptimisticUpdate[]>; // workspaceId -> pending updates
}

interface OptimisticUpdate {
  id: string;
  type: 'add' | 'remove' | 'update';
  data: any;
  timestamp: number;
}

interface MemberContextType {
  // State
  members: Record<string, WorkspaceMemberWithUser[]>;
  loading: Record<string, boolean>;
  error: Record<string, string | null>;
  
  // Actions
  fetchMembers: (workspaceId: string) => Promise<void>;
  addMember: (workspaceId: string, memberData: any) => Promise<void>;
  removeMember: (workspaceId: string, memberId: string) => Promise<void>;
  updateMemberRole: (workspaceId: string, memberId: string, role: WorkspaceRole) => Promise<void>;
  
  // Utilities
  getMembers: (workspaceId: string) => WorkspaceMemberWithUser[];
  getMemberCount: (workspaceId: string) => number;
  isLoading: (workspaceId: string) => boolean;
  getError: (workspaceId: string) => string | null;
  
  // Real-time
  subscribeToMembers: (workspaceId: string) => void;
  unsubscribeFromMembers: (workspaceId: string) => void;
}

// Action types
type MemberAction =
  | { type: 'FETCH_MEMBERS_START'; workspaceId: string }
  | { type: 'FETCH_MEMBERS_SUCCESS'; workspaceId: string; members: WorkspaceMemberWithUser[] }
  | { type: 'FETCH_MEMBERS_ERROR'; workspaceId: string; error: string }
  | { type: 'ADD_MEMBER_OPTIMISTIC'; workspaceId: string; member: WorkspaceMemberWithUser }
  | { type: 'ADD_MEMBER_SUCCESS'; workspaceId: string; member: WorkspaceMemberWithUser }
  | { type: 'ADD_MEMBER_ERROR'; workspaceId: string; error: string; memberId: string }
  | { type: 'REMOVE_MEMBER_OPTIMISTIC'; workspaceId: string; memberId: string }
  | { type: 'REMOVE_MEMBER_SUCCESS'; workspaceId: string; memberId: string }
  | { type: 'REMOVE_MEMBER_ERROR'; workspaceId: string; error: string; memberId: string }
  | { type: 'UPDATE_MEMBER_OPTIMISTIC'; workspaceId: string; memberId: string; updates: Partial<WorkspaceMemberWithUser> }
  | { type: 'UPDATE_MEMBER_SUCCESS'; workspaceId: string; memberId: string; updates: Partial<WorkspaceMemberWithUser> }
  | { type: 'UPDATE_MEMBER_ERROR'; workspaceId: string; error: string; memberId: string; originalData: WorkspaceMemberWithUser }
  | { type: 'REALTIME_MEMBER_ADDED'; workspaceId: string; member: WorkspaceMemberWithUser }
  | { type: 'REALTIME_MEMBER_REMOVED'; workspaceId: string; memberId: string }
  | { type: 'REALTIME_MEMBER_UPDATED'; workspaceId: string; memberId: string; updates: Partial<WorkspaceMemberWithUser> };

// Initial state
const initialState: MemberState = {
  members: {},
  loading: {},
  error: {},
  optimisticUpdates: {}
};

// Reducer
function memberReducer(state: MemberState, action: MemberAction): MemberState {
  switch (action.type) {
    case 'FETCH_MEMBERS_START':
      return {
        ...state,
        loading: { ...state.loading, [action.workspaceId]: true },
        error: { ...state.error, [action.workspaceId]: null }
      };

    case 'FETCH_MEMBERS_SUCCESS':
      return {
        ...state,
        members: { ...state.members, [action.workspaceId]: action.members },
        loading: { ...state.loading, [action.workspaceId]: false },
        error: { ...state.error, [action.workspaceId]: null }
      };

    case 'FETCH_MEMBERS_ERROR':
      return {
        ...state,
        loading: { ...state.loading, [action.workspaceId]: false },
        error: { ...state.error, [action.workspaceId]: action.error }
      };

    case 'ADD_MEMBER_OPTIMISTIC':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: [...(state.members[action.workspaceId] || []), action.member]
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: [
            ...(state.optimisticUpdates[action.workspaceId] || []),
            {
              id: action.member.id,
              type: 'add',
              data: action.member,
              timestamp: Date.now()
            }
          ]
        }
      };

    case 'ADD_MEMBER_SUCCESS':
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.member.id
          )
        }
      };

    case 'ADD_MEMBER_ERROR':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).filter(
            member => member.id !== action.memberId
          )
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.memberId
          )
        },
        error: { ...state.error, [action.workspaceId]: action.error }
      };

    case 'REMOVE_MEMBER_OPTIMISTIC':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).filter(
            member => member.id !== action.memberId
          )
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: [
            ...(state.optimisticUpdates[action.workspaceId] || []),
            {
              id: action.memberId,
              type: 'remove',
              data: null,
              timestamp: Date.now()
            }
          ]
        }
      };

    case 'REMOVE_MEMBER_SUCCESS':
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.memberId
          )
        }
      };

    case 'REMOVE_MEMBER_ERROR':
      // Rollback: re-add the member
      const removedMember = state.optimisticUpdates[action.workspaceId]?.find(
        update => update.id === action.memberId && update.type === 'remove'
      );
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: removedMember?.data 
            ? [...(state.members[action.workspaceId] || []), removedMember.data]
            : state.members[action.workspaceId]
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.memberId
          )
        },
        error: { ...state.error, [action.workspaceId]: action.error }
      };

    case 'UPDATE_MEMBER_OPTIMISTIC':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).map(member =>
            member.id === action.memberId ? { ...member, ...action.updates } : member
          )
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: [
            ...(state.optimisticUpdates[action.workspaceId] || []),
            {
              id: action.memberId,
              type: 'update',
              data: action.updates,
              timestamp: Date.now()
            }
          ]
        }
      };

    case 'UPDATE_MEMBER_SUCCESS':
      return {
        ...state,
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.memberId
          )
        }
      };

    case 'UPDATE_MEMBER_ERROR':
      // Rollback: restore original data
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).map(member =>
            member.id === action.memberId ? { ...member, ...action.originalData } : member
          )
        },
        optimisticUpdates: {
          ...state.optimisticUpdates,
          [action.workspaceId]: (state.optimisticUpdates[action.workspaceId] || []).filter(
            update => update.id !== action.memberId
          )
        },
        error: { ...state.error, [action.workspaceId]: action.error }
      };

    case 'REALTIME_MEMBER_ADDED':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: [...(state.members[action.workspaceId] || []), action.member]
        }
      };

    case 'REALTIME_MEMBER_REMOVED':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).filter(
            member => member.id !== action.memberId
          )
        }
      };

    case 'REALTIME_MEMBER_UPDATED':
      return {
        ...state,
        members: {
          ...state.members,
          [action.workspaceId]: (state.members[action.workspaceId] || []).map(member =>
            member.id === action.memberId ? { ...member, ...action.updates } : member
          )
        }
      };

    default:
      return state;
  }
}

// Context
const MemberContext = createContext<MemberContextType | undefined>(undefined);

// Provider component
interface MemberProviderProps {
  children: ReactNode;
}

export function MemberProvider({ children }: MemberProviderProps) {
  const [state, dispatch] = useReducer(memberReducer, initialState);
  const { user } = useAuth();
  const { toast } = useToast();
  const subscriptions = React.useRef<Record<string, any>>({});

  // Fetch members from API
  const fetchMembers = useCallback(async (workspaceId: string) => {
    if (!workspaceId) return;

    dispatch({ type: 'FETCH_MEMBERS_START', workspaceId });

    try {
      const { data: memberRows, error: membersError } = await supabase
        .from('workspace_members')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('created_at', { ascending: true });

      if (membersError) {
        throw new Error(membersError.message);
      }

      const userIds = (memberRows || []).map(m => m.user_id);
      let profilesById: Record<string, any> = {};

      if (userIds.length > 0) {
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('id, email, first_name, last_name, avatar_url')
          .in('id', userIds);

        if (!profilesError && profiles) {
          profilesById = Object.fromEntries(profiles.map(p => [p.id, p]));
        }
      }

      const membersWithUser: WorkspaceMemberWithUser[] = (memberRows || []).map(row => ({
        ...row,
        user: profilesById[row.user_id] || {
          id: row.user_id,
          email: '',
          first_name: null,
          last_name: null,
          avatar_url: null
        }
      }));

      dispatch({ type: 'FETCH_MEMBERS_SUCCESS', workspaceId, members: membersWithUser });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch members';
      dispatch({ type: 'FETCH_MEMBERS_ERROR', workspaceId, error: errorMessage });
    }
  }, []);

  // Add member with optimistic update
  const addMember = useCallback(async (workspaceId: string, memberData: any) => {
    if (!workspaceId) return;

    // Create optimistic member
    const optimisticMember: WorkspaceMemberWithUser = {
      id: `temp-${Date.now()}`,
      workspace_id: workspaceId,
      user_id: memberData.userId || memberData.user_id,
      role: memberData.role,
      created_at: new Date().toISOString(),
      user: memberData.user || {
        id: memberData.userId || memberData.user_id,
        email: memberData.email || '',
        first_name: memberData.first_name || null,
        last_name: memberData.last_name || null,
        avatar_url: null
      }
    };

    // Optimistic update
    dispatch({ type: 'ADD_MEMBER_OPTIMISTIC', workspaceId, member: optimisticMember });

    try {
      const { data: newMember, error } = await supabase
        .from('workspace_members')
        .insert({
          workspace_id: workspaceId,
          user_id: memberData.userId || memberData.user_id,
          role: memberData.role
        })
        .select()
        .single();

      if (error) throw error;

      // Fetch updated member with user data
      await fetchMembers(workspaceId);
      dispatch({ type: 'ADD_MEMBER_SUCCESS', workspaceId, member: newMember });

      toast({
        title: 'Success',
        description: 'Member added successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add member';
      dispatch({ type: 'ADD_MEMBER_ERROR', workspaceId, error: errorMessage, memberId: optimisticMember.id });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [fetchMembers, toast]);

  // Remove member with optimistic update
  const removeMember = useCallback(async (workspaceId: string, memberId: string) => {
    if (!workspaceId || !memberId) return;

    // Store original member for rollback
    const originalMember = state.members[workspaceId]?.find(m => m.id === memberId);
    if (!originalMember) return;

    // Optimistic update
    dispatch({ type: 'REMOVE_MEMBER_OPTIMISTIC', workspaceId, memberId });

    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', memberId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      dispatch({ type: 'REMOVE_MEMBER_SUCCESS', workspaceId, memberId });

      toast({
        title: 'Success',
        description: 'Member removed successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove member';
      dispatch({ 
        type: 'REMOVE_MEMBER_ERROR', 
        workspaceId, 
        error: errorMessage, 
        memberId,
        originalData: originalMember
      });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [state.members, toast]);

  // Update member role with optimistic update
  const updateMemberRole = useCallback(async (workspaceId: string, memberId: string, role: WorkspaceRole) => {
    if (!workspaceId || !memberId) return;

    const originalMember = state.members[workspaceId]?.find(m => m.id === memberId);
    if (!originalMember) return;

    // Optimistic update
    dispatch({ 
      type: 'UPDATE_MEMBER_OPTIMISTIC', 
      workspaceId, 
      memberId, 
      updates: { role } 
    });

    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role })
        .eq('id', memberId)
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      dispatch({ type: 'UPDATE_MEMBER_SUCCESS', workspaceId, memberId, updates: { role } });

      toast({
        title: 'Success',
        description: 'Member role updated successfully'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update member role';
      dispatch({ 
        type: 'UPDATE_MEMBER_ERROR', 
        workspaceId, 
        error: errorMessage, 
        memberId,
        originalData: originalMember
      });
      
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [state.members, toast]);

  // Real-time subscription
  const subscribeToMembers = useCallback((workspaceId: string) => {
    if (subscriptions.current[workspaceId]) return;

    const channel = supabase
      .channel(`workspace-members-${workspaceId}`)
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'workspace_members',
          filter: `workspace_id=eq.${workspaceId}`
        },
        async (payload) => {
          console.log('🔄 Real-time member added:', payload);
          // Fetch the new member with user data
          await fetchMembers(workspaceId);
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'DELETE', 
          schema: 'public', 
          table: 'workspace_members',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          console.log('🔄 Real-time member removed:', payload);
          dispatch({ 
            type: 'REALTIME_MEMBER_REMOVED', 
            workspaceId, 
            memberId: payload.old.id 
          });
        }
      )
      .on(
        'postgres_changes',
        { 
          event: 'UPDATE', 
          schema: 'public', 
          table: 'workspace_members',
          filter: `workspace_id=eq.${workspaceId}`
        },
        (payload) => {
          console.log('🔄 Real-time member updated:', payload);
          dispatch({ 
            type: 'REALTIME_MEMBER_UPDATED', 
            workspaceId, 
            memberId: payload.new.id,
            updates: { role: payload.new.role }
          });
        }
      )
      .subscribe();

    subscriptions.current[workspaceId] = channel;
  }, [fetchMembers]);

  // Unsubscribe from real-time updates
  const unsubscribeFromMembers = useCallback((workspaceId: string) => {
    if (subscriptions.current[workspaceId]) {
      supabase.removeChannel(subscriptions.current[workspaceId]);
      delete subscriptions.current[workspaceId];
    }
  }, []);

  // Utility functions
  const getMembers = useCallback((workspaceId: string) => {
    return state.members[workspaceId] || [];
  }, [state.members]);

  const getMemberCount = useCallback((workspaceId: string) => {
    return state.members[workspaceId]?.length || 0;
  }, [state.members]);

  const isLoading = useCallback((workspaceId: string) => {
    return state.loading[workspaceId] || false;
  }, [state.loading]);

  const getError = useCallback((workspaceId: string) => {
    return state.error[workspaceId] || null;
  }, [state.error]);

  // Cleanup subscriptions on unmount
  useEffect(() => {
    return () => {
      Object.values(subscriptions.current).forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, []);

  const contextValue: MemberContextType = {
    members: state.members,
    loading: state.loading,
    error: state.error,
    fetchMembers,
    addMember,
    removeMember,
    updateMemberRole,
    getMembers,
    getMemberCount,
    isLoading,
    getError,
    subscribeToMembers,
    unsubscribeFromMembers
  };

  return (
    <MemberContext.Provider value={contextValue}>
      {children}
    </MemberContext.Provider>
  );
}

// Hook to use member context
export function useMemberContext() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error('useMemberContext must be used within a MemberProvider');
  }
  return context;
}
