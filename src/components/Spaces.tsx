import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  FolderOpen, 
  Users, 
  Share2, 
  Plus, 
  Settings,
  FileText,
  UserPlus,
  Building2,
  Search,
  Eye,
  Edit,
  Trash2,
  Crown,
  Shield
} from 'lucide-react';
import PermissionGuard from './PermissionGuard';
import { Role } from '@/lib/permissions';
import { toast } from 'sonner';

interface Space {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  filesShared: number;
  owner: string;
  createdAt: Date;
  isPrivate: boolean;
}

interface SpaceMember {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  joinedAt: Date;
}

interface SharedFile {
  id: string;
  name: string;
  type: string;
  sharedBy: string;
  sharedAt: Date;
  size: string;
}

const Spaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceMembers, setSpaceMembers] = useState<SpaceMember[]>([]);
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newSpaceDialogOpen, setNewSpaceDialogOpen] = useState(false);
  const [memberDialogOpen, setMemberDialogOpen] = useState(false);
  const [newSpace, setNewSpace] = useState({
    name: '',
    description: '',
    isPrivate: false
  });
  
  // Mock current user role - in real app, get from auth context
  const currentUserRole: Role = 'owner';

  // Mock data
  useEffect(() => {
    const mockSpaces: Space[] = [
      {
        id: '1',
        name: 'Marketing Team',
        description: 'Collaborative space for marketing campaigns and content',
        memberCount: 8,
        filesShared: 24,
        owner: 'Sarah Johnson',
        createdAt: new Date('2024-01-10'),
        isPrivate: false
      },
      {
        id: '2',
        name: 'Product Development',
        description: 'Private workspace for product roadmaps and specifications',
        memberCount: 12,
        filesShared: 45,
        owner: 'Mike Chen',
        createdAt: new Date('2024-01-05'),
        isPrivate: true
      },
      {
        id: '3',
        name: 'Client Projects',
        description: 'Shared space for client deliverables and communications',
        memberCount: 6,
        filesShared: 18,
        owner: 'Lisa Wong',
        createdAt: new Date('2024-01-15'),
        isPrivate: false
      }
    ];

    const mockMembers: SpaceMember[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@company.com',
        role: 'owner',
        joinedAt: new Date('2024-01-10')
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@company.com',
        role: 'admin',
        joinedAt: new Date('2024-01-11')
      },
      {
        id: '3',
        name: 'Lisa Wong',
        email: 'lisa@company.com',
        role: 'editor',
        joinedAt: new Date('2024-01-12')
      }
    ];

    const mockFiles: SharedFile[] = [
      {
        id: '1',
        name: 'Marketing Strategy Q1.pdf',
        type: 'PDF',
        sharedBy: 'Sarah Johnson',
        sharedAt: new Date('2024-01-20'),
        size: '2.4 MB'
      },
      {
        id: '2',
        name: 'Brand Guidelines.docx',
        type: 'Word',
        sharedBy: 'Mike Chen',
        sharedAt: new Date('2024-01-19'),
        size: '1.8 MB'
      }
    ];

    setSpaces(mockSpaces);
    setSpaceMembers(mockMembers);
    setSharedFiles(mockFiles);
  }, []);

  const handleCreateSpace = () => {
    if (!newSpace.name.trim()) {
      toast.error('Space name is required');
      return;
    }

    const space: Space = {
      id: Date.now().toString(),
      name: newSpace.name,
      description: newSpace.description,
      memberCount: 1,
      filesShared: 0,
      owner: 'Current User',
      createdAt: new Date(),
      isPrivate: newSpace.isPrivate
    };

    setSpaces(prev => [space, ...prev]);
    setNewSpace({ name: '', description: '', isPrivate: false });
    setNewSpaceDialogOpen(false);
    toast.success('Space created successfully');
  };

  const handleSelectSpace = (space: Space) => {
    setSelectedSpace(space);
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    space.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'owner': return Crown;
      case 'admin': return Shield;
      case 'editor': return Edit;
      default: return Eye;
    }
  };

  const getRoleBadgeColor = (role: Role) => {
    switch (role) {
      case 'owner': return 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20';
      case 'admin': return 'bg-red-500/10 text-red-700 border-red-500/20';
      case 'editor': return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
      default: return 'bg-gray-500/10 text-gray-700 border-gray-500/20';
    }
  };

  if (selectedSpace) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => setSelectedSpace(null)}
              className="flex items-center gap-2"
            >
              ← Back to Spaces
            </Button>
            <div>
              <h2 className="text-2xl font-bold text-foreground">{selectedSpace.name}</h2>
              <p className="text-muted-foreground">{selectedSpace.description}</p>
            </div>
          </div>
          <PermissionGuard role={currentUserRole} required="manage_roles">
            <Button>
              <Settings className="w-4 h-4 mr-2" />
              Space Settings
            </Button>
          </PermissionGuard>
        </div>

        {/* Space Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedSpace.memberCount}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Share2 className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedSpace.filesShared}</p>
                  <p className="text-sm text-muted-foreground">Files Shared</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/10 rounded-lg">
                  <Building2 className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{selectedSpace.isPrivate ? 'Private' : 'Public'}</p>
                  <p className="text-sm text-muted-foreground">Space Type</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Space Details Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="files">Files Shared</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Space Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Owner</label>
                  <p className="text-foreground">{selectedSpace.owner}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Created</label>
                  <p className="text-foreground">{selectedSpace.createdAt.toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Description</label>
                  <p className="text-foreground">{selectedSpace.description}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Space Members</h3>
              <PermissionGuard role={currentUserRole} required="add_member">
                <Dialog open={memberDialogOpen} onOpenChange={setMemberDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Space Member</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Input placeholder="Email address" />
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-md">
                        <option value="viewer">Viewer</option>
                        <option value="editor">Editor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <Button className="w-full" onClick={() => {
                        toast.success('Member added successfully');
                        setMemberDialogOpen(false);
                      }}>
                        Add Member
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </PermissionGuard>
            </div>

            <div className="grid gap-4">
              {spaceMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role);
                return (
                  <Card key={member.id} className="bg-card border-border">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback>
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <p className="text-sm text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRoleBadgeColor(member.role)}>
                            <RoleIcon className="w-3 h-3 mr-1" />
                            {member.role}
                          </Badge>
                          <PermissionGuard role={currentUserRole} required="remove_member">
                            <Button variant="ghost" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </PermissionGuard>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="files" className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Shared Files</h3>
              <PermissionGuard role={currentUserRole} required="share_files">
                <Button>
                  <Share2 className="w-4 h-4 mr-2" />
                  Share File
                </Button>
              </PermissionGuard>
            </div>

            <div className="grid gap-4">
              {sharedFiles.map((file) => (
                <Card key={file.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-8 h-8 text-primary" />
                        <div>
                          <h4 className="font-medium text-foreground">{file.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Shared by {file.sharedBy} • {file.sharedAt.toLocaleDateString()} • {file.size}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{file.type}</Badge>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Spaces</h2>
          <p className="text-muted-foreground">Collaborative workspaces for your team</p>
        </div>
        <PermissionGuard role={currentUserRole} required="create_space">
          <Dialog open={newSpaceDialogOpen} onOpenChange={setNewSpaceDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Space
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Space</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Space name"
                  value={newSpace.name}
                  onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
                />
                <Textarea
                  placeholder="Space description"
                  value={newSpace.description}
                  onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="private"
                    checked={newSpace.isPrivate}
                    onChange={(e) => setNewSpace({ ...newSpace, isPrivate: e.target.checked })}
                  />
                  <label htmlFor="private" className="text-sm text-foreground">
                    Make this space private
                  </label>
                </div>
                <Button onClick={handleCreateSpace} className="w-full">
                  Create Space
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </PermissionGuard>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search spaces..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Spaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpaces.map((space) => (
          <Card 
            key={space.id} 
            className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleSelectSpace(space)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">{space.name}</CardTitle>
                </div>
                {space.isPrivate && (
                  <Badge variant="secondary" className="text-xs">Private</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {space.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span>{space.memberCount} members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share2 className="w-4 h-4 text-muted-foreground" />
                  <span>{space.filesShared} files</span>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                Created by {space.owner} • {space.createdAt.toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No spaces found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'Try adjusting your search' : 'Create your first space to get started'}
          </p>
          <PermissionGuard role={currentUserRole} required="create_space">
            <Button onClick={() => setNewSpaceDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Space
            </Button>
          </PermissionGuard>
        </div>
      )}
    </div>
  );
};

export default Spaces;