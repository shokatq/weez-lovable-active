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

        if (error) {
          // Handle different error types gracefully
          if (error.code === 'PGRST116') {
            // No rows found - user has no team role
            setHasTeam(false);
          } else if (error.code === '406' || error.message?.includes('Not Acceptable')) {
            // Permission denied or table access issue - treat as no team role
            console.warn('User roles table access denied, treating as no team role:', error.message);
            setHasTeam(false);
          } else {
            console.error('Error fetching user role:', error);
            setHasTeam(false);
          }
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
        setHasTeam(false);
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent rapid calls
    const timeoutId = setTimeout(fetchUserRole, 100);
    return () => clearTimeout(timeoutId);
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

            if (error) {
              // Handle different error types gracefully
              if (error.code === 'PGRST116') {
                // No rows found - user has no team role
                setHasTeam(false);
              } else if (error.code === '406' || error.message?.includes('Not Acceptable')) {
                // Permission denied or table access issue - treat as no team role
                console.warn('User roles table access denied, treating as no team role:', error.message);
                setHasTeam(false);
              } else {
                console.error('Error fetching user role:', error);
                setHasTeam(false);
              }
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
            setHasTeam(false);
          } finally {
            setLoading(false);
          }
        };
        fetchUserRole();
      }
    },
  };
};