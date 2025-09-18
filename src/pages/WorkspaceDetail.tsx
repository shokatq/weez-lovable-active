import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import {
    ArrowLeft,
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
} from '../components/ui/dropdown-menu';
import { useWorkspace, useWorkspaceDocuments } from '../hooks/useWorkspace';
import { useMemberContext, MemberProvider } from '../contexts/MemberContext';
import { AddMemberDialog } from '../components/workspace/AddMemberDialog';
import { DocumentUploadDialog } from '../components/workspace/DocumentUploadDialog';
import { UpdateMemberRoleDialog } from '../components/workspace/UpdateMemberRoleDialog';
import { formatDistanceToNow } from 'date-fns';
import { WorkspaceProvider } from '../hooks/useWorkspace';
import type { WorkspaceRole } from '../types/workspace';

function WorkspaceDetailContent() {
    const { workspaceId } = useParams<{ workspaceId: string }>();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('chat');
    const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [editingMember, setEditingMember] = useState<{ id: string; role: WorkspaceRole } | null>(null);

    const {
        currentWorkspace,
        userRole,
        canEdit,
        canDelete,
        canManageUsers,
        setCurrentWorkspace,
        refreshWorkspace,
        loadWorkspace
    } = useWorkspace();

    const {
        getMembers,
        isLoading,
        addMember,
        updateMemberRole,
        removeMember,
        fetchMembers
    } = useMemberContext();

    const members = getMembers(workspaceId || '');
    const membersLoading = isLoading(workspaceId || '');

    const {
        documents,
        loading: documentsLoading,
        uploadDocument,
        deleteDocument
    } = useWorkspaceDocuments(workspaceId || '');

    // Load workspace data when component mounts or workspaceId changes
    useEffect(() => {
        if (workspaceId) {
            loadWorkspace(workspaceId);
            // Also fetch members for this workspace
            fetchMembers(workspaceId);
        }
    }, [workspaceId, loadWorkspace, fetchMembers]);

    const handleAddMember = async (data: { email: string; role: WorkspaceRole }) => {
        try {
            if (workspaceId) {
                await addMember(workspaceId, data);
                setShowAddMemberDialog(false);
                await refreshWorkspace(); // Refresh workspace data
            }
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleUpdateMemberRole = async (data: { role: WorkspaceRole }) => {
        if (!editingMember || !workspaceId) return;

        try {
            await updateMemberRole(workspaceId, editingMember.id, data.role);
            setEditingMember(null);
            await refreshWorkspace(); // Refresh workspace data
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        if (confirm('Are you sure you want to remove this member?')) {
            try {
                if (workspaceId) {
                    await removeMember(workspaceId, memberId);
                    await refreshWorkspace(); // Refresh workspace data
                }
            } catch (error) {
                // Error handling is done in the hook
            }
        }
    };

    const handleUploadDocument = async (file: File) => {
        try {
            await uploadDocument(file);
            setShowUploadDialog(false);
            await refreshWorkspace(); // Refresh workspace data
        } catch (error) {
            // Error handling is done in the hook
        }
    };

    const handleDeleteDocument = async (documentId: string) => {
        if (confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(documentId);
                await refreshWorkspace(); // Refresh workspace data
            } catch (error) {
                // Error handling is done in the hook
            }
        }
    };

    if (!currentWorkspace) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">Loading workspace...</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Fetching members and documents...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/workspace-management')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Workspaces
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-bold">{currentWorkspace.name}</h1>
                        <Badge variant="outline">{userRole}</Badge>
                    </div>
                    <p className="text-muted-foreground">
                        Created {formatDistanceToNow(new Date(currentWorkspace.created_at))} ago
                    </p>
                </div>
                {canManageUsers && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Settings
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Workspace Settings</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                                Delete Workspace
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>

            {/* Workspace Content */}
            <Card>
                <CardContent className="p-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="chat">Chat</TabsTrigger>
                            <TabsTrigger value="files">Files</TabsTrigger>
                            <TabsTrigger value="operations">Operations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="chat" className="space-y-4 mt-6">
                            <div className="rounded-md border p-6 bg-muted/30">
                                <h3 className="text-lg font-semibold mb-1">{`Chat in ${currentWorkspace.name}`}</h3>
                                <p className="text-sm text-muted-foreground">Collaborate seamlessly across tasks and conversations. Start chatting with your team or connect tasks to stay on top of your work.</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 border rounded-md text-sm text-muted-foreground">
                                Chat UI placeholder. Hook this up to your messages list and composer.
                            </div>
                        </TabsContent>

                        <TabsContent value="files" className="space-y-4 mt-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Files</h3>
                                    <p className="text-sm text-muted-foreground">Documents ({documents.length})</p>
                                </div>
                                {canEdit && (
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
                                                <Button variant="ghost" size="sm" asChild>
                                                    <a href={document.file_url} target="_blank" rel="noopener noreferrer">
                                                        <Eye className="h-4 w-4" />
                                                    </a>
                                                </Button>
                                                {canEdit && (
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <a href={document.file_url} download={document.file_name}>
                                                            <Download className="h-4 w-4" />
                                                        </a>
                                                    </Button>
                                                )}
                                                {canDelete && (
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

                        <TabsContent value="operations" className="space-y-4 mt-6">
                            <div className="rounded-md border p-6 bg-muted/30">
                                <h3 className="text-lg font-semibold mb-1">Data & Operations</h3>
                                <p className="text-sm text-muted-foreground">Chat with files and run data operations for this space.</p>
                            </div>
                            <div className="flex items-center gap-2 p-3 border rounded-md text-sm text-muted-foreground">
                                Operations chat interface placeholder.
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            {/* Dialogs */}
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
        </div>
    );
}

export default function WorkspaceDetailPage() {
    return (
        <WorkspaceProvider>
            <MemberProvider>
                <WorkspaceDetailContent />
            </MemberProvider>
        </WorkspaceProvider>
    );
}
