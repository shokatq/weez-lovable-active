import { supabase } from '@/integrations/supabase/client';

export interface Space {
  id: string;
  name: string;
  description?: string;
  team_id: string;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface SpaceMember {
  id: string;
  space_id: string;
  user_id: string;
  added_by: string;
  added_at: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    email: string;
  };
}

export class SpacesService {
  static async getTeamSpaces(teamId: string): Promise<Space[]> {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get member counts separately
      const spacesWithCounts = await Promise.all(data.map(async space => {
        const { count } = await supabase
          .from('space_members')
          .select('*', { count: 'exact', head: true })
          .eq('space_id', space.id);
        
        return {
          ...space,
          member_count: count || 0
        };
      }));

      return spacesWithCounts;
    } catch (error) {
      console.error('Error fetching team spaces:', error);
      return [];
    }
  }

  static async createSpace(teamId: string, name: string, description?: string): Promise<string | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('spaces')
        .insert({
          team_id: teamId,
          name,
          description: description || null,
          created_by: user.id
        })
        .select('id')
        .single();

      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Error creating space:', error);
      return null;
    }
  }

  static async addMemberToSpace(spaceId: string, userId: string): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('space_members')
        .insert({
          space_id: spaceId,
          user_id: userId,
          added_by: user.id
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error adding member to space:', error);
      return false;
    }
  }

  static async removeMemberFromSpace(spaceId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('space_members')
        .delete()
        .eq('space_id', spaceId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error removing member from space:', error);
      return false;
    }
  }

  static async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    try {
      const { data, error } = await supabase
        .from('space_members')
        .select(`
          *,
          profiles!space_members_user_id_fkey(first_name, last_name, email)
        `)
        .eq('space_id', spaceId)
        .order('added_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching space members:', error);
      return [];
    }
  }

  static async updateSpace(spaceId: string, updates: { name?: string; description?: string }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', spaceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating space:', error);
      return false;
    }
  }

  static async deleteSpace(spaceId: string): Promise<boolean> {
    try {
      // Delete space members first
      await supabase
        .from('space_members')
        .delete()
        .eq('space_id', spaceId);

      // Delete space
      const { error } = await supabase
        .from('spaces')
        .delete()
        .eq('id', spaceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting space:', error);
      return false;
    }
  }
}