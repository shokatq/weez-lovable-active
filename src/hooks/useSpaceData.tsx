import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface SpaceData {
  id: string;
  name: string;
  description: string | null;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface SpaceMember {
  id: string;
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
  role: string;
  status: string;
  added_at: string;
}

export const useSpaceData = (spaceId: string | undefined) => {
  const [space, setSpace] = useState<SpaceData | null>(null);
  const [members, setMembers] = useState<SpaceMember[]>([]);
  const [userRole, setUserRole] = useState<string>('viewer');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadSpaceData = async () => {
    if (!spaceId || !user) return;

    try {
      setLoading(true);
      setError(null);

      // Load space details
      const { data: spaceData, error: spaceError } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();

      if (spaceError) throw spaceError;
      setSpace(spaceData);

      // Load space members with profiles
      const { data: membersData, error: membersError } = await supabase
        .rpc('get_space_members_with_profiles', { space_id_param: spaceId });

      if (membersError) throw membersError;
      setMembers(membersData || []);

      // Get current user role
      const currentUserMember = membersData?.find(member => member.user_id === user.id);
      if (currentUserMember) {
        setUserRole(currentUserMember.role || 'viewer');
      }

    } catch (error: any) {
      console.error('Error loading space data:', error);
      setError(error.message || 'Failed to load space data');
      toast({
        title: "Error",
        description: error.message || 'Failed to load space data',
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaceData();
  }, [spaceId, user]);

  return {
    space,
    members,
    userRole,
    loading,
    error,
    reload: loadSpaceData
  };
};