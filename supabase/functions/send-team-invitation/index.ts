import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvitationRequest {
  inviteeEmail: string;
  inviteeName: string;
  workspaceName: string;
  userRole: string;
  userDepartment: string;
  inviterName: string;
  invitationId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader = req.headers.get('Authorization') || '';

    // Client with caller's JWT (respect RLS)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service role client for internal verification only
    const adminClient = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Ensure caller is authenticated
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const {
      inviteeEmail,
      inviteeName,
      workspaceName,
      userRole,
      userDepartment,
      inviterName,
      invitationId
    }: InvitationRequest = await req.json();

    // Verify the invitation exists and caller is authorized
    const { data: inviteRecord, error: inviteErr } = await adminClient
      .from('team_invitations')
      .select('id, team_id, invited_by')
      .eq('id', invitationId)
      .maybeSingle();

    if (inviteErr || !inviteRecord) {
      return new Response(JSON.stringify({ error: 'Invalid or unknown invitation' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: roleRows, error: roleErr } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userData.user.id)
      .eq('team_id', inviteRecord.team_id);

    if (roleErr) {
      console.error('Role check error:', roleErr);
      return new Response(JSON.stringify({ error: 'Role verification failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const isInviter = inviteRecord.invited_by === userData.user.id;
    const hasPermission = (roleRows || []).some((r: any) => r.role === 'admin' || r.role === 'team_lead');

    if (!isInviter && !hasPermission) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log("Sending invitation email to:", inviteeEmail);

    // Construct the accept invitation URL - use the frontend URL
    const frontendUrl = 'https://usuthdsminfqguflnzgs.lovable.app';
    const acceptUrl = `${frontendUrl}/accept-invitation?id=${invitationId}`;

    // Use SendGrid to send the email
    const fromEmail = "Weez.AI <support@em3196.weez.online>";
    
    console.log("Using from email:", fromEmail);
    console.log("Invitation URL:", acceptUrl);

    // SendGrid API call
    const sendGridApiKey = Deno.env.get("SENDGRID_API_KEY");
    
    if (!sendGridApiKey) {
      throw new Error("SendGrid API key not configured");
    }

    const emailPayload = {
      personalizations: [
        {
          to: [{ email: inviteeEmail, name: inviteeName }]
        }
      ],
      from: { email: "support@em3196.weez.online", name: "Weez.AI" },
      subject: `You've been invited to join ${workspaceName} at Weez.AI`,
      content: [
        {
          type: "text/html",
          value: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <title>Team Invitation</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8fafc;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
                  <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Weez.AI</h1>
                  <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">AI-Powered Workspace Management</p>
                </div>

                <!-- Content -->
                <div style="padding: 40px 30px;">
                  <h2 style="color: #1a202c; margin: 0 0 20px 0; font-size: 24px; font-weight: 600;">You're Invited to Join ${workspaceName}!</h2>
                  
                  <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px;">Hi ${inviteeName},</p>
                  
                  <p style="color: #4a5568; margin: 0 0 24px 0; font-size: 16px;">
                    <strong>${inviterName}</strong> has invited you to join "<strong>${workspaceName}</strong>" at Weez.AI as a <strong>${userRole}</strong> in the <strong>${userDepartment}</strong> department.
                  </p>

                  <!-- Invitation Details -->
                  <div style="background-color: #f7fafc; border-radius: 8px; padding: 24px; margin: 24px 0; border-left: 4px solid #667eea;">
                    <h3 style="color: #2d3748; margin: 0 0 16px 0; font-size: 18px; font-weight: 600;">Invitation Details</h3>
                    <ul style="color: #4a5568; margin: 0; padding: 0; list-style: none;">
                      <li style="margin: 8px 0; display: flex; align-items: center;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Workspace:</span>
                        <span>${workspaceName}</span>
                      </li>
                      <li style="margin: 8px 0; display: flex; align-items: center;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Role:</span>
                        <span>${userRole}</span>
                      </li>
                      <li style="margin: 8px 0; display: flex; align-items: center;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Department:</span>
                        <span>${userDepartment}</span>
                      </li>
                      <li style="margin: 8px 0; display: flex; align-items: center;">
                        <span style="font-weight: 600; min-width: 100px; color: #2d3748;">Invited by:</span>
                        <span>${inviterName}</span>
                      </li>
                    </ul>
                  </div>

                  <!-- CTA Button -->
                  <div style="text-align: center; margin: 32px 0;">
                    <a href="${acceptUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                      Accept Invitation
                    </a>
                  </div>

                  <p style="color: #718096; margin: 24px 0 0 0; font-size: 14px; text-align: center;">
                    Weez.AI helps teams collaborate more effectively with AI-powered workspace management, intelligent task automation, and seamless team coordination.
                  </p>
                </div>

                <!-- Footer -->
                <div style="background-color: #f7fafc; padding: 24px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                  <p style="color: #718096; margin: 0; font-size: 14px;">
                    If you didn't expect this invitation, you can safely ignore this email.
                  </p>
                  <p style="color: #a0aec0; margin: 8px 0 0 0; font-size: 12px;">
                    This email was sent by Weez.AI • AI-Powered Workspace Management
                  </p>
                </div>
              </div>
            </body>
            </html>
          `
        }
      ]
    };

    const emailResponse = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${sendGridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(emailPayload),
    });

    if (!emailResponse.ok) {
      const errorText = await emailResponse.text();
      console.error("SendGrid API error:", errorText);
      throw new Error(`SendGrid API error: ${emailResponse.status} - ${errorText}`);
    }

    console.log("Email sent successfully via SendGrid");

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-team-invitation function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);