import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../integrations/supabase/client';
import { WorkspaceService } from '../services/workspaceService';
import type {
    WorkspaceWithMembers,
    WorkspaceRole,
    WorkspaceContextType,
    WorkspaceListResponse,
    WorkspaceMembersResponse,
    WorkspaceDocumentsResponse,
    CreateWorkspaceForm,
    AddMemberForm,
    UpdateMemberRoleForm,
    DocumentWithUploader,
    WorkspaceMemberWithUser
} from '../types/workspace';
import { useToast } from './use-toast';

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
    children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
    const [currentWorkspace, setCurrentWorkspace] = useState<WorkspaceWithMembers | null>(null);
    const [userRole, setUserRole] = useState<WorkspaceRole | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const canView = userRole !== null;
    const canEdit = userRole === 'admin' || userRole === 'team_lead';
    const canDelete = userRole === 'admin';
    const canManageUsers = userRole === 'admin';

    const loadWorkspace = async (workspaceId: string) => {
        try {
            setLoading(true);
            const workspace = await WorkspaceService.getWorkspace(workspaceId);
            setCurrentWorkspace(workspace);

            const role = await WorkspaceService.getUserWorkspaceRole(workspaceId);
            setUserRole(role);
        } catch (error) {
            console.error('Error loading workspace:', error);
            toast({
                title: 'Error',
                description: 'Failed to load workspace data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshWorkspace = async () => {
        if (!currentWorkspace) return;

        try {
            setLoading(true);
            const workspace = await WorkspaceService.getWorkspace(currentWorkspace.id);
            setCurrentWorkspace(workspace);

            const role = await WorkspaceService.getUserWorkspaceRole(currentWorkspace.id);
            setUserRole(role);
        } catch (error) {
            console.error('Error refreshing workspace:', error);
            toast({
                title: 'Error',
                description: 'Failed to refresh workspace data',
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const contextValue: WorkspaceContextType = {
        currentWorkspace,
        userRole,
        canView,
        canEdit,
        canDelete,
        canManageUsers,
        setCurrentWorkspace,
        refreshWorkspace,
        loadWorkspace
    };

    return (
        <WorkspaceContext.Provider value={contextValue}>
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(WorkspaceContext);
    if (context === undefined) {
        throw new Error('useWorkspace must be used within a WorkspaceProvider');
    }
    return context;
}

// Custom hooks for workspace operations
export function useWorkspaces() {
    const [workspaces, setWorkspaces] = useState<WorkspaceWithMembers[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchWorkspaces = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await WorkspaceService.getWorkspaces();
            setWorkspaces(response.workspaces);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch workspaces';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const createWorkspace = async (data: CreateWorkspaceForm) => {
        try {
            setLoading(true);
            const newWorkspace = await WorkspaceService.createWorkspace(data);
            await fetchWorkspaces(); // Refresh the list
            toast({
                title: 'Success',
                description: 'Workspace created successfully'
            });
            return newWorkspace;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to create workspace';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWorkspaces();
    }, []);

    return {
        workspaces,
        loading,
        error,
        fetchWorkspaces,
        createWorkspace
    };
}

export function useWorkspaceMembers(workspaceId: string) {
    const [members, setMembers] = useState<WorkspaceMemberWithUser[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchMembers = useCallback(async () => {
        if (!workspaceId) {
            console.log('⚠️ No workspace ID provided, skipping member fetch');
            return;
        }

        try {
            console.log('🔄 Fetching members for workspace:', workspaceId);
            setLoading(true);
            setError(null);
            const response = await WorkspaceService.getWorkspaceMembers(workspaceId);
            console.log('📋 Members fetched:', response.members.length, 'members');
            setMembers(response.members);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch members';
            console.error('❌ Error fetching members:', err);
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    }, [workspaceId, toast]);

    const addMember = async (data: AddMemberForm & { userId?: string }) => {
        try {
            setLoading(true);
            console.log('➕ Adding member:', data);
            const newMember = await WorkspaceService.addWorkspaceMember(workspaceId, data);
            console.log('✅ Member added successfully:', newMember);
            
            // Refresh members immediately
            await fetchMembers();
            
            // Also refresh after a short delay to ensure data consistency
            setTimeout(async () => {
                await fetchMembers();
            }, 1000);
            
            toast({
                title: 'Success',
                description: 'Member added successfully'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
            console.error('❌ Error adding member:', err);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateMemberRole = async (memberId: string, data: UpdateMemberRoleForm) => {
        try {
            setLoading(true);
            await WorkspaceService.updateMemberRole(workspaceId, memberId, data);
            // Refresh members immediately
            await fetchMembers();
            toast({
                title: 'Success',
                description: 'Member role updated successfully'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to update member role';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const removeMember = async (memberId: string) => {
        try {
            setLoading(true);
            await WorkspaceService.removeWorkspaceMember(workspaceId, memberId);
            // Refresh members immediately
            await fetchMembers();
            toast({
                title: 'Success',
                description: 'Member removed successfully'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMembers();
    }, [fetchMembers]);

    // Realtime: keep members list (and thus counts) in sync
    useEffect(() => {
        if (!workspaceId) return;

        const channel = supabase
            .channel(`workspace-members-${workspaceId}`)
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'workspace_members', filter: `workspace_id=eq.${workspaceId}` },
                () => {
                    fetchMembers();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [workspaceId, fetchMembers]);

    return {
        members,
        loading,
        error,
        fetchMembers,
        addMember,
        updateMemberRole,
        removeMember
    };
}

export function useWorkspaceDocuments(workspaceId: string) {
    const [documents, setDocuments] = useState<DocumentWithUploader[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const fetchDocuments = async () => {
        if (!workspaceId) return;

        try {
            setLoading(true);
            setError(null);
            const response = await WorkspaceService.getWorkspaceDocuments(workspaceId);
            setDocuments(response.documents);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to fetch documents';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
        } finally {
            setLoading(false);
        }
    };

    const uploadDocument = async (file: File) => {
        try {
            setLoading(true);
            await WorkspaceService.uploadDocument(workspaceId, file);
            // Refresh documents immediately
            await fetchDocuments();
            toast({
                title: 'Success',
                description: 'Document uploaded successfully'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to upload document';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteDocument = async (documentId: string) => {
        try {
            setLoading(true);
            await WorkspaceService.deleteDocument(documentId);
            // Refresh documents immediately
            await fetchDocuments();
            toast({
                title: 'Success',
                description: 'Document deleted successfully'
            });
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to delete document';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive'
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [workspaceId]);

    return {
        documents,
        loading,
        error,
        fetchDocuments,
        uploadDocument,
        deleteDocument
    };
}

export function useUserSearch() {
    const [users, setUsers] = useState<Array<{ id: string; email: string; first_name: string | null; last_name: string | null }>>([]);
    const [loading, setLoading] = useState(false);

    const searchUsers = async (query: string) => {
        if (!query.trim()) {
            setUsers([]);
            return;
        }

        try {
            setLoading(true);
            const results = await WorkspaceService.searchUsers(query);
            setUsers(results);
        } catch (error) {
            console.error('Error searching users:', error);
            setUsers([]);
            // Don't show error toast for search - it's not critical
        } finally {
            setLoading(false);
        }
    };

    return {
        users,
        loading,
        searchUsers
    };
}
