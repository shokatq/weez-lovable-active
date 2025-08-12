import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const authHeader = req.headers.get('Authorization') || '';

    // Use the caller's JWT for all operations (respect RLS)
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Ensure caller is authenticated
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Only allow admins to run anomaly detection
    const { data: adminRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('team_id, role')
      .eq('user_id', userData.user.id)
      .eq('role', 'admin');

    if (rolesError) {
      console.error('Error verifying roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Role verification failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!adminRoles || adminRoles.length === 0) {
      return new Response(JSON.stringify({ error: 'Forbidden: admin role required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Starting anomaly detection by user', userData.user.id);

    // Call the anomaly detection function (SECURITY DEFINER handles inserts)
    const { error } = await supabase.rpc('detect_anomalies');

    if (error) {
      console.error('Error detecting anomalies:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to detect anomalies' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch new alerts for teams where the user is admin
    const teamIds = adminRoles.map((r: any) => r.team_id).filter(Boolean);
    const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    const { data: newAlerts, error: alertsError } = await supabase
      .from('anomaly_alerts')
      .select(`*, profiles (first_name, last_name, email)`) // relies on FK/view setup
      .eq('status', 'open')
      .gte('created_at', since)
      .in('team_id', teamIds);

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
    } else if (newAlerts && newAlerts.length > 0) {
      console.log(`Found ${newAlerts.length} new anomaly alerts`);
      for (const alert of newAlerts) {
        console.log(`🚨 ${alert.severity?.toUpperCase?.() || 'INFO'} Alert: ${alert.description}`);
        console.log(`   User: ${alert.profiles?.email}`);
        console.log(`   Type: ${alert.alert_type}`);
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Anomaly detection completed',
        newAlerts: newAlerts?.length || 0 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
})