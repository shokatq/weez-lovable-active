import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Crown, 
  Eye, 
  Trash2, 
  Settings,
  Search,
  AlertCircle,
  RefreshCw,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useMemberManagement } from '../hooks/useMemberManagement';
import type { WorkspaceRole, WorkspaceMemberWithUser } from '../types/workspace';

interface TeamManagementProps {
  workspaceId: string;
  currentUserRole: WorkspaceRole | null;
  isOwner: boolean;
  currentUserId: string | null;
}

const roles = [
  { 
    value: 'admin' as WorkspaceRole, 
    label: 'Admin', 
    icon: Crown, 
    description: 'Full access and user management',
    color: 'bg-red-500'
  },
  { 
    value: 'team_lead' as WorkspaceRole, 
    label: 'Team Lead', 
    icon: Shield, 
    description: 'Can manage team members and documents',
    color: 'bg-blue-500'
  },
  { 
    value: 'viewer' as WorkspaceRole, 
    label: 'Viewer', 
    icon: Eye, 
    description: 'Read-only access to workspace',
    color: 'bg-green-500'
  }
];

const TeamManagement: React.FC<TeamManagementProps> = ({ 
  workspaceId,
  currentUserRole,
  isOwner,
  currentUserId
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    email: '',
    role: 'viewer' as WorkspaceRole
  });
  const [addMemberError, setAddMemberError] = useState<string | null>(null);

  const {
    members,
    filteredMembers,
    memberCount,
    memberStats,
    loading,
    error,
    searchQuery,
    roleFilter,
    selectedMembers,
    addingMember,
    setSearchQuery,
    setRoleFilter,
    handleAddMember,
    handleRemoveMember,
    handleUpdateMemberRole,
    refreshMembers,
    getAvailableRoles,
    canManageMember,
    permissions,
    getDebugInfo
  } = useMemberManagement({
    workspaceId,
    currentUserRole,
    isOwner,
    currentUserId
  });

  // Debug logging
  useEffect(() => {
    console.log('🔍 TeamManagement Debug Info:', getDebugInfo());
  }, [workspaceId, currentUserRole, members.length]);

  const handleAddMemberSubmit = async () => {
    if (!newMember.email.trim()) {
      setAddMemberError('Email is required');
      return;
    }

    if (!newMember.role) {
      setAddMemberError('Role is required');
      return;
    }

    setAddMemberError(null);

    const result = await handleAddMember({
      email: newMember.email.trim(),
      role: newMember.role
    });

    if (result?.success) {
      setNewMember({ email: '', role: 'viewer' });
      setIsAddDialogOpen(false);
      setAddMemberError(null);
    } else {
      setAddMemberError(result?.error || 'Failed to add member');
    }
  };

  const handleRoleChange = async (memberId: string, newRole: WorkspaceRole) => {
    await handleUpdateMemberRole(memberId, newRole);
  };

  const handleRemove = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await handleRemoveMember(memberId);
    }
  };

  const getRoleIcon = (role: WorkspaceRole) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.icon || Eye;
  };

  const getRoleColor = (role: WorkspaceRole) => {
    const roleData = roles.find(r => r.value === role);
    return roleData?.color || 'bg-gray-500';
  };

  const getInitials = (firstName?: string, lastName?: string, email?: string) => {
    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName.substring(0, 2).toUpperCase();
    }
    if (email) {
      return email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage workspace members and their permissions
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshMembers}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {permissions.canAddMembers() && (
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Team Member</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {addMemberError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{addMemberError}</AlertDescription>
                    </Alert>
                  )}
                  
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={newMember.email}
                    onChange={(e) => {
                      setNewMember({ ...newMember, email: e.target.value });
                      setAddMemberError(null);
                    }}
                    disabled={addingMember}
                  />
                  
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value as WorkspaceRole })}
                    disabled={addingMember}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableRoles().map((role) => {
                        const roleData = roles.find(r => r.value === role);
                        return (
                          <SelectItem key={role} value={role}>
                            <div className="flex items-center gap-2">
                              {roleData && <roleData.icon className="w-4 h-4" />}
                              <span>{roleData?.label || role}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    onClick={handleAddMemberSubmit} 
                    className="w-full"
                    disabled={addingMember}
                  >
                    {addingMember ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding Member...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Member
                      </>
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            {error}. Try refreshing the page or contact support if the issue persists.
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.admins}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Leads</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.teamLeads}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viewers</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{memberStats.viewers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="permissions">Role Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members" className="space-y-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center p-4 bg-muted rounded-lg">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.value} value={role.value}>{role.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Loading members...</span>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredMembers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No members found</h3>
              <p className="text-muted-foreground mb-4">
                {members.length === 0 
                  ? 'This workspace has no members yet.'
                  : 'No members match your current filters.'
                }
              </p>
              {permissions.canAddMembers() && members.length === 0 && (
                <Button onClick={() => setIsAddDialogOpen(true)}>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add First Member
                </Button>
              )}
            </div>
          )}

          {/* Members Grid */}
          {!loading && filteredMembers.length > 0 && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMembers.map((member) => {
                const RoleIcon = getRoleIcon(member.role as WorkspaceRole);
                const roleColor = getRoleColor(member.role as WorkspaceRole);
                const canManage = canManageMember(member);
                const isCurrentUser = member.user_id === currentUserId;
                
                return (
                  <Card key={member.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={member.user.avatar_url} />
                              <AvatarFallback className="text-xs">
                                {getInitials(
                                  member.user.first_name, 
                                  member.user.last_name, 
                                  member.user.email
                                )}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${roleColor} rounded-full flex items-center justify-center`}>
                              <RoleIcon className="w-2 h-2 text-white" />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">
                              {member.user.first_name && member.user.last_name 
                                ? `${member.user.first_name} ${member.user.last_name}`
                                : member.user.email
                              }
                              {isCurrentUser && (
                                <Badge variant="outline" className="ml-2 text-xs">You</Badge>
                              )}
                            </h3>
                            <p className="text-xs text-muted-foreground truncate">
                              {member.user.email}
                            </p>
                          </div>
                        </div>
                        {canManage && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(member.id)}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Badge 
                          variant={member.role === 'admin' ? 'default' : 'outline'}
                          className="text-xs"
                        >
                          <RoleIcon className="w-3 h-3 mr-1" />
                          {roles.find(r => r.value === member.role)?.label || member.role}
                        </Badge>
                        
                        {canManage && (
                          <Select
                            value={member.role}
                            onValueChange={(value) => handleRoleChange(member.id, value as WorkspaceRole)}
                          >
                            <SelectTrigger className="h-8 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableRoles().map((role) => {
                                const roleData = roles.find(r => r.value === role);
                                return (
                                  <SelectItem key={role} value={role}>
                                    <div className="flex items-center gap-2">
                                      {roleData && <roleData.icon className="w-3 h-3" />}
                                      <span className="text-xs">{roleData?.label || role}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        )}
                        
                        <div className="text-xs text-muted-foreground">
                          Added: {new Date(member.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="permissions" className="space-y-4">
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.value}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <role.icon className="w-5 h-5" />
                    {role.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{role.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <strong>Members:</strong> {memberStats[role.value === 'admin' ? 'admins' : role.value === 'team_lead' ? 'teamLeads' : 'viewers']}
                    </div>
                    <div className="text-sm">
                      <strong>Permissions:</strong>
                      <ul className="list-disc list-inside mt-1 text-xs text-muted-foreground">
                        {role.value === 'admin' && (
                          <>
                            <li>Full workspace access</li>
                            <li>Manage team members</li>
                            <li>Change member roles</li>
                            <li>Remove members</li>
                            <li>Upload and download documents</li>
                            <li>Delete documents</li>
                          </>
                        )}
                        {role.value === 'team_lead' && (
                          <>
                            <li>Add team members</li>
                            <li>Upload and download documents</li>
                            <li>Edit documents</li>
                            <li>View all workspace content</li>
                          </>
                        )}
                        {role.value === 'viewer' && (
                          <>
                            <li>View workspace content</li>
                            <li>Read-only access</li>
                          </>
                        )}
                      </ul>
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
};

export default TeamManagement;