// =============================================
// 2. RBAC CONTEXT & PROVIDER
// =============================================

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Role, Permission, ROLE_PERMISSIONS, TeamMember, Team } from '@/types/rbac';
import { toast } from 'sonner';

interface RBACContextType {
  user: User | null;
  userRole: Role | null;
  team: Team | null;
  teamMembers: TeamMember[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  
  // Permission checks
  hasPermission: (permission: Permission) => boolean;
  hasRole: (role: Role) => boolean;
  canAccess: (requiredPermissions: Permission[]) => boolean;
  
  // Team management
  inviteUser: (email: string, role: Role) => Promise<boolean>;
  updateUserRole: (userId: string, newRole: Role) => Promise<boolean>;
  removeUser: (userId: string) => Promise<boolean>;
  refreshTeamData: () => Promise<void>;
  
  // Auth actions
  signOut: () => Promise<void>;
}

const RBACContext = createContext<RBACContextType | null>(null);

export const RBACProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth and fetch user data
  useEffect(() => {
    const cleanup = initializeAuth();
    return () => {
      cleanup.then(fn => fn && fn());
    };
  }, []);

  // Update permissions when role changes
  useEffect(() => {
    if (userRole) {
      setPermissions(ROLE_PERMISSIONS[userRole] || []);
    } else {
      setPermissions([]);
    }
  }, [userRole]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (team) {
      const subscription = supabase
        .channel('team_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'team_employees', filter: `team_id=eq.${team.id}` },
          () => refreshTeamData()
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_roles', filter: `team_id=eq.${team.id}` },
          () => refreshTeamData()
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [team]); // Removed refreshTeamData from dependencies to fix circular dependency

  const initializeAuth = async () => {
    try {
      setLoading(true);
      setError(null);

      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            fetchUserData(session.user.id).finally(() => setLoading(false));
          } else {
            setUserRole(null);
            setTeam(null);
            setTeamMembers([]);
            setPermissions([]);
            setLoading(false);
          }
        }
      );

      // Get initial session
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchUserData(session.user.id);
      }

      // Cleanup function
      return () => subscription.unsubscribe();
    } catch (err) {
      setError(`Authentication failed: ${err}`);
      console.error('Auth initialization error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user's role and team data
      const [roleData, teamData] = await Promise.all([
        fetchUserRole(userId),
        fetchUserTeam(userId)
      ]);

      setUserRole(roleData.role);
      setTeam(teamData.team);

      if (teamData.team) {
        await fetchTeamMembers(teamData.team.id);
      }
    } catch (err) {
      throw new Error(`Failed to fetch user data: ${err}`);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const members = await fetchTeamMembersData(teamId);
      setTeamMembers(members);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const refreshTeamData = useCallback(async () => {
    if (!user || !team) return;
    
    try {
      setError(null);
      await fetchTeamMembers(team.id);
      // Also refresh user role in case it changed
      const roleData = await fetchUserRole(user.id);
      setUserRole(roleData.role);
    } catch (err) {
      setError(`Failed to refresh team data: ${err}`);
    }
  }, [user, team]);

  // Permission checking functions
  const hasPermission = useCallback((permission: Permission): boolean => {
    return permissions.includes(permission);
  }, [permissions]);

  const hasRole = useCallback((role: Role): boolean => {
    return userRole === role;
  }, [userRole]);

  const canAccess = useCallback((requiredPermissions: Permission[]): boolean => {
    return requiredPermissions.every(permission => hasPermission(permission));
  }, [hasPermission]);

  // Team management functions
  const inviteUser = async (email: string, role: Role): Promise<boolean> => {
    try {
      if (!hasPermission(Permission.INVITE_MEMBERS)) {
        throw new Error('Insufficient permissions to invite users');
      }

      if (!team) {
        throw new Error('No team context available');
      }

      const success = await sendTeamInvitation({
        email,
        role,
        teamId: team.id,
        inviterId: user?.id || ''
      });

      if (success) {
        toast.success('Invitation sent successfully!');
        await refreshTeamData();
      }

      return success;
    } catch (err) {
      const errorMessage = `Failed to invite user: ${err}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const updateUserRole = async (userId: string, newRole: Role): Promise<boolean> => {
    try {
      if (!hasPermission(Permission.ASSIGN_ROLES)) {
        throw new Error('Insufficient permissions to assign roles');
      }

      const success = await updateTeamMemberRole(userId, newRole);
      
      if (success) {
        toast.success('User role updated successfully!');
        await refreshTeamData();
      }

      return success;
    } catch (err) {
      const errorMessage = `Failed to update user role: ${err}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const removeUser = async (userId: string): Promise<boolean> => {
    try {
      if (!hasPermission(Permission.REMOVE_MEMBERS)) {
        throw new Error('Insufficient permissions to remove users');
      }

      const success = await removeTeamMember(userId);
      
      if (success) {
        toast.success('User removed successfully!');
        await refreshTeamData();
      }

      return success;
    } catch (err) {
      const errorMessage = `Failed to remove user: ${err}`;
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setUserRole(null);
      setTeam(null);
      setTeamMembers([]);
      setPermissions([]);
      toast.success('Signed out successfully!');
    } catch (err) {
      const errorMessage = `Sign out failed: ${err}`;
      setError(errorMessage);
      toast.error(errorMessage);
    }
  };

  const contextValue: RBACContextType = {
    user,
    userRole,
    team,
    teamMembers,
    permissions,
    loading,
    error,
    hasPermission,
    hasRole,
    canAccess,
    inviteUser,
    updateUserRole,
    removeUser,
    refreshTeamData,
    signOut
  };

  return (
    <RBACContext.Provider value={contextValue}>
      {children}
    </RBACContext.Provider>
  );
};

// =============================================
// 4. API FUNCTIONS (Supabase implementation)
// =============================================

// Map database roles to RBAC roles
function mapDatabaseRoleToRBAC(dbRole: string): Role {
  switch (dbRole) {
    case 'admin': return Role.ADMIN;
    case 'team_lead': return Role.TEAM_LEAD;
    case 'employee': return Role.EMPLOYEE;
    case 'viewer': return Role.VIEWER;
    default: return Role.EMPLOYEE;
  }
}

// Map RBAC roles to database roles
function mapRBACRoleToDatabase(rbacRole: Role): string {
  switch (rbacRole) {
    case Role.SUPER_ADMIN: return 'admin'; // Map super_admin to admin in DB
    case Role.ADMIN: return 'admin';
    case Role.TEAM_LEAD: return 'team_lead';
    case Role.EMPLOYEE: return 'employee';
    case Role.VIEWER: return 'viewer';
    case Role.GUEST: return 'viewer'; // Map guest to viewer in DB
    default: return 'employee';
  }
}

async function fetchUserRole(userId: string): Promise<{ role: Role }> {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user role: ${error.message}`);
  }

  return { role: mapDatabaseRoleToRBAC(data.role) };
}

async function fetchUserTeam(userId: string): Promise<{ team: Team | null }> {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      team_id,
      teams!inner(
        id,
        name,
        description,
        created_at,
        created_by
      )
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // No team found
      return { team: null };
    }
    throw new Error(`Failed to fetch user team: ${error.message}`);
  }

  const team = data.teams as any;
  return {
    team: {
      id: team.id,
      name: team.name,
      description: team.description,
      created_at: team.created_at,
      owner_id: team.created_by
    }
  };
}

async function fetchTeamMembersData(teamId: string): Promise<TeamMember[]> {
  const { data, error } = await supabase
    .from('team_employees')
    .select(`
      user_id,
      status,
      joined_at,
      profiles!inner(
        id,
        email,
        first_name,
        last_name
      ),
      user_roles!inner(
        role
      )
    `)
    .eq('team_id', teamId);

  if (error) {
    throw new Error(`Failed to fetch team members: ${error.message}`);
  }

  return data.map((member: any) => ({
    id: member.user_id,
    email: member.profiles.email,
    first_name: member.profiles.first_name,
    last_name: member.profiles.last_name,
    role: mapDatabaseRoleToRBAC(member.user_roles.role),
    status: member.status as 'active' | 'pending' | 'inactive',
    joined_at: member.joined_at
  }));
}

async function sendTeamInvitation(data: {
  email: string;
  role: Role;
  teamId: string;
  inviterId: string;
}): Promise<boolean> {
  const { error } = await supabase.rpc('handle_team_invitation', {
    invitation_email: data.email,
    team_id: data.teamId,
    role: mapRBACRoleToDatabase(data.role) as any,
    invited_by: data.inviterId
  });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

async function updateTeamMemberRole(userId: string, newRole: Role): Promise<boolean> {
  const { error } = await supabase
    .from('user_roles')
    .update({ role: mapRBACRoleToDatabase(newRole) as any })
    .eq('user_id', userId);

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

async function removeTeamMember(userId: string): Promise<boolean> {
  // Remove from both user_roles and team_employees
  const { error: roleError } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId);

  if (roleError) {
    throw new Error(roleError.message);
  }

  const { error: employeeError } = await supabase
    .from('team_employees')
    .delete()
    .eq('user_id', userId);

  if (employeeError) {
    throw new Error(employeeError.message);
  }

  return true;
}

export const useRBAC = () => {
  const context = useContext(RBACContext);
  if (!context) {
    throw new Error('useRBAC must be used within RBACProvider');
  }
  return context;
};