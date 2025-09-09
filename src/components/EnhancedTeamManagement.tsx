import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { 
  UserPlus, Mail, Building2, Crown, User, Shield, Eye, Plus, 
  FolderOpen, Share, MessageSquare, Activity, Search, Trash2, 
  Settings, FileText
} from 'lucide-react';
import { SpacesService } from '@/services/spacesService';
import type { Space, SpaceMember } from '@/services/spacesService';
import SimplifiedInviteDialog from './SimplifiedInviteDialog';
import CreateSpaceDialog from './CreateSpaceDialog';
import AllMembersDialog from './AllMembersDialog';

// Import theme-responsive icons
import teamMembersIcon from '@/assets/team-members-icon.png';
import activeProjectsIcon from '@/assets/active-projects-icon.png';
import aiQueriesIcon from '@/assets/ai-queries-icon.png';
import departmentsIcon from '@/assets/departments-icon.png';

interface Department {
  id: string;
  name: string;
  description: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  role: string;
  status: string;
  joined_at: string;
  department_id?: string;
  custom_role?: string;
  custom_department?: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url?: string;
  };
  departments?: {
    name: string;
  };
}

const EnhancedTeamManagement = () => {
  const { user } = useAuth();
  const { userRole, canManageTeam } = useUserRole();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<Space | null>(null);
  const [spaceMembers, setSpaceMembers] = useState<SpaceMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Dialog states
  const [showCreateSpaceDialog, setShowCreateSpaceDialog] = useState(false);
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [showFileShareDialog, setShowFileShareDialog] = useState(false);
  const [showAllMembersDialog, setShowAllMembersDialog] = useState(false);
  
  // Form states
  const [newSpace, setNewSpace] = useState({ name: '', description: '' });
  const [selectedUserId, setSelectedUserId] = useState('');
  const [fileShareForm, setFileShareForm] = useState({ title: '', url: '', platform: '' });
  
  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'employee',
    department: '',
    customRole: '',
    customDepartment: '',
    useCustomRole: false,
    useCustomDepartment: false,
  });

  const predefinedRoles = [
    { value: 'admin', label: 'Admin', icon: Crown },
    { value: 'team_lead', label: 'Team Lead', icon: Shield },
    { value: 'employee', label: 'Employee', icon: User },
    { value: 'viewer', label: 'Viewer', icon: Eye },
  ];

  // Overview stats
  const overviewStats = [
    {
      title: 'Team Members',
      value: teamMembers.length,
      icon: teamMembersIcon,
      description: 'Active team members'
    },
    {
      title: 'Active Projects',
      value: spaces.length,
      icon: activeProjectsIcon,
      description: 'Ongoing workspaces'
    },
    {
      title: 'AI Queries Today',
      value: 24,
      icon: aiQueriesIcon,
      description: 'Questions answered'
    },
    {
      title: 'Departments',
      value: departments.length,
      icon: departmentsIcon,
      description: 'Organizational units'
    }
  ];

  useEffect(() => {
    if (userRole?.teamId) {
      fetchDepartments();
      fetchTeamMembers();
      fetchSpaces();
    }
  }, [userRole?.teamId]);

  const fetchDepartments = async () => {
    try {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('team_id', userRole?.teamId)
        .order('name');

      if (error) throw error;
      setDepartments(data || []);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_employees')
        .select(`
          id,
          user_id,
          status,
          joined_at,
          department_id,
          custom_role,
          custom_department,
          profiles!team_employees_user_id_fkey (
            first_name,
            last_name,
            email,
            avatar_url
          ),
          departments (
            name
          )
        `)
        .eq('team_id', userRole?.teamId)
        .eq('status', 'active')
        .order('joined_at', { ascending: false });

      if (error) throw error;

      // Get user roles separately to avoid complex join issues
      const memberIds = data?.map(member => member.user_id) || [];
      const { data: rolesData } = await supabase
        .from('user_roles')
        .select('user_id, role')
        .eq('team_id', userRole?.teamId)
        .in('user_id', memberIds);

      const rolesMap = rolesData?.reduce((acc, role) => {
        acc[role.user_id] = role.role;
        return acc;
      }, {} as Record<string, string>) || {};
      
      const formattedData = data?.map(member => ({
        ...member,
        role: rolesMap[member.user_id] || 'employee'
      })) || [];
      
      setTeamMembers(formattedData as TeamMember[]);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSpaces = async () => {
    if (!userRole?.teamId) return;
    
    try {
      const teamSpaces = await SpacesService.getTeamSpaces(userRole.teamId);
      setSpaces(teamSpaces);
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  const handleCreateSpace = async () => {
    if (!newSpace.name.trim() || !userRole?.teamId) return;

    try {
      const spaceId = await SpacesService.createSpace(
        newSpace.name,
        newSpace.description
      );
      
      if (spaceId) {
        toast.success('Space created successfully');
        setNewSpace({ name: '', description: '' });
        setShowCreateSpaceDialog(false);
        fetchSpaces();
      }
    } catch (error) {
      toast.error('Failed to create space');
    }
  };

  const handleShareFile = async () => {
    if (!selectedSpace || !fileShareForm.title.trim() || !fileShareForm.url.trim()) return;

    try {
      // Implement file sharing logic here using supabase
      const { error } = await supabase
        .from('shared_files')
        .insert({
          team_id: userRole?.teamId,
          title: fileShareForm.title,
          url: fileShareForm.url,
          platform: fileShareForm.platform,
          shared_by: user?.id
        });

      if (error) throw error;

      toast.success('File shared successfully');
      setFileShareForm({ title: '', url: '', platform: '' });
      setShowFileShareDialog(false);
    } catch (error) {
      toast.error('Failed to share file');
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userRole?.teamId) return;

    setInviteLoading(true);
    try {
      // Use the secure function for team invitations
      const { data: result, error: functionError } = await supabase
        .rpc('handle_team_invitation', {
          invitation_email: inviteForm.email,
          team_id: userRole.teamId,
          role: inviteForm.role as 'admin' | 'team_lead' | 'employee' | 'viewer',
          invited_by: user.id,
          custom_department: inviteForm.useCustomDepartment ? inviteForm.customDepartment : null
        });

      if (functionError) {
        throw functionError;
      }

      const invitationResult = result as any;
      if (!invitationResult?.success) {
        throw new Error(invitationResult?.error || 'Failed to create invitation');
      }

      // Send invitation email
      const { error: emailError } = await supabase.functions.invoke('send-team-invitation', {
        body: {
          inviteeEmail: inviteForm.email,
          inviteeName: inviteForm.name,
          workspaceName: userRole.teamName,
          userRole: inviteForm.useCustomRole ? inviteForm.customRole : 
                   predefinedRoles.find(r => r.value === inviteForm.role)?.label || inviteForm.role,
          userDepartment: inviteForm.useCustomDepartment ? inviteForm.customDepartment :
                         departments.find(d => d.id === inviteForm.department)?.name || 'General',
          inviterName: `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() || user.email,
          invitationId: invitationResult.invitation_id,
        },
      });

      if (emailError) {
        console.error('Error sending email:', emailError);
        toast.error('Invitation created but email failed to send');
      } else {
        toast.success('Invitation sent successfully!');
      }

      // Reset form and close dialog
      setInviteForm({
        name: '',
        email: '',
        role: 'employee',
        department: '',
        customRole: '',
        customDepartment: '',
        useCustomRole: false,
        useCustomDepartment: false,
      });
      setInviteDialogOpen(false);
      
      // Refresh team members
      fetchTeamMembers();
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(error.message || 'Failed to send invitation');
    } finally {
      setInviteLoading(false);
    }
  };

  const getRoleIcon = (role: string) => {
    const roleData = predefinedRoles.find(r => r.value === role);
    const IconComponent = roleData?.icon || User;
    return <IconComponent className="w-4 h-4" />;
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'default';
      case 'team_lead': return 'secondary';
      case 'employee': return 'outline';
      case 'viewer': return 'outline';
      default: return 'outline';
    }
  };

  const filteredMembers = teamMembers.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = `${member.profiles?.first_name || ''} ${member.profiles?.last_name || ''}`.toLowerCase();
    const email = member.profiles?.email?.toLowerCase() || '';
    const department = member.departments?.name?.toLowerCase() || member.custom_department?.toLowerCase() || '';
    
    return fullName.includes(searchLower) || 
           email.includes(searchLower) || 
           department.includes(searchLower) ||
           member.role.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground mt-1">
            Manage your organization's team structure, spaces, and collaboration
          </p>
        </div>
        {canManageTeam && (
          <div className="flex gap-2">
            <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Invite Member
                </Button>
              </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Invite Team Member</DialogTitle>
                <DialogDescription>
                  Send an invitation to add a new member to your workspace.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleInvite} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select
                    value={inviteForm.role}
                    onValueChange={(value) => setInviteForm({ ...inviteForm, role: value, useCustomRole: value === 'custom' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedRoles.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex items-center gap-2">
                            <role.icon className="w-4 h-4" />
                            {role.label}
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Role</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inviteForm.useCustomRole && (
                  <div className="space-y-2">
                    <Label htmlFor="customRole">Custom Role</Label>
                    <Input
                      id="customRole"
                      type="text"
                      placeholder="e.g., Senior Developer"
                      value={inviteForm.customRole}
                      onChange={(e) => setInviteForm({ ...inviteForm, customRole: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select
                    value={inviteForm.department}
                    onValueChange={(value) => setInviteForm({ ...inviteForm, department: value, useCustomDepartment: value === 'custom' })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">Custom Department</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {inviteForm.useCustomDepartment && (
                  <div className="space-y-2">
                    <Label htmlFor="customDepartment">Custom Department</Label>
                    <Input
                      id="customDepartment"
                      type="text"
                      placeholder="e.g., R&D"
                      value={inviteForm.customDepartment}
                      onChange={(e) => setInviteForm({ ...inviteForm, customDepartment: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInviteDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={inviteLoading}>
                    {inviteLoading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
        )}
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                </div>
                <img 
                  src={stat.icon} 
                  alt={stat.title}
                  className="w-8 h-8 theme-responsive-icon opacity-70"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="spaces">Spaces</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <UserPlus className="w-4 h-4 text-green-500" />
                    <span>New team member joined Engineering</span>
                    <span className="text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FolderOpen className="w-4 h-4 text-blue-500" />
                    <span>New space "Marketing Campaign" created</span>
                    <span className="text-muted-foreground ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Share className="w-4 h-4 text-purple-500" />
                    <span>File shared in Product Development space</span>
                    <span className="text-muted-foreground ml-auto">1d ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {canManageTeam && (
                    <>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setShowCreateSpaceDialog(true)}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Space
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setInviteDialogOpen(true)}
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Invite Team Member
                      </Button>
                    </>
                  )}
                   <Button 
                     variant="outline" 
                     className="w-full justify-start"
                     onClick={() => window.location.href = '/team-chat'}
                   >
                     <MessageSquare className="w-4 h-4 mr-2" />
                     Start Chatting
                   </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="members" className="space-y-4">
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Members Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredMembers.length === 0 ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                No team members found. {canManageTeam && "Invite team members to get started."}
              </div>
            ) : (
              filteredMembers.map((member) => (
                <Card 
                  key={member.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setShowAllMembersDialog(true)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {member.profiles?.avatar_url ? (
                            <img
                              src={member.profiles.avatar_url}
                              alt="Avatar"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <CardTitle className="text-sm">
                            {member.profiles?.first_name} {member.profiles?.last_name}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            {member.profiles?.email}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant={getRoleBadgeVariant(member.role)} className="flex items-center gap-1">
                        {getRoleIcon(member.role)}
                        {member.custom_role || member.role}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2 text-xs text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3 h-3" />
                        <span>{member.departments?.name || member.custom_department || 'General'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        <span>Joined {new Date(member.joined_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          {/* Show All Members Button */}
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAllMembersDialog(true)}
              className="flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              View All {teamMembers.length} Members
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="spaces" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Team Spaces</h3>
            {canManageTeam && (
              <Button onClick={() => setShowCreateSpaceDialog(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Space
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Spaces List */}
            <Card>
              <CardHeader>
                <CardTitle>Spaces ({spaces.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {spaces.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No spaces created yet.
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
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Space Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedSpace ? `${selectedSpace.name} Actions` : 'Select a Space'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedSpace ? (
                  <div className="space-y-3">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowAddMemberDialog(true)}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setShowFileShareDialog(true)}
                    >
                      <Share className="w-4 h-4 mr-2" />
                      Share File
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Open Chat
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Select a space to view available actions
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>


        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Team Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-sm">
                  <UserPlus className="w-4 h-4 text-green-500" />
                  <span>New team member added to Engineering</span>
                  <span className="text-muted-foreground ml-auto">2 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Settings className="w-4 h-4 text-blue-500" />
                  <span>Space permissions updated</span>
                  <span className="text-muted-foreground ml-auto">4 hours ago</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Share className="w-4 h-4 text-purple-500" />
                  <span>File shared in Marketing space</span>
                  <span className="text-muted-foreground ml-auto">1 day ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      {/* File Share Dialog */}
      <Dialog open={showFileShareDialog} onOpenChange={setShowFileShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share File to {selectedSpace?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="file-title">File Title</Label>
              <Input
                id="file-title"
                value={fileShareForm.title}
                onChange={(e) => setFileShareForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter file title"
              />
            </div>
            <div>
              <Label htmlFor="file-url">File URL</Label>
              <Input
                id="file-url"
                value={fileShareForm.url}
                onChange={(e) => setFileShareForm(prev => ({ ...prev, url: e.target.value }))}
                placeholder="Enter file URL"
              />
            </div>
            <div>
              <Label htmlFor="file-platform">Platform (Optional)</Label>
              <Input
                id="file-platform"
                value={fileShareForm.platform}
                onChange={(e) => setFileShareForm(prev => ({ ...prev, platform: e.target.value }))}
                placeholder="e.g., Google Drive, Dropbox"
              />
            </div>
            <Button onClick={handleShareFile} disabled={!fileShareForm.title.trim() || !fileShareForm.url.trim()}>
              Share File
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simplified Invite Dialog */}
      <SimplifiedInviteDialog 
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        onInviteSuccess={fetchTeamMembers}
      />

      {/* Create Space Dialog */}
      <CreateSpaceDialog
        open={showCreateSpaceDialog}
        onOpenChange={setShowCreateSpaceDialog}
        onSpaceCreated={fetchSpaces}
        teamMembers={teamMembers}
      />

      {/* All Members Dialog */}
      <AllMembersDialog
        open={showAllMembersDialog}
        onOpenChange={setShowAllMembersDialog}
        members={teamMembers}
      />
    </div>
  );
};

export default EnhancedTeamManagement;