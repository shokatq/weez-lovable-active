import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Plus, Settings, Trash2, UserPlus } from 'lucide-react';
import { SpacesService, type Space, type SpaceMember } from '@/services/spacesService';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from '@/hooks/use-toast';

interface SpaceManagementProps {
  teamMembers: any[];
}

export default function SpaceManagement({ teamMembers }: SpaceManagementProps) {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceMembers, setSpaceMembers] = useState<SpaceMember[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [newSpace, setNewSpace] = useState({ name: '', description: '' });
  const [selectedUserId, setSelectedUserId] = useState('');
  
  const userRole = useUserRole();
  const canManageSpaces = userRole.isAdmin;

  useEffect(() => {
    if (userRole.userRole?.teamId) {
      loadSpaces();
    }
  }, [userRole.userRole?.teamId]);

  useEffect(() => {
    if (selectedSpace) {
      loadSpaceMembers(selectedSpace.id);
    }
  }, [selectedSpace]);

  const loadSpaces = async () => {
    if (!userRole.userRole?.teamId) return;
    
    setLoading(true);
    try {
      const teamSpaces = await SpacesService.getTeamSpaces(userRole.userRole.teamId);
      setSpaces(teamSpaces);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load spaces",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadSpaceMembers = async (spaceId: string) => {
    try {
      const members = await SpacesService.getSpaceMembers(spaceId);
      setSpaceMembers(members);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load space members",
        variant: "destructive"
      });
    }
  };

  const handleCreateSpace = async () => {
    if (!newSpace.name.trim() || !userRole.userRole?.teamId) return;

    setLoading(true);
    try {
      const spaceId = await SpacesService.createSpace(
        userRole.userRole.teamId,
        newSpace.name,
        newSpace.description
      );
      
      if (spaceId) {
        toast({
          title: "Success",
          description: "Space created successfully"
        });
        setNewSpace({ name: '', description: '' });
        setShowCreateDialog(false);
        loadSpaces();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create space",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async () => {
    if (!selectedSpace || !selectedUserId) return;

    setLoading(true);
    try {
      const success = await SpacesService.addMemberToSpace(selectedSpace.id, selectedUserId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Member added to space"
        });
        setSelectedUserId('');
        setShowAddMemberDialog(false);
        loadSpaceMembers(selectedSpace.id);
        loadSpaces(); // Refresh member count
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add member to space",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    if (!selectedSpace) return;

    try {
      const success = await SpacesService.removeMemberFromSpace(selectedSpace.id, userId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Member removed from space"
        });
        loadSpaceMembers(selectedSpace.id);
        loadSpaces(); // Refresh member count
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member from space",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSpace = async (spaceId: string) => {
    if (!confirm('Are you sure you want to delete this space? This action cannot be undone.')) {
      return;
    }

    try {
      const success = await SpacesService.deleteSpace(spaceId);
      
      if (success) {
        toast({
          title: "Success",
          description: "Space deleted successfully"
        });
        if (selectedSpace?.id === spaceId) {
          setSelectedSpace(null);
          setSpaceMembers([]);
        }
        loadSpaces();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete space",
        variant: "destructive"
      });
    }
  };

  const availableMembers = teamMembers.filter(member => 
    !spaceMembers.some(spaceMember => spaceMember.user_id === member.user_id)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Spaces</h2>
          <p className="text-muted-foreground">Organize your team into focused workspaces</p>
        </div>
        
        {canManageSpaces && (
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
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
                <div>
                  <Label htmlFor="space-name">Space Name</Label>
                  <Input
                    id="space-name"
                    value={newSpace.name}
                    onChange={(e) => setNewSpace(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter space name"
                  />
                </div>
                <div>
                  <Label htmlFor="space-description">Description (Optional)</Label>
                  <Textarea
                    id="space-description"
                    value={newSpace.description}
                    onChange={(e) => setNewSpace(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Enter space description"
                  />
                </div>
                <Button onClick={handleCreateSpace} disabled={loading || !newSpace.name.trim()}>
                  Create Space
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spaces List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Spaces ({spaces.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading spaces...</div>
            ) : spaces.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No spaces created yet.
                {canManageSpaces && " Create your first space to get started."}
              </div>
            ) : (
              <div className="space-y-3">
                {spaces.map(space => (
                  <div
                    key={space.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors hover:bg-muted/50 ${
                      selectedSpace?.id === space.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedSpace(space)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">{space.name}</h3>
                        {space.description && (
                          <p className="text-sm text-muted-foreground mt-1">{space.description}</p>
                        )}
                        <Badge variant="secondary" className="mt-2">
                          {space.member_count || 0} members
                        </Badge>
                      </div>
                      {canManageSpaces && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSpace(space.id);
                          }}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Space Members */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {selectedSpace ? `${selectedSpace.name} Members` : 'Select a Space'}
              </span>
              {selectedSpace && canManageSpaces && (
                <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Member to {selectedSpace.name}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="member-select">Select Team Member</Label>
                        <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a team member" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableMembers.map(member => (
                              <SelectItem key={member.user_id} value={member.user_id}>
                                {member.profile?.first_name && member.profile?.last_name
                                  ? `${member.profile.first_name} ${member.profile.last_name}`
                                  : member.profile?.email || 'Unknown User'
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleAddMember} 
                        disabled={loading || !selectedUserId}
                      >
                        Add to Space
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedSpace ? (
              <div className="text-center py-8 text-muted-foreground">
                Select a space to view its members
              </div>
            ) : spaceMembers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No members in this space yet.
                {canManageSpaces && " Add team members to get started."}
              </div>
            ) : (
              <div className="space-y-3">
                {spaceMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-foreground">
                        {member.profile?.first_name && member.profile?.last_name
                          ? `${member.profile.first_name} ${member.profile.last_name}`
                          : member.profile?.email || 'Unknown User'
                        }
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Added {new Date(member.added_at).toLocaleDateString()}
                      </p>
                    </div>
                    {canManageSpaces && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.user_id)}
                        className="text-destructive hover:text-destructive"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}