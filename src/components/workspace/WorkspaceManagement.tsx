import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
    Plus,
    Users,
    FileText,
    Settings,
    MoreHorizontal,
    Calendar,
    UserPlus,
    Upload,
    Eye,
    Edit,
    Trash2,
    Download,
    RefreshCw,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useWorkspaces, useWorkspaceDocuments } from '../../hooks/useWorkspace';
import { useMemberContext } from '../../contexts/MemberContext';
import { WorkspaceService } from '../../services/workspaceService';
import { usePermissions } from '../../utils/permissions';
import { MemberList } from './MemberList';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { AddMemberDialog } from './AddMemberDialog';
import { DocumentUploadDialog } from './DocumentUploadDialog';
import { UpdateMemberRoleDialog } from './UpdateMemberRoleDialog';
import { DocumentViewer } from './DocumentViewer';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import type { WorkspaceWithMembers, WorkspaceRole, DocumentWithUploader } from '../../types/workspace';
import { WORKSPACE_ROLES } from '../../types/workspace';

interface WorkspaceManagementProps {
    workspaceId?: string;
}

export function WorkspaceManagement({ workspaceId }: WorkspaceManagementProps) {
    const navigate = useNavigate();
    // Call useAuth first to avoid initialization issues
    const { user } = useAuth();

    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithMembers | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; role: WorkspaceRole } | null>(null);
    const [viewingDocument, setViewingDocument] = useState<DocumentWithUploader | null>(null);
    const [deletingWorkspace, setDeletingWorkspace] = useState<WorkspaceWithMembers | null>(null);
    
    // Store member counts for each workspace
    const [workspaceMemberCounts, setWorkspaceMemberCounts] = useState<Record<string, number>>({});

    const { workspaces, loading: workspacesLoading, createWorkspace, fetchWorkspaces } = useWorkspaces();
    const {
        getMembers,
        getMemberCount,
        addMember,
        updateMemberRole,
        removeMember,
        subscribeToMembers,
        unsubscribeFromMembers,
        fetchMembers
    } = useMemberContext();
    const {
        documents,
        loading: documentsLoading,
        uploadDocument,
        deleteDocument
    } = useWorkspaceDocuments(selectedWorkspace?.id || '');

    // Update member count when members change for selected workspace
    useEffect(() => {
        if (selectedWorkspace) {
            const memberCount = getMemberCount(selectedWorkspace.id);
            console.log('Updating member count for workspace:', selectedWorkspace.id, 'Members:', memberCount);
            setWorkspaceMemberCounts(prev => ({
                ...prev,
                [selectedWorkspace.id]: memberCount
            }));
        }
    }, [selectedWorkspace, getMemberCount]);

    // Initialize member counts from workspace data
    useEffect(() => {
        if (workspaces.length > 0) {
            const initialCounts: Record<string, number> = {};
            workspaces.forEach(workspace => {
                // Use the actual member count from the workspace data
                initialCounts[workspace.id] = workspace.members?.length || 0;
                console.log(`Initializing member count for workspace ${workspace.id}: ${workspace.members?.length || 0} members`);
            });
            setWorkspaceMemberCounts(initialCounts);
        }
    }, [workspaces]);

    // Show loading state while user is being fetched
    if (!user) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading user...</p>
                </div>
            </div>
        );
    }

    const handleCreateWorkspace = async (data: { name: string }) => {
        try {
            console.log('🎯 Creating workspace from WorkspaceManagement:', data);
            await createWorkspace(data);
            setShowCreateDialog(false);
            console.log('✅ Workspace creation completed in WorkspaceManagement');
        } catch (error) {
            console.error('❌ Error in handleCreateWorkspace:', error);
            // Error handling is done in the hook
        }
    };

    const handleAddMember = async (data: { email: string; role: WorkspaceRole; userId?: string }) => {
        try {
            console.log('🎯 Adding member to workspace:', selectedWorkspace?.id, data);
            
            // Add member using the context
            await addMember(selectedWorkspace.id, data);
            
            // Force refresh the member context to ensure MemberList gets updated data
            console.log('🔄 Force refreshing members for current workspace...');
            await fetchMembers(selectedWorkspace.id, true); // Force refresh
            
            // Update the selected workspace's member count immediately
            if (selectedWorkspace) {
                const updatedMemberCount = getMemberCount(selectedWorkspace.id);
                setSelectedWorkspace(prev => prev ? {
                    ...prev,
                    member_count: updatedMemberCount
                } : null);
                
                // Also update the workspace member counts state
                setWorkspaceMemberCounts(prev => ({
                    ...prev,
                    [selectedWorkspace.id]: updatedMemberCount
                }));
            }
            
            // Also refresh workspace list to update member counts in sidebar
            console.log('🔄 Refreshing workspace list...');
            await fetchWorkspaces();
            
            setShowAddMemberDialog(false);
            
            console.log('✅ Member addition completed and data refreshed');
        } catch (error) {
            console.error('❌ Error in handleAddMember:', error);
            // Error handling is done in the hook
        }
    };

    const handleUpdateMemberRole = async (data: { role: WorkspaceRole }) => {
        if (!editingMember || !selectedWorkspace) return;

        try {
            await updateMemberRole(selectedWorkspace.id, editingMember.id, data.role);
            
            // Force refresh the member context
            await fetchMembers(selectedWorkspace.id, true);
            
            setEditingMember(null);
            
            // Refresh workspace list to update member counts in sidebar
            await fetchWorkspaces();
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (!selectedWorkspace) return;
        
        if (confirm('Are you sure you want to remove this member?')) {
            try {
                await removeMember(selectedWorkspace.id, memberId);
                
                // Force refresh the member context
                await fetchMembers(selectedWorkspace.id, true);
                
                // Update the member count for this workspace immediately
                const updatedMemberCount = getMemberCount(selectedWorkspace.id);
                setWorkspaceMemberCounts(prev => ({
                    ...prev,
                    [selectedWorkspace.id]: updatedMemberCount
                }));
                
                // Refresh workspace list to update member counts in sidebar
                await fetchWorkspaces();
            } catch (error) {
                // Error handling is done in the hook
            }
        }
    };

    const handleUploadDocument = async (file: File) => {
        try {
            await uploadDocument(file);
            setShowUploadDialog(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleDeleteWorkspace = async (workspace: WorkspaceWithMembers) => {
        if (!workspace) return;
        
        const confirmed = window.confirm(
            `Are you sure you want to delete the workspace "${workspace.name}"?\n\nThis will permanently delete:\n- All workspace members\n- All documents\n- All workspace data\n\nThis action cannot be undone.`
        );
        
        if (!confirmed) return;

        try {
            console.log('🗑️ Deleting workspace:', workspace.id);
            await WorkspaceService.deleteWorkspace(workspace.id);
            
            // Clear selected workspace if it was the deleted one
            if (selectedWorkspace?.id === workspace.id) {
                setSelectedWorkspace(null);
            }
            
            // Refresh workspace list
            await fetchWorkspaces();
            
            console.log('✅ Workspace deleted successfully');
        } catch (error) {
            console.error('❌ Error deleting workspace:', error);
            alert('Failed to delete workspace. Please try again.');
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(documentId);
            } catch (error) {
                // Error handling is done in the hook
            }
        }
    };

    const getUserRole = (workspace: WorkspaceWithMembers): WorkspaceRole => {
        // Check if current user is owner
        if (workspace.owner_id === user?.id) return 'admin';

        // Check if current user is a member
        const member = workspace.members.find(m => m.user_id === user?.id);
        return (member?.role as WorkspaceRole) || 'viewer';
    };

    const canManageWorkspace = (workspace: WorkspaceWithMembers): boolean => {
        const role = getUserRole(workspace);
        return role === 'admin';
    };

    const canUploadDocuments = (workspace: WorkspaceWithMembers): boolean => {
        const role = getUserRole(workspace);
        return role === 'admin' || role === 'team_lead';
    };

    const canDownloadDocuments = (workspace: WorkspaceWithMembers): boolean => {
        const role = getUserRole(workspace);
        return role === 'admin';
    };

    const canEditDocuments = (workspace: WorkspaceWithMembers): boolean => {
        const role = getUserRole(workspace);
        return role === 'admin' || role === 'team_lead';
    };

    const canDeleteDocuments = (workspace: WorkspaceWithMembers): boolean => {
        const role = getUserRole(workspace);
        return role === 'admin';
    };

    // Helper function to get member count for a workspace
    const getWorkspaceMemberCount = (workspace: WorkspaceWithMembers): number => {
        // Use the member_count from the workspace data (most accurate)
        const count = workspace.member_count || 0;
        console.log('Getting member count for workspace:', workspace.id, 'Count:', count, 'From member_count field');
        return count;
    };

    // Helper function to get members for display
    const getMembersForDisplay = (workspace: WorkspaceWithMembers) => {
        if (selectedWorkspace?.id === workspace.id) {
            return getMembers(workspace.id);
        }
        return workspace.members;
    };

    // Debug logging for workspace state
    console.log('🔍 WorkspaceManagement Debug Info:');
    console.log('- Workspaces count:', workspaces.length);
    console.log('- Workspaces data:', workspaces);
    console.log('- Loading state:', workspacesLoading);
    console.log('- Selected workspace:', selectedWorkspace?.id);

    if (workspacesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading workspaces and member data...</p>
                    <p className="text-sm text-muted-foreground mt-2">This may take a moment to sync all workspace information</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" onClick={() => navigate('/chat')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Workspace Management</h1>
                        <p className="text-muted-foreground text-sm">
                            Manage your spaces, members and files
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {workspaces.length} workspace{workspaces.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => {
                            console.log('🔄 Manual refresh triggered');
                            fetchWorkspaces();
                        }}
                        disabled={workspacesLoading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${workspacesLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Workspace
                    </Button>
                </div>
            </div>


            {workspaces.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                <Settings className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">No workspaces yet</h3>
                                <p className="text-muted-foreground">
                                    Create your first workspace to get started with team collaboration
                                </p>
                            </div>
                            <Button onClick={() => setShowCreateDialog(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Your First Workspace
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Workspace List */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Workspaces</CardTitle>
                                <CardDescription>
                                    Select a workspace to manage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {workspaces.map((workspace) => {
                                    const memberCount = getWorkspaceMemberCount(workspace);
                                    const displayMembers = getMembersForDisplay(workspace);
                                    
                                    // Debug information
                                    console.log(`Workspace ${workspace.name}:`, {
                                        id: workspace.id,
                                        member_count: workspace.member_count,
                                        members_array_length: workspace.members?.length,
                                        calculated_count: memberCount,
                                        display_members: displayMembers.length
                                    });
                                    
                                    return (
                                        <div
                                            key={workspace.id}
                                            className={`p-2 rounded-lg border cursor-pointer transition-colors ${selectedWorkspace?.id === workspace.id
                                                ? 'border-primary bg-primary/5'
                                                : 'border-border hover:bg-muted/50'
                                                }`}
                                            onClick={async () => {
                                                console.log('Selecting workspace:', workspace.id, 'with members:', workspace.members.length);
                                                setSelectedWorkspace(workspace);
                                                
                                                // Load members for the selected workspace
                                                console.log('🔄 Loading members for selected workspace...');
                                                await fetchMembers(workspace.id, true);
                                                
                                                // Subscribe to real-time updates
                                                subscribeToMembers(workspace.id);
                                            }}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium truncate text-sm">{workspace.name}</h4>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="secondary" className="text-[10px]">
                                                            {getUserRole(workspace)}
                                                        </Badge>
                                                        <span className="text-[11px] text-muted-foreground">
                                                            {memberCount} members
                                                        </span>
                                                    </div>
                                                    {memberCount > 0 && (
                                                        <div className="mt-1 text-[11px] text-muted-foreground">
                                                            {displayMembers.slice(0, 3).map((member, index) => (
                                                                <span key={member.id}>
                                                                    {member.user.first_name} {member.user.last_name} ({WORKSPACE_ROLES[member.role as WorkspaceRole]?.label || member.role})
                                                                    {index < Math.min(memberCount, 3) - 1 && ', '}
                                                                </span>
                                                            ))}
                                                            {memberCount > 3 && (
                                                                <span> +{memberCount - 3} more</span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                {canManageWorkspace(workspace) && (
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-7 w-7">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Settings</DropdownMenuItem>
                                                            <DropdownMenuItem 
                                                                className="text-destructive"
                                                                onClick={() => handleDeleteWorkspace(workspace)}
                                                            >
                                                                Delete Workspace
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Workspace Details */}
                    <div className="lg:col-span-2">
                        {selectedWorkspace ? (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle className="text-xl">{selectedWorkspace.name}</CardTitle>
                                            <CardDescription>
                                                Created {formatDistanceToNow(new Date(selectedWorkspace.created_at))} ago
                                            </CardDescription>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline">
                                                {getUserRole(selectedWorkspace)}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="grid w-full grid-cols-3">
                                            <TabsTrigger value="overview">Overview</TabsTrigger>
                                            <TabsTrigger value="members">Members</TabsTrigger>
                                            <TabsTrigger value="documents">Documents</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="overview" className="space-y-4">
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-5 w-5 text-muted-foreground" />
                                                        <span className="font-medium">Members</span>
                                                    </div>
                                                    <p className="text-xl font-bold mt-1">{getMemberCount(selectedWorkspace.id)}</p>
                                                    {getMemberCount(selectedWorkspace.id) > 0 ? (
                                                        <div className="mt-2 space-y-1">
                                                            {getMembers(selectedWorkspace.id).slice(0, 3).map((member) => (
                                                                <div key={member.id} className="text-sm text-muted-foreground">
                                                                    {member.user.first_name} {member.user.last_name} ({WORKSPACE_ROLES[member.role as WorkspaceRole]?.label || member.role})
                                                                </div>
                                                            ))}
                                                            {getMemberCount(selectedWorkspace.id) > 3 && (
                                                                <div className="text-sm text-muted-foreground">
                                                                    +{getMemberCount(selectedWorkspace.id) - 3} more members
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="mt-2 text-sm text-muted-foreground">
                                                            No members added yet
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-3 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                                        <span className="font-medium">Documents</span>
                                                    </div>
                                                    <p className="text-xl font-bold mt-1">{selectedWorkspace.document_count}</p>
                                                    <div className="mt-2 text-sm text-muted-foreground">
                                                        {selectedWorkspace.document_count === 0 ? 'No documents uploaded' : 'Documents uploaded'}
                                                    </div>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="members" className="space-y-4">
                                            <MemberList
                                                workspaceId={selectedWorkspace.id}
                                                currentUserRole={getUserRole(selectedWorkspace)}
                                                isOwner={selectedWorkspace.owner_id === user?.id}
                                                currentUserId={user?.id || null}
                                                onAddMember={() => setShowAddMemberDialog(true)}
                                            />
                                        </TabsContent>

                                        <TabsContent value="documents" className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Documents</h3>
                                                {canUploadDocuments(selectedWorkspace) && (
                                                    <Button onClick={() => setShowUploadDialog(true)}>
                                                        <Upload className="h-4 w-4 mr-2" />
                                                        Upload Document
                                                    </Button>
                                                )}
                                            </div>

                                            {documentsLoading ? (
                                                <div className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                                    <p className="text-sm text-muted-foreground">Loading documents...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {documents.map((document) => (
                                                        <div key={document.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                                                                    <FileText className="h-4 w-4" />
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium">{document.file_name}</p>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Uploaded by {document.uploader.first_name} {document.uploader.last_name} • {' '}
                                                                        {formatDistanceToNow(new Date(document.created_at))} ago
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => setViewingDocument(document)}
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                {canDownloadDocuments(selectedWorkspace) && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            const link = window.document.createElement('a');
                                                                            link.href = document.file_url;
                                                                            link.download = document.file_name;
                                                                            link.target = '_blank';
                                                                            window.document.body.appendChild(link);
                                                                            link.click();
                                                                            window.document.body.removeChild(link);
                                                                        }}
                                                                    >
                                                                        <Download className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                {canDeleteDocuments(selectedWorkspace) && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => handleDeleteDocument(document.id)}
                                                                        className="text-destructive hover:text-destructive"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="flex items-center justify-center py-12">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                                            <Settings className="h-8 w-8 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold">Select a workspace</h3>
                                            <p className="text-muted-foreground">
                                                Choose a workspace from the list to view its details and manage members
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            )}

            {/* Dialogs */}
            <CreateWorkspaceDialog
                open={showCreateDialog}
                onOpenChange={setShowCreateDialog}
                onSubmit={handleCreateWorkspace}
            />

            <AddMemberDialog
                open={showAddMemberDialog}
                onOpenChange={setShowAddMemberDialog}
                onSubmit={handleAddMember}
            />

            <DocumentUploadDialog
                open={showUploadDialog}
                onOpenChange={setShowUploadDialog}
                onSubmit={handleUploadDocument}
            />

            <UpdateMemberRoleDialog
                open={!!editingMember}
                onOpenChange={(open) => !open && setEditingMember(null)}
                member={editingMember}
                onSubmit={handleUpdateMemberRole}
            />

            <DocumentViewer
                document={viewingDocument}
                open={!!viewingDocument}
                onOpenChange={(open) => !open && setViewingDocument(null)}
            />
        </div>
    );
}