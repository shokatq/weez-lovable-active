import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SpaceData {
  id: string;
  name: string;
  description: string | null;
  team_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  member_count?: number;
  file_count?: number;
}

export interface CreateSpaceForm {
  name: string;
  description?: string;
  team_id: string;
}

export function useSpaces() {
  const [spaces, setSpaces] = useState<SpaceData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchSpaces = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      // Get spaces where user is a member
      const { data: memberSpaces, error: memberError } = await supabase
        .from('space_members')
        .select('space_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (memberError) {
        console.error('Error fetching member spaces:', memberError);
        throw memberError;
      }

      const spaceIds = memberSpaces?.map(m => m.space_id) || [];

      if (spaceIds.length === 0) {
        setSpaces([]);
        return;
      }

      // Get space details
      const { data: spacesData, error: spacesError } = await supabase
        .from('spaces')
        .select('*')
        .in('id', spaceIds)
        .order('updated_at', { ascending: false });

      if (spacesError) {
        console.error('Error fetching spaces:', spacesError);
        throw spacesError;
      }

      // Get counts for each space
      const spacesWithCounts = await Promise.all(
        (spacesData || []).map(async (space) => {
          // Get member count
          const { count: memberCount } = await supabase
            .from('space_members')
            .select('*', { count: 'exact', head: true })
            .eq('space_id', space.id)
            .eq('status', 'active');

          // Get file count
          const { count: fileCount } = await supabase
            .from('files')
            .select('*', { count: 'exact', head: true })
            .eq('space_id', space.id);

          return {
            ...space,
            member_count: memberCount || 0,
            file_count: fileCount || 0,
          };
        })
      );

      setSpaces(spacesWithCounts);
    } catch (error: any) {
      console.error('Error fetching spaces:', error);
      setError(error.message || 'Failed to fetch spaces');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const createSpace = async (data: CreateSpaceForm) => {
    if (!user?.id) throw new Error('User not authenticated');

    try {
      setLoading(true);
      setError(null);

      // Create the space
      const { data: newSpace, error: spaceError } = await supabase
        .from('spaces')
        .insert({
          name: data.name,
          description: data.description,
          team_id: data.team_id,
          created_by: user.id,
        })
        .select()
        .single();

      if (spaceError) throw spaceError;

      // Add creator as admin member
      const { error: memberError } = await supabase
        .from('space_members')
        .insert({
          space_id: newSpace.id,
          user_id: user.id,
          role: 'admin',
          added_by: user.id,
          status: 'active',
        });

      if (memberError) {
        console.error('Error adding creator as member:', memberError);
        // Don't throw here - space is created successfully
      }

      // Refresh spaces list
      await fetchSpaces();

      toast({
        title: 'Success',
        description: 'Space created successfully',
      });

      return newSpace;
    } catch (error: any) {
      console.error('Error creating space:', error);
      const errorMessage = error.message || 'Failed to create space';
      setError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  // Set up real-time subscription for space changes
  useEffect(() => {
    if (!user?.id) return;

    const memberChannel = supabase
      .channel(`user-spaces-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'space_members',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchSpaces();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'spaces',
        },
        () => {
          fetchSpaces();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(memberChannel);
    };
  }, [user?.id, fetchSpaces]);

  return {
    spaces,
    loading,
    error,
    fetchSpaces,
    createSpace,
  };
}