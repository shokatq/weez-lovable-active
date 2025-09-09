import { supabase } from "@/integrations/supabase/client";

/**
 * Secure Profile Service
 * Uses secure database functions to prevent personal information theft
 */

export interface SafeTeamMember {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  role: 'admin' | 'team_lead' | 'employee' | 'viewer';
  status: string | null;
}

export interface SafeProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

/**
 * Get team members safely (excludes emails and other sensitive data)
 */
export async function getTeamMembersSafe(teamId: string): Promise<SafeTeamMember[]> {
  const { data, error } = await supabase.rpc('get_team_members', {
    team_id_param: teamId
  });

  if (error) {
    console.error('Error fetching team members:', error);
    throw new Error('Failed to fetch team members');
  }

  return data || [];
}

/**
 * Get basic profile info for a specific team member (name + avatar only)
 */
export async function getTeamMemberProfile(userId: string): Promise<SafeProfile | null> {
  const { data, error } = await supabase.rpc('get_team_member_info', {
    target_user_id: userId
  });

  if (error) {
    console.error('Error fetching team member profile:', error);
    throw new Error('Failed to fetch profile');
  }

  return data?.[0] || null;
}

/**
 * Get user's own email securely
 */
export async function getUserEmailSecure(userId?: string): Promise<string | null> {
  // If no userId provided, get current user's email
  const targetUserId = userId || (await supabase.auth.getUser()).data.user?.id;
  
  if (!targetUserId) {
    throw new Error('User not authenticated');
  }

  try {
    const { data, error } = await supabase.rpc('get_user_email_secure', {
      target_user_id: targetUserId
    });

    if (error) {
      console.error('Error fetching email:', error);
      return null; // Don't throw error for insufficient permissions
    }

    return data;
  } catch (error) {
    console.error('Email access denied:', error);
    return null;
  }
}

/**
 * Check if two users are team members (for UI conditional rendering)
 */
export async function areTeamMembers(user1Id: string, user2Id: string): Promise<boolean> {
  const { data, error } = await supabase.rpc('are_team_members', {
    user1_id: user1Id,
    user2_id: user2Id
  });

  if (error) {
    console.error('Error checking team membership:', error);
    return false;
  }

  return data || false;
}

/**
 * Get current user's profile (full access to own data)
 */
export async function getCurrentUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching current user profile:', error);
    throw new Error('Failed to fetch profile');
  }

  return data;
}

/**
 * Update current user's profile (users can only update their own)
 */
export async function updateCurrentUserProfile(updates: {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}) {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }

  return data;
}