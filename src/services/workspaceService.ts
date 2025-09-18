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
    // Ensure the workspace owner exists in workspace_members as admin
    private static async ensureOwnerMembership(workspaceId: string): Promise<void> {
        const { data: workspace } = await supabase
            .from('workspaces')
            .select('owner_id')
            .eq('id', workspaceId)
            .single();

        if (!workspace?.owner_id) return;

        // Check if owner is already a member
        const { data: existingMember } = await supabase
            .from('workspace_members')
            .select('id')
            .eq('workspace_id', workspaceId)
            .eq('user_id', workspace.owner_id)
            .single();

        // Only insert if not already a member
        if (!existingMember) {
            const { error } = await supabase
                .from('workspace_members')
                .insert({
                    workspace_id: workspaceId,
                    user_id: workspace.owner_id,
                    role: 'admin'
                });

            if (error) {
                console.error('Error adding owner as admin member:', error);
                // Don't throw here as this is a best-effort operation
            }
        }
    }
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

            // Ensure owner is added as admin member for RLS and counts
            if (workspace?.id) {
                await this.ensureOwnerMembership(workspace.id);
            }

            return workspace as Workspace;
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

            console.log('🔍 Fetching workspaces for user:', user.id);

            // First, get workspace IDs where user is a member
            const { data: memberWorkspaces, error: memberError } = await supabase
                .from('workspace_members')
                .select('workspace_id')
                .eq('user_id', user.id);

            if (memberError) {
                console.error('Error fetching member workspaces:', memberError);
                throw new Error(`Failed to fetch member workspaces: ${memberError.message}`);
            }

            const memberWorkspaceIds = memberWorkspaces?.map(m => m.workspace_id) || [];

            // Get all workspaces where user is owner OR member
            const { data: workspaces, error: workspacesError } = await supabase
                .from('workspaces')
                .select('*')
                .or(`owner_id.eq.${user.id},id.in.(${memberWorkspaceIds.join(',')})`);

            if (workspacesError) {
                console.error('Error fetching workspaces:', workspacesError);
                throw new Error(`Failed to fetch workspaces: ${workspacesError.message}`);
            }

            console.log('📊 Raw workspaces data:', workspaces);

            // Process workspaces to get accurate member counts and basic member info
            const workspacesWithData = await Promise.all(
                (workspaces || []).map(async (workspace) => {
                    try {
                        await this.ensureOwnerMembership(workspace.id);
                        
                        // Get member count efficiently
                        const { count: memberCount, error: memberCountError } = await supabase
                            .from('workspace_members')
                            .select('*', { count: 'exact', head: true })
                            .eq('workspace_id', workspace.id);

                        if (memberCountError) {
                            console.warn(`Error fetching member count for workspace ${workspace.id}:`, memberCountError);
                        }

                        // Get document count for this workspace
                        const { count: documentCount, error: documentCountError } = await supabase
                            .from('documents')
                            .select('*', { count: 'exact', head: true })
                            .eq('workspace_id', workspace.id);

                        if (documentCountError) {
                            console.warn(`Error fetching document count for workspace ${workspace.id}:`, documentCountError);
                        }

                        // Get basic member info for display (limit to 3 for performance)
                        const { data: memberRows, error: membersError } = await supabase
                            .from('workspace_members')
                            .select('id, user_id, role, created_at')
                            .eq('workspace_id', workspace.id)
                            .order('created_at', { ascending: true })
                            .limit(3);

                        if (membersError) {
                            console.warn(`Error fetching member details for workspace ${workspace.id}:`, membersError);
                        }

                        const members = (memberRows || []).map(row => ({
                            id: row.id,
                            user_id: row.user_id,
                            role: row.role,
                            created_at: row.created_at,
                            user: {
                                id: row.user_id,
                                email: 'user@example.com', // Placeholder - will be fetched separately if needed
                                raw_user_meta_data: null
                            }
                        }));

                        console.log(`✅ Workspace ${workspace.id}: ${memberCount || 0} members, ${documentCount || 0} documents`);

                        return {
                            ...workspace,
                            members,
                            member_count: memberCount || 0,
                            document_count: documentCount || 0,
                            admin_name: 'Admin' // Simplified for now
                        };
                    } catch (error) {
                        console.error(`Error processing workspace ${workspace.id}:`, error);
                        return {
                            ...workspace,
                            members: [],
                            member_count: 0,
                            document_count: 0,
                            admin_name: 'Admin' // Simplified for now
                        };
                    }
                })
            );

            console.log('🎉 Processed workspaces:', workspacesWithData);

            return {
                workspaces: workspacesWithData as unknown as WorkspaceWithMembers[],
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

            // Ensure owner membership exists before fetching members
            await this.ensureOwnerMembership(id);

            // Fetch raw members, then hydrate profiles defensively
            const { data: memberRows } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('workspace_id', id);

            const ids = (memberRows || []).map(m => m.user_id);
            let profilesById: Record<string, { id: string; email: string; first_name: string | null; last_name: string | null; avatar_url: string | null }> = {};
            if (ids.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, email, first_name, last_name, avatar_url')
                    .in('id', ids);
                profilesById = Object.fromEntries((profiles || []).map(p => [p.id, p]));
            }

            const members = (memberRows || []).map(row => ({
                ...row,
                user: profilesById[row.user_id] || {
                    id: row.user_id,
                    email: '',
                    first_name: null,
                    last_name: null,
                    avatar_url: null
                }
            }));

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
            console.log('🔍 Fetching members for workspace:', workspaceId);
            await this.ensureOwnerMembership(workspaceId);

            // Fetch raw member rows first (avoid join RLS issues)
            const { data: memberRows, error: membersError } = await supabase
                .from('workspace_members')
                .select('*')
                .eq('workspace_id', workspaceId)
                .order('created_at', { ascending: true });

            console.log('📊 Raw member rows:', memberRows, 'Error:', membersError);

            if (membersError) {
                console.error('Error fetching workspace members:', membersError);
                return { members: [], total: 0 };
            }

            const userIds = (memberRows || []).map(m => m.user_id);
            console.log('👥 User IDs to fetch profiles for:', userIds);
            
            let profilesById: Record<string, { id: string; email: string; first_name: string | null; last_name: string | null; avatar_url: string | null }> = {};

            if (userIds.length > 0) {
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, email, first_name, last_name, avatar_url')
                    .in('id', userIds);

                console.log('👤 Profiles fetched:', profiles, 'Error:', profilesError);

                if (!profilesError && profiles) {
                    profilesById = Object.fromEntries(profiles.map(p => [p.id, p]));
                } else if (profilesError) {
                    console.warn('Profiles fetch blocked by RLS; proceeding without user details');
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

            console.log('✅ Final members with user data:', membersWithUser);
            return { members: membersWithUser, total: membersWithUser.length };
        } catch (error) {
            console.error('Unexpected error fetching workspace members:', error);
            return { members: [], total: 0 };
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

            if (userError) {
                if (userError.code === 'PGRST116') {
                    throw new Error('User not found with this email address');
                }
                console.error('Error finding user by email:', userError);
                throw new Error('Failed to find user');
            }
            
            if (!user) {
                throw new Error('User not found with this email address');
            }
            userId = user.id;
        }

        // Check if user is already a member
        const { data: existingMember, error: checkError } = await supabase
            .from('workspace_members')
            .select('id, role')
            .eq('workspace_id', workspaceId)
            .eq('user_id', userId)
            .single();

        if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing member:', checkError);
            throw new Error('Failed to check existing membership');
        }

        if (existingMember) {
            const error = new Error('The member is already added to the space');
            error.name = 'MEMBER_ALREADY_EXISTS';
            throw error;
        }

        // Validate role
        const validRoles = ['admin', 'team_lead', 'viewer'];
        if (!validRoles.includes(data.role)) {
            throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
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
            
            // Provide specific error messages based on error codes
            if (error.code === '23505') { // Unique constraint violation
                throw new Error('The member is already added to the space');
            } else if (error.code === '23503') { // Foreign key violation
                throw new Error('Invalid workspace or user reference');
            } else if (error.code === '23514') { // Check constraint violation
                throw new Error(`Invalid role. Must be one of: ${validRoles.join(', ')}`);
            }
            
            throw new Error(`Failed to add member: ${error.message}`);
        }
        
        if (!member) {
            throw new Error('Failed to add member - no data returned');
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

            console.log('🔍 Searching for users with query:', query);

            // Search profiles directly with secure access
            const { data: users, error } = await supabase
                .from('profiles')
                .select('id, email, first_name, last_name')
                .or(`email.ilike.%${query}%,first_name.ilike.%${query}%,last_name.ilike.%${query}%`)
                .limit(20);

            if (error) {
                console.error('Error searching users:', error);
                return [];
            }

            console.log('🔍 Users found:', users?.length);
            return users || [];
        } catch (error) {
            console.error('Error in searchUsers:', error);
            return [];
        }
    }
}
