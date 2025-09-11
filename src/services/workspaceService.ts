import { supabase } from '../integrations/supabase/client';
import type {
    Workspace,
    WorkspaceInsert,
    WorkspaceUpdate,
    WorkspaceWithMembers,
    WorkspaceMember,
    WorkspaceMemberInsert,
    WorkspaceMemberUpdate,
    WorkspaceMemberWithUser,
    Document,
    DocumentInsert,
    DocumentWithUploader,
    WorkspaceRole,
    CreateWorkspaceForm,
    AddMemberForm,
    UpdateMemberRoleForm,
    WorkspaceListResponse,
    WorkspaceMembersResponse,
    WorkspaceDocumentsResponse,
    UploadedFile
} from '../types/workspace';

export class WorkspaceService {
    // Workspace CRUD operations
    static async createWorkspace(data: CreateWorkspaceForm): Promise<Workspace> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        try {
            const { data: workspace, error } = await supabase
                .from('workspaces')
                .insert({
                    name: data.name,
                    owner_id: user.id
                })
                .select()
                .single();

            if (error) {
                console.error('Workspace creation error:', error);
                throw new Error(`Failed to create workspace: ${error.message}`);
            }

            return workspace;
        } catch (error) {
            console.error('Unexpected error creating workspace:', error);
            throw error;
        }
    }

    static async getWorkspaces(): Promise<WorkspaceListResponse> {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError) {
                console.error('Auth error:', authError);
                throw new Error('Authentication failed');
            }
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Get workspaces where user is owner OR member
            const { data: ownedWorkspaces, error: ownedError } = await supabase
                .from('workspaces')
                .select('*')
                .eq('owner_id', user.id);

            if (ownedError) {
                console.error('Error fetching owned workspaces:', ownedError);
                throw new Error(`Failed to fetch owned workspaces: ${ownedError.message}`);
            }

            // Get workspaces where user is a member
            const { data: memberWorkspaces, error: memberError } = await supabase
                .from('workspace_members')
                .select(`
                    workspace:workspaces(*)
                `)
                .eq('user_id', user.id);

            if (memberError) {
                console.error('Error fetching member workspaces:', memberError);
                throw new Error(`Failed to fetch member workspaces: ${memberError.message}`);
            }

            // Combine and deduplicate workspaces
            const allWorkspaces = [
                ...(ownedWorkspaces || []),
                ...(memberWorkspaces?.map(m => m.workspace).filter(Boolean) || [])
            ];

            // Remove duplicates based on workspace ID
            const uniqueWorkspaces = allWorkspaces.filter((workspace, index, self) =>
                index === self.findIndex(w => w.id === workspace.id)
            );

            // For each workspace, get members and document count separately
            const workspacesWithData = await Promise.all(
                (uniqueWorkspaces || []).map(async (workspace) => {
                    try {
                        // Get members for this workspace
                        const { data: members, error: membersError } = await supabase
                            .from('workspace_members')
                            .select(`
                *,
                user:profiles(
                  id,
                  email,
                  first_name,
                  last_name,
                  avatar_url
                )
              `)
                            .eq('workspace_id', workspace.id);

                        if (membersError) {
                            console.warn(`Error fetching members for workspace ${workspace.id}:`, membersError);
                        }

                        // Get document count for this workspace
                        const { count: documentCount, error: countError } = await supabase
                            .from('documents')
                            .select('*', { count: 'exact', head: true })
                            .eq('workspace_id', workspace.id);

                        if (countError) {
                            console.warn(`Error fetching document count for workspace ${workspace.id}:`, countError);
                        }

                        return {
                            ...workspace,
                            members: members || [],
                            document_count: documentCount || 0
                        };
                    } catch (error) {
                        console.error(`Error fetching data for workspace ${workspace.id}:`, error);
                        return {
                            ...workspace,
                            members: [],
                            document_count: 0
                        };
                    }
                })
            );

            return {
                workspaces: workspacesWithData as WorkspaceWithMembers[],
                total: workspacesWithData.length
            };
        } catch (error) {
            console.error('Error in getWorkspaces:', error);
            throw error;
        }
    }

    static async getWorkspace(id: string): Promise<WorkspaceWithMembers> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        try {
            // Get the workspace - user can access if they're owner OR member
            const { data: workspace, error } = await supabase
                .from('workspaces')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('Error fetching workspace:', error);
                throw error;
            }

            // Check if user has access to this workspace (owner or member)
            const isOwner = workspace.owner_id === user.id;
            const { data: memberCheck } = await supabase
                .from('workspace_members')
                .select('id')
                .eq('workspace_id', id)
                .eq('user_id', user.id)
                .single();

            if (!isOwner && !memberCheck) {
                throw new Error('You do not have access to this workspace');
            }

            // Get members for this workspace
            const { data: members } = await supabase
                .from('workspace_members')
                .select(`
          *,
          user:profiles(
            id,
            email,
            first_name,
            last_name,
            avatar_url
          )
        `)
                .eq('workspace_id', id);

            // Ensure workspace owner is included as admin member
            const ownerMember = members?.find(m => m.user_id === workspace.owner_id);
            if (!ownerMember) {
                // Add owner as admin if not already a member
                await supabase
                    .from('workspace_members')
                    .insert({
                        workspace_id: id,
                        user_id: workspace.owner_id,
                        role: 'admin'
                    })
                    .onConflict('workspace_id,user_id')
                    .ignoreDuplicates();

                // Fetch members again to include the owner
                const { data: updatedMembers } = await supabase
                    .from('workspace_members')
                    .select(`
            *,
            user:profiles(
              id,
              email,
              first_name,
              last_name,
              avatar_url
            )
          `)
                    .eq('workspace_id', id);

                return {
                    ...workspace,
                    members: updatedMembers || [],
                    document_count: documentCount || 0
                } as WorkspaceWithMembers;
            }

            // Get document count for this workspace
            const { count: documentCount } = await supabase
                .from('documents')
                .select('*', { count: 'exact', head: true })
                .eq('workspace_id', id);

            return {
                ...workspace,
                members: members || [],
                document_count: documentCount || 0
            } as WorkspaceWithMembers;
        } catch (error) {
            console.error('Error in getWorkspace:', error);
            throw error;
        }
    }

    static async updateWorkspace(id: string, data: WorkspaceUpdate): Promise<Workspace> {
        const { data: workspace, error } = await supabase
            .from('workspaces')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return workspace;
    }

    static async deleteWorkspace(id: string): Promise<void> {
        const { error } = await supabase
            .from('workspaces')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }

    // Workspace member operations
    static async getWorkspaceMembers(workspaceId: string): Promise<WorkspaceMembersResponse> {
        try {
            const { data: members, error } = await supabase
                .from('workspace_members')
                .select(`
            *,
            user:profiles(
              id,
              email,
              first_name,
              last_name,
              avatar_url
            )
          `)
                .eq('workspace_id', workspaceId);

            if (error) {
                console.error('Error fetching workspace members:', error);
                // Return empty array instead of throwing
                return {
                    members: [],
                    total: 0
                };
            }

            return {
                members: members as WorkspaceMemberWithUser[],
                total: members?.length || 0
            };
        } catch (error) {
            console.error('Unexpected error fetching workspace members:', error);
            return {
                members: [],
                total: 0
            };
        }
    }

    static async addWorkspaceMember(workspaceId: string, data: AddMemberForm & { userId?: string }): Promise<WorkspaceMember> {
        let userId: string;

        // If userId is provided (from mock users), use it directly
        if (data.userId) {
            userId = data.userId;
        } else {
            // Otherwise, find the user by email
            const { data: user, error: userError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', data.email)
                .single();

            if (userError || !user) {
                throw new Error('User not found with this email address');
            }
            userId = user.id;
        }

        // Check if user is already a member
        const { data: existingMember } = await supabase
            .from('workspace_members')
            .select('id')
            .eq('workspace_id', workspaceId)
            .eq('user_id', userId)
            .single();

        if (existingMember) {
            throw new Error('User is already a member of this workspace');
        }

        const { data: member, error } = await supabase
            .from('workspace_members')
            .insert({
                workspace_id: workspaceId,
                user_id: userId,
                role: data.role
            })
            .select()
            .single();

        if (error) {
            console.error('Error adding workspace member:', error);
            throw error;
        }
        return member;
    }

    static async updateMemberRole(workspaceId: string, memberId: string, data: UpdateMemberRoleForm): Promise<WorkspaceMember> {
        const { data: member, error } = await supabase
            .from('workspace_members')
            .update({ role: data.role })
            .eq('id', memberId)
            .eq('workspace_id', workspaceId)
            .select()
            .single();

        if (error) throw error;
        return member;
    }

    static async removeWorkspaceMember(workspaceId: string, memberId: string): Promise<void> {
        const { error } = await supabase
            .from('workspace_members')
            .delete()
            .eq('id', memberId)
            .eq('workspace_id', workspaceId);

        if (error) throw error;
    }

    // Document operations
    static async getWorkspaceDocuments(workspaceId: string): Promise<WorkspaceDocumentsResponse> {
        try {
            const { data: documents, error } = await supabase
                .from('documents')
                .select(`
            *,
            uploader:profiles(
              id,
              email,
              first_name,
              last_name,
              avatar_url
            )
          `)
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching workspace documents:', error);
                // Return empty array instead of throwing
                return {
                    documents: [],
                    total: 0
                };
            }

            return {
                documents: documents as DocumentWithUploader[],
                total: documents?.length || 0
            };
        } catch (error) {
            console.error('Unexpected error fetching workspace documents:', error);
            return {
                documents: [],
                total: 0
            };
        }
    }

    static async uploadDocument(workspaceId: string, file: File): Promise<Document> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Check if user has permission to upload documents
        const canUpload = await this.canPerformAction(workspaceId, 'upload');
        if (!canUpload) {
            throw new Error('You do not have permission to upload documents to this workspace');
        }

        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${workspaceId}/${fileName}`;

        // Upload file to storage
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('workspace-documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
            .from('workspace-documents')
            .getPublicUrl(filePath);

        // Save document metadata
        const { data: document, error: docError } = await supabase
            .from('documents')
            .insert({
                workspace_id: workspaceId,
                uploader_id: user.id,
                file_url: publicUrl,
                file_name: file.name,
                file_size: file.size,
                file_type: file.type
            })
            .select()
            .single();

        if (docError) throw docError;
        return document;
    }

    static async deleteDocument(documentId: string): Promise<void> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        // Get document info first
        const { data: document, error: docError } = await supabase
            .from('documents')
            .select('file_url, workspace_id')
            .eq('id', documentId)
            .single();

        if (docError) throw docError;

        // Check if user has permission to delete documents
        const canDelete = await this.canPerformAction(document.workspace_id, 'delete');
        if (!canDelete) {
            throw new Error('You do not have permission to delete documents from this workspace');
        }

        // Extract file path from URL
        const url = new URL(document.file_url);
        const filePath = url.pathname.split('/').slice(-2).join('/');

        // Delete from storage
        const { error: storageError } = await supabase.storage
            .from('workspace-documents')
            .remove([filePath]);

        if (storageError) throw storageError;

        // Delete from database
        const { error: deleteError } = await supabase
            .from('documents')
            .delete()
            .eq('id', documentId);

        if (deleteError) throw deleteError;
    }

    // Permission checking
    static async getUserWorkspaceRole(workspaceId: string): Promise<WorkspaceRole | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // Check if user is workspace owner
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('owner_id')
            .eq('id', workspaceId)
            .single();

        if (workspace?.owner_id === user.id) {
            return 'admin';
        }

        // Check if user is a member
        const { data: member } = await supabase
            .from('workspace_members')
            .select('role')
            .eq('workspace_id', workspaceId)
            .eq('user_id', user.id)
            .single();

        return member?.role as WorkspaceRole || null;
    }

    static async canPerformAction(workspaceId: string, action: string): Promise<boolean> {
        const role = await this.getUserWorkspaceRole(workspaceId);
        if (!role) return false;

        const permissions = {
            admin: ['view', 'edit', 'delete', 'upload', 'download', 'manage_users'],
            team_lead: ['view', 'edit', 'upload'],
            viewer: ['view']
        };

        return permissions[role]?.includes(action) || false;
    }

    // Search users for adding to workspace
    static async searchUsers(query: string): Promise<Array<{ id: string; email: string; first_name: string | null; last_name: string | null }>> {
        try {
            if (!query.trim()) {
                return [];
            }

            console.log('Searching for users with query:', query);

            // Try RPC function first
            const { data: users, error } = await supabase
                .rpc('search_users', { search_query: query });

            if (error) {
                console.error('Error searching users with RPC:', error);

                // Fallback to direct profiles table access
                const { data: allUsers, error: allUsersError } = await supabase
                    .from('profiles')
                    .select('id, email, first_name, last_name')
                    .limit(50);

                if (allUsersError) {
                    console.error('Error fetching all users:', allUsersError);
                    return [];
                }

                // Filter users based on query
                const filteredUsers = (allUsers || []).filter(user =>
                    user.email.toLowerCase().includes(query.toLowerCase()) ||
                    (user.first_name && user.first_name.toLowerCase().includes(query.toLowerCase())) ||
                    (user.last_name && user.last_name.toLowerCase().includes(query.toLowerCase()))
                );

                console.log('Filtered users from profiles:', filteredUsers);
                return filteredUsers.slice(0, 10);
            }

            console.log('Users found via RPC:', users);
            return users || [];
        } catch (error) {
            console.error('Error in searchUsers:', error);
            return [];
        }
    }
}
