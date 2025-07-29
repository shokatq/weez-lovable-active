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
import { toast } from 'sonner';
import { UserPlus, Mail, Building2, Crown, User, Shield, Eye } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
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

  useEffect(() => {
    if (userRole?.teamId) {
      fetchDepartments();
      fetchTeamMembers();
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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userRole?.teamId) return;

    setInviteLoading(true);
    try {
      // Create team invitation
      const { data: invitation, error: inviteError } = await supabase
        .from('team_invitations')
        .insert({
          email: inviteForm.email,
          team_id: userRole.teamId,
          role: inviteForm.role as 'admin' | 'team_lead' | 'employee' | 'viewer',
          invited_by: user.id,
        })
        .select()
        .single();

      if (inviteError) throw inviteError;

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
          invitationId: invitation.id,
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
          <h2 className="text-2xl font-bold text-foreground">Team Management</h2>
          <p className="text-muted-foreground">Manage your team members, roles, and departments</p>
        </div>
        {canManageTeam && (
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
        )}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Team Members Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredMembers.map((member) => (
          <Card key={member.id} className="hover:shadow-md transition-shadow">
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
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            {searchTerm ? 'No team members found matching your search.' : 'No team members found.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedTeamManagement;