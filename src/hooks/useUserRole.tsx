import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'team_lead' | 'employee' | 'viewer';

interface UserRoleData {
  role: UserRole;
  teamId: string;
  teamName: string;
}

export const useUserRole = () => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasTeam, setHasTeam] = useState(false);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        // Check if user has any team roles
        const { data: roles, error } = await supabase
          .from('user_roles')
          .select(`
            role,
            team_id,
            teams (
              id,
              name
            )
          `)
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user role:', error);
          setLoading(false);
          return;
        }

        if (roles && roles.teams) {
          setUserRole({
            role: roles.role as UserRole,
            teamId: roles.team_id,
            teamName: (roles.teams as any).name,
          });
          setHasTeam(true);
        } else {
          setHasTeam(false);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = userRole?.role === 'admin';
  const isTeamLead = userRole?.role === 'team_lead';
  const canManageTeam = isAdmin || isTeamLead;

  return {
    userRole,
    hasTeam,
    loading,
    isAdmin,
    isTeamLead,
    canManageTeam,
    refreshRole: () => {
      setLoading(true);
      // Re-trigger the effect
      if (user) {
        const fetchUserRole = async () => {
          try {
            const { data: roles, error } = await supabase
              .from('user_roles')
              .select(`
                role,
                team_id,
                teams (
                  id,
                  name
                )
              `)
              .eq('user_id', user.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching user role:', error);
              setLoading(false);
              return;
            }

            if (roles && roles.teams) {
              setUserRole({
                role: roles.role as UserRole,
                teamId: roles.team_id,
                teamName: (roles.teams as any).name,
              });
              setHasTeam(true);
            } else {
              setHasTeam(false);
            }
          } catch (error) {
            console.error('Error fetching user role:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchUserRole();
      }
    },
  };
};