import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.53.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvitationRequest {
  spaceId: string;
  email: string;
  role: 'admin' | 'team_lead' | 'viewer' | 'employee';
  spaceName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));
    
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid authentication');
    }

    const { spaceId, email, role, spaceName }: InvitationRequest = await req.json();

    // Verify user has permission to invite to this space
    const { data: spaceAccess, error: accessError } = await supabase
      .from('space_members')
      .select('role')
      .eq('space_id', spaceId)
      .eq('user_id', user.id)
      .single();

    if (accessError || !spaceAccess || spaceAccess.role !== 'admin') {
      // Check if user is space creator
      const { data: space, error: spaceError } = await supabase
        .from('spaces')
        .select('created_by')
        .eq('id', spaceId)
        .single();

      if (spaceError || space.created_by !== user.id) {
        throw new Error('Insufficient permissions to invite users');
      }
    }

    // Create invitation record
    const { data: invitation, error: inviteError } = await supabase
      .from('space_invitations')
      .insert({
        space_id: spaceId,
        email,
        role,
        invited_by: user.id
      })
      .select('token')
      .single();

    if (inviteError) {
      throw inviteError;
    }

    // Send email invitation
    const inviteUrl = `${Deno.env.get('SUPABASE_URL')?.replace('supabase.co', 'supabase.co')}/auth/v1/verify?token=${invitation.token}&type=invite&redirect_to=${encodeURIComponent(window.location.origin + '/spaces')}`;

    const emailResponse = await resend.emails.send({
      from: 'Spaces <noreply@resend.dev>',
      to: [email],
      subject: `You've been invited to join ${spaceName}`,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <h1 style="color: #333; margin-bottom: 20px;">Join ${spaceName}</h1>
          <p style="color: #666; font-size: 16px; line-height: 1.5;">
            You've been invited to join the space "${spaceName}" with ${role} permissions.
          </p>
          <div style="margin: 30px 0;">
            <a href="${inviteUrl}" 
               style="background: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #999; font-size: 14px;">
            If you don't have an account, you'll be prompted to create one.
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully:', emailResponse);

    return new Response(
      JSON.stringify({ success: true, invitation_id: invitation.token }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error('Error in send-space-invitation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);