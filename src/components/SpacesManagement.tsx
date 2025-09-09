import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { SpacesService, Space, SpaceMember } from '@/services/spacesService';
import { SpaceFileManager } from './SpaceFileManager';
import { 
  FolderOpen, 
  Users, 
  Plus, 
  UserPlus,
  ArrowLeft,
  Crown,
  Shield,
  Edit,
  Eye,
  Search,
  Mail
} from 'lucide-react';

const SpacesManagement = () => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceMembers, setSpaceMembers] = useState<SpaceMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Dialog states
  const [createSpaceDialog, setCreateSpaceDialog] = useState(false);
  const [inviteMemberDialog, setInviteMemberDialog] = useState(false);

  // Form states
  const [newSpace, setNewSpace] = useState({ name: '', description: '' });
  const [invitation, setInvitation] = useState({ email: '', role: 'viewer' as 'admin' | 'team_lead' | 'viewer' | 'employee' });

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {
    if (selectedSpace) {
      loadSpaceMembers(selectedSpace.id);
    }
  }, [selectedSpace]);

  const loadSpaces = async () => {
    setLoading(true);
    const data = await SpacesService.getAllSpaces();
    setSpaces(data);
    setLoading(false);
  };

  const loadSpaceMembers = async (spaceId: string) => {
    const members = await SpacesService.getSpaceMembers(spaceId);
    setSpaceMembers(members);
  };

  const handleCreateSpace = async () => {
    if (!newSpace.name.trim()) {
      toast({
        title: "Error",
        description: "Space name is required",
        variant: "destructive"
      });
      return;
    }

    const spaceId = await SpacesService.createSpace(newSpace.name, newSpace.description);
    if (spaceId) {
      toast({
        title: "Success",
        description: "Space created successfully"
      });
      setNewSpace({ name: '', description: '' });
      setCreateSpaceDialog(false);
      await loadSpaces();
    } else {
      toast({
        title: "Error",
        description: "Failed to create space",
        variant: "destructive"
      });
    }
  };

  const handleInviteMember = async () => {
    if (!invitation.email.trim() || !selectedSpace) {
      toast({
        title: "Error",
        description: "Email is required",
        variant: "destructive"
      });
      return;
    }

    const success = await SpacesService.inviteMemberToSpace(
      selectedSpace.id,
      invitation.email,
      invitation.role,
      selectedSpace.name
    );

    if (success) {
      toast({
        title: "Success",
        description: "Invitation sent successfully"
      });
      setInvitation({ email: '', role: 'viewer' });
      setInviteMemberDialog(false);
    } else {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return Crown;
      case 'team_lead': return Shield;
      case 'employee': return Edit;
      default: return Eye;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'team_lead': return 'default';
      case 'employee': return 'secondary';
      default: return 'outline';
    }
  };

  const filteredSpaces = spaces.filter(space =>
    space.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (space.description?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading spaces...</div>
      </div>
    );
  }

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
              <ArrowLeft className="w-4 h-4" />
              Back to Spaces
            </Button>
            <div>
              <h2 className="text-2xl font-bold">{selectedSpace.name}</h2>
              <p className="text-muted-foreground">{selectedSpace.description}</p>
            </div>
          </div>
          <Dialog open={inviteMemberDialog} onOpenChange={setInviteMemberDialog}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Member to {selectedSpace.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="email"
                  placeholder="Email address"
                  value={invitation.email}
                  onChange={(e) => setInvitation({ ...invitation, email: e.target.value })}
                />
    <Select value={invitation.role} onValueChange={(value: 'admin' | 'team_lead' | 'viewer' | 'employee') => setInvitation({ ...invitation, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">Viewer - Can only view files</SelectItem>
                        <SelectItem value="employee">Employee - Can upload and view files</SelectItem>
                        <SelectItem value="team_lead">Team Leader - Can view and edit files</SelectItem>
                        <SelectItem value="admin">Admin - Full access to files</SelectItem>
                      </SelectContent>
                    </Select>
                <Button onClick={handleInviteMember} className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invitation
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Space Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{spaceMembers.length}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <FolderOpen className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">Active</p>
                  <p className="text-sm text-muted-foreground">Space Status</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>Space Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {spaceMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role || 'viewer');
                return (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {member.profile?.first_name?.[0] || member.profile?.email?.[0]?.toUpperCase() || '?'}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">
                          {member.profile?.first_name && member.profile?.last_name 
                            ? `${member.profile.first_name} ${member.profile.last_name}`
                            : member.profile?.email || 'Unknown User'
                          }
                        </p>
                        <p className="text-sm text-muted-foreground">{member.profile?.email}</p>
                      </div>
                    </div>
                    <Badge variant={getRoleBadgeVariant(member.role || 'viewer')}>
                      <RoleIcon className="w-3 h-3 mr-1" />
                      {member.role || 'viewer'}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* File Manager */}
        <SpaceFileManager spaceId={selectedSpace.id} spaceName={selectedSpace.name} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Spaces</h2>
          <p className="text-muted-foreground">Create and manage collaborative spaces</p>
        </div>
        <Dialog open={createSpaceDialog} onOpenChange={setCreateSpaceDialog}>
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
                placeholder="Space name (e.g., Front-end)"
                value={newSpace.name}
                onChange={(e) => setNewSpace({ ...newSpace, name: e.target.value })}
              />
              <Textarea
                placeholder="Space description (optional)"
                value={newSpace.description}
                onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
              />
              <Button onClick={handleCreateSpace} className="w-full">
                Create Space
              </Button>
            </div>
          </DialogContent>
        </Dialog>
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
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedSpace(space)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">{space.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {space.description || 'No description provided'}
              </p>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{space.member_count} members</span>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredSpaces.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
          <h3 className="text-lg font-medium mb-2">No spaces found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm ? 'No spaces match your search criteria' : 'Create your first space to get started'}
          </p>
          {!searchTerm && (
            <Button onClick={() => setCreateSpaceDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Space
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default SpacesManagement;