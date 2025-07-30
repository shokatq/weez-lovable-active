import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.53.0";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
    // Initialize Supabase client with service role for server-side operations
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const {
      inviteeEmail,
      inviteeName,
      workspaceName,
      userRole,
      userDepartment,
      inviterName,
      invitationId
    }: InvitationRequest = await req.json();

    console.log("Sending invitation email to:", inviteeEmail);

    const acceptUrl = `${Deno.env.get("SUPABASE_URL")?.replace('/auth', '')}/accept-invitation?id=${invitationId}`;

    const emailResponse = await resend.emails.send({
      from: "Weez.AI <team@weez.ai>",
      to: [inviteeEmail],
      subject: `You've been invited to join ${workspaceName} at Weez.AI`,
      html: `
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
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true, emailResponse }), {
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