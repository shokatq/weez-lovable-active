import React, { useState } from 'react';
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
    Download
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useWorkspaces, useWorkspaceMembers, useWorkspaceDocuments } from '../../hooks/useWorkspace';
import { CreateWorkspaceDialog } from './CreateWorkspaceDialog';
import { AddMemberDialog } from './AddMemberDialog';
import { DocumentUploadDialog } from './DocumentUploadDialog';
import { UpdateMemberRoleDialog } from './UpdateMemberRoleDialog';
import { DocumentViewer } from './DocumentViewer';
import { useAuth } from '../../hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import type { WorkspaceWithMembers, WorkspaceRole, DocumentWithUploader } from '../../types/workspace';
import { WorkspaceDebug } from '../debug/WorkspaceDebug';

interface WorkspaceManagementProps {
    workspaceId?: string;
}

export function WorkspaceManagement({ workspaceId }: WorkspaceManagementProps) {
    // Call useAuth first to avoid initialization issues
    const { user } = useAuth();

    const [selectedWorkspace, setSelectedWorkspace] = useState<WorkspaceWithMembers | null>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; role: WorkspaceRole } | null>(null);
    const [viewingDocument, setViewingDocument] = useState<DocumentWithUploader | null>(null);

    const { workspaces, loading: workspacesLoading, createWorkspace } = useWorkspaces();
    const {
        members,
        loading: membersLoading,
        addMember,
        updateMemberRole,
        removeMember
    } = useWorkspaceMembers(selectedWorkspace?.id || '');
    const {
        documents,
        loading: documentsLoading,
        uploadDocument,
        deleteDocument
    } = useWorkspaceDocuments(selectedWorkspace?.id || '');

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
            await createWorkspace(data);
            setShowCreateDialog(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleAddMember = async (data: { email: string; role: WorkspaceRole; userId?: string }) => {
        try {
            await addMember(data);
            setShowAddMemberDialog(false);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleUpdateMemberRole = async (data: { role: WorkspaceRole }) => {
        if (!editingMember) return;

        try {
            await updateMemberRole(editingMember.id, data);
            setEditingMember(null);
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (confirm('Are you sure you want to remove this member?')) {
            try {
                await removeMember(memberId);
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
        return member?.role as WorkspaceRole || 'none';
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

    if (workspacesLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading workspaces...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Workspace Management</h1>
                    <p className="text-muted-foreground">
                        Manage your workspaces, team members, and documents
                    </p>
                </div>
                <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Workspace
                </Button>
            </div>

            {/* Debug Component - Remove this after debugging */}
            <WorkspaceDebug />


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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Workspace List */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle>Your Workspaces</CardTitle>
                                <CardDescription>
                                    Select a workspace to manage
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {workspaces.map((workspace) => (
                                    <div
                                        key={workspace.id}
                                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedWorkspace?.id === workspace.id
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:bg-muted/50'
                                            }`}
                                        onClick={() => setSelectedWorkspace(workspace)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium truncate">{workspace.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {getUserRole(workspace)}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground">
                                                        {workspace.members.length} members
                                                    </span>
                                                </div>
                                                {workspace.members.length > 0 && (
                                                    <div className="mt-2 text-xs text-muted-foreground">
                                                        {workspace.members.slice(0, 3).map((member, index) => (
                                                            <span key={member.id}>
                                                                {member.user.first_name} {member.user.last_name} ({member.role})
                                                                {index < Math.min(workspace.members.length, 3) - 1 && ', '}
                                                            </span>
                                                        ))}
                                                        {workspace.members.length > 3 && (
                                                            <span> +{workspace.members.length - 3} more</span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {canManageWorkspace(workspace) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Settings</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive">
                                                            Delete Workspace
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                ))}
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
                                            <CardTitle>{selectedWorkspace.name}</CardTitle>
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
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="p-4 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="h-5 w-5 text-muted-foreground" />
                                                        <span className="font-medium">Members</span>
                                                    </div>
                                                    <p className="text-2xl font-bold mt-2">{selectedWorkspace.members.length}</p>
                                                    {selectedWorkspace.members.length > 0 && (
                                                        <div className="mt-3 space-y-1">
                                                            {selectedWorkspace.members.map((member) => (
                                                                <div key={member.id} className="text-sm text-muted-foreground">
                                                                    {member.user.first_name} {member.user.last_name} ({member.role})
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-4 border rounded-lg">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                                        <span className="font-medium">Documents</span>
                                                    </div>
                                                    <p className="text-2xl font-bold mt-2">{selectedWorkspace.document_count}</p>
                                                </div>
                                            </div>
                                        </TabsContent>

                                        <TabsContent value="members" className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Team Members</h3>
                                                {canManageWorkspace(selectedWorkspace) && (
                                                    <Button onClick={() => setShowAddMemberDialog(true)}>
                                                        <UserPlus className="h-4 w-4 mr-2" />
                                                        Add Member
                                                    </Button>
                                                )}
                                            </div>

                                            {membersLoading ? (
                                                <div className="text-center py-8">
                                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                                    <p className="text-sm text-muted-foreground">Loading members...</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-2">
                                                    {members.map((member) => (
                                                        <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={member.user.avatar_url || undefined} />
                                                                    <AvatarFallback>
                                                                        {member.user.first_name?.[0]}{member.user.last_name?.[0]}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">
                                                                        {member.user.first_name} {member.user.last_name}
                                                                    </p>
                                                                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Badge variant="secondary">{member.role}</Badge>
                                                                {canManageWorkspace(selectedWorkspace) && (
                                                                    <DropdownMenu>
                                                                        <DropdownMenuTrigger asChild>
                                                                            <Button variant="ghost" size="sm">
                                                                                <MoreHorizontal className="h-4 w-4" />
                                                                            </Button>
                                                                        </DropdownMenuTrigger>
                                                                        <DropdownMenuContent align="end">
                                                                            <DropdownMenuItem
                                                                                onClick={() => setEditingMember({ id: member.id, role: member.role as WorkspaceRole })}
                                                                            >
                                                                                <Edit className="h-4 w-4 mr-2" />
                                                                                Change Role
                                                                            </DropdownMenuItem>
                                                                            <DropdownMenuItem
                                                                                onClick={() => handleRemoveMember(member.id)}
                                                                                className="text-destructive"
                                                                            >
                                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                                Remove
                                                                            </DropdownMenuItem>
                                                                        </DropdownMenuContent>
                                                                    </DropdownMenu>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
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

