import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from '@/hooks/use-toast';
import { Users, Shield, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

interface UserWithRole extends User {
  role?: 'admin' | 'team_lead' | 'employee' | 'viewer';
  team_id?: string;
}

interface UserRoleManagementProps {
  teamId: string;
}

const roleLabels = {
  admin: 'Admin',
  team_lead: 'Team Leader', 
  employee: 'Employee',
  viewer: 'Viewer'
};

const roleBadgeVariants = {
  admin: 'destructive',
  team_lead: 'default',
  employee: 'secondary',
  viewer: 'outline'
} as const;

export const UserRoleManagement = ({ teamId }: UserRoleManagementProps) => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    fetchUsersAndRoles();
    fetchCurrentUserRole();
  }, [teamId]);

  const fetchCurrentUserRole = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('team_id', teamId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching current user role:', error);
        return;
      }

      setCurrentUserRole(data?.role || null);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchUsersAndRoles = async () => {
    try {
      setLoading(true);
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, avatar_url');

      if (profilesError) throw profilesError;

      // Get user roles for this team
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, team_id')
        .eq('team_id', teamId);

      if (rolesError) throw rolesError;

      // Combine profiles with roles
      const usersWithRoles = profiles?.map(profile => {
        const userRole = userRoles?.find(role => role.user_id === profile.id);
        return {
          ...profile,
          role: userRole?.role,
          team_id: userRole?.team_id
        };
      }) || [];

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch users and roles",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    // Check if current user is admin
    if (currentUserRole !== 'admin') {
      toast({
        title: "Access Denied",
        description: "Only admins can assign roles",
        variant: "destructive"
      });
      return;
    }

    // Type guard for role
    const validRoles = ['admin', 'team_lead', 'employee', 'viewer'] as const;
    if (!validRoles.includes(newRole as any)) {
      toast({
        title: "Error",
        description: "Invalid role selected",
        variant: "destructive"
      });
      return;
    }

    setUpdating(userId);
    
    try {
      // Check if user already has a role in this team
      const existingRole = users.find(u => u.id === userId)?.role;
      
      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role: newRole as 'admin' | 'team_lead' | 'employee' | 'viewer' })
          .eq('user_id', userId)
          .eq('team_id', teamId);

        if (error) throw error;
      } else {
        // Insert new role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            team_id: teamId,
            role: newRole as 'admin' | 'team_lead' | 'employee' | 'viewer'
          });

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "User role updated successfully"
      });

      // Refresh the users list
      await fetchUsersAndRoles();
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      });
    } finally {
      setUpdating(null);
    }
  };

  const canManageRoles = currentUserRole === 'admin';

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Role Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading users...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          User Role Management
        </CardTitle>
        <CardDescription>
          Manage user roles and permissions for this team
          {!canManageRoles && (
            <Badge variant="outline" className="ml-2">View Only</Badge>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={user.avatar_url} />
                  <AvatarFallback>
                    {user.first_name?.[0]}{user.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">
                    {user.first_name} {user.last_name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user.role && (
                  <Badge variant={roleBadgeVariants[user.role]}>
                    {roleLabels[user.role]}
                  </Badge>
                )}
                
                {canManageRoles && (
                  <Select
                    value={user.role || ''}
                    onValueChange={(value) => updateUserRole(user.id, value)}
                    disabled={updating === user.id}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="No role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="team_lead">Team Leader</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          ))}

          {users.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Role Permissions:</h4>
          <div className="text-sm space-y-1">
            <div><strong>Admin:</strong> Full access - view, upload, edit, delete files + manage roles</div>
            <div><strong>Team Leader:</strong> View, upload, edit files in team spaces</div>
            <div><strong>Employee:</strong> View and upload files only</div>
            <div><strong>Viewer:</strong> View files only</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};