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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Starting anomaly detection...');

    // Call the anomaly detection function
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

    // Check for any new alerts that need notification
    const { data: newAlerts, error: alertsError } = await supabase
      .from('anomaly_alerts')
      .select(`
        *,
        profiles (first_name, last_name, email)
      `)
      .eq('status', 'open')
      .gte('created_at', new Date(Date.now() - 60 * 60 * 1000).toISOString()); // Last hour

    if (alertsError) {
      console.error('Error fetching alerts:', alertsError);
    } else if (newAlerts && newAlerts.length > 0) {
      console.log(`Found ${newAlerts.length} new anomaly alerts`);
      
      // Here you could send notifications via email or other channels
      // For now, we'll just log them
      for (const alert of newAlerts) {
        console.log(`🚨 ${alert.severity.toUpperCase()} Alert: ${alert.description}`);
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