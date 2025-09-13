import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Checkbox } from '../ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  Users,
  Crown,
  Eye,
  Filter,
  SortAsc,
  CheckSquare,
  Square
} from 'lucide-react';
import { useMemberManagement } from '../../hooks/useMemberManagement';
import { WORKSPACE_ROLES } from '../../types/workspace';
import type { WorkspaceRole, WorkspaceMemberWithUser } from '../../types/workspace';

interface MemberListProps {
  workspaceId: string;
  currentUserRole: WorkspaceRole | null;
  isOwner: boolean;
  currentUserId: string | null;
  onAddMember: () => void;
  onEditMember?: (member: WorkspaceMemberWithUser) => void;
}

export function MemberList({
  workspaceId,
  currentUserRole,
  isOwner,
  currentUserId,
  onAddMember,
  onEditMember
}: MemberListProps) {
  const [showBulkActions, setShowBulkActions] = useState(false);

  const {
    members,
    filteredMembers,
    memberCount,
    memberStats,
    loading,
    error,
    searchQuery,
    roleFilter,
    sortBy,
    selectedMembers,
    setSearchQuery,
    setRoleFilter,
    setSortBy,
    handleRemoveMember,
    handleUpdateMemberRole,
    handleBulkRemoveMembers,
    handleBulkUpdateRoles,
    toggleMemberSelection,
    selectAllMembers,
    clearSelection,
    isMemberSelected,
    getAvailableRoles,
    canManageMember,
    permissions
  } = useMemberManagement({
    workspaceId,
    currentUserRole,
    isOwner,
    currentUserId
  });

  // Get role icon
  const getRoleIcon = (role: WorkspaceRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'team_lead':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'viewer':
        return <Eye className="h-4 w-4 text-gray-500" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  // Get role color
  const getRoleColor = (role: WorkspaceRole) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'team_lead':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'viewer':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Handle bulk role change
  const handleBulkRoleChange = (newRole: WorkspaceRole) => {
    if (selectedMembers.length === 0) return;
    handleBulkUpdateRoles(selectedMembers, newRole);
  };

  // Handle bulk remove
  const handleBulkRemove = () => {
    if (selectedMembers.length === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedMembers.length} members?`)) {
      handleBulkRemoveMembers(selectedMembers);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading members...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">⚠️</div>
            <p className="text-sm text-red-600 mb-4">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Members ({memberCount})
          </CardTitle>
          {permissions.canAddMembers() && (
            <Button onClick={onAddMember}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          )}
        </div>

        {/* Member Statistics */}
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Admins: {memberStats.admins}</span>
          <span>Team Leads: {memberStats.teamLeads}</span>
          <span>Viewers: {memberStats.viewers}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as WorkspaceRole | 'all')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="team_lead">Team Lead</SelectItem>
              <SelectItem value="viewer">Viewer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'role' | 'name' | 'date')}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="role">By Role</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="date">By Date</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Actions */}
        {filteredMembers.length > 0 && permissions.canManageUsers() && (
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <Checkbox
                checked={selectedMembers.length === filteredMembers.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    selectAllMembers();
                  } else {
                    clearSelection();
                  }
                }}
              />
              <span className="text-sm text-muted-foreground">
                {selectedMembers.length} of {filteredMembers.length} selected
              </span>
            </div>
            
            {selectedMembers.length > 0 && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowBulkActions(!showBulkActions)}
                >
                  <MoreHorizontal className="h-4 w-4 mr-2" />
                  Bulk Actions
                </Button>
                
                {showBulkActions && (
                  <div className="flex items-center gap-2">
                    <Select onValueChange={handleBulkRoleChange}>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Change Role" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableRoles().map((role) => (
                          <SelectItem key={role} value={role}>
                            {WORKSPACE_ROLES[role]?.label || role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleBulkRemove}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Members List */}
        {filteredMembers.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {members.length === 0 ? 'No team members yet' : 'No members found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {members.length === 0 
                ? 'Add team members to collaborate on this workspace'
                : 'Try adjusting your search or filter criteria'
              }
            </p>
            {members.length === 0 && permissions.canAddMembers() && (
              <Button onClick={onAddMember}>
                <UserPlus className="h-4 w-4 mr-2" />
                Add First Member
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors ${
                  isMemberSelected(member.id) ? 'bg-primary/5 border-primary' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {permissions.canManageUsers() && (
                    <Checkbox
                      checked={isMemberSelected(member.id)}
                      onCheckedChange={() => toggleMemberSelection(member.id)}
                    />
                  )}
                  
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user.avatar_url || undefined} />
                    <AvatarFallback>
                      {member.user.first_name?.[0]}{member.user.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">
                        {member.user.first_name} {member.user.last_name}
                      </p>
                      {member.user_id === currentUserId && (
                        <Badge variant="outline" className="text-xs">
                          You
                        </Badge>
                      )}
                      {isOwner && member.user_id === currentUserId && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Owner
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant="secondary" 
                    className={`flex items-center gap-1 ${getRoleColor(member.role as WorkspaceRole)}`}
                  >
                    {getRoleIcon(member.role as WorkspaceRole)}
                    {WORKSPACE_ROLES[member.role as WorkspaceRole]?.label || member.role}
                  </Badge>

                  {canManageMember(member) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {permissions.canChangeMemberRole(member) && (
                          <DropdownMenuItem asChild>
                            <div className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              <span>Change Role</span>
                              <Select
                                value={member.role}
                                onValueChange={(value) => handleUpdateMemberRole(member.id, value as WorkspaceRole)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {permissions.getAvailableRoles().map((role) => (
                                    <SelectItem key={role} value={role}>
                                      {WORKSPACE_ROLES[role]?.label || role}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </DropdownMenuItem>
                        )}
                        
                        {onEditMember && (
                          <DropdownMenuItem onClick={() => onEditMember(member)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Details
                          </DropdownMenuItem>
                        )}
                        
                        {permissions.canRemoveMember(member) && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleRemoveMember(member.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
