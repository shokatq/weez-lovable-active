-- SECURITY FIX: Remove overly permissive profiles policy and secure database functions

-- 1. Remove the dangerous "Users can view all profiles" policy that allows public access
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- 2. Secure database functions with proper search_path settings
CREATE OR REPLACE FUNCTION public.detect_anomalies()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  user_record record;
  action_count integer;
  recent_threshold timestamp := now() - interval '1 hour';
BEGIN
  -- Detect suspicious login patterns
  FOR user_record IN 
    SELECT user_id, team_id, COUNT(*) as login_count
    FROM public.audit_logs 
    WHERE action = 'user_login' 
    AND timestamp > recent_threshold
    GROUP BY user_id, team_id
    HAVING COUNT(*) > 10
  LOOP
    INSERT INTO public.anomaly_alerts (
      alert_type, user_id, team_id, description, severity
    )
    VALUES (
      'suspicious_login_pattern',
      user_record.user_id,
      user_record.team_id,
      format('User has logged in %s times in the last hour', user_record.login_count),
      'high'
    );
  END LOOP;
  
  -- Detect bulk deletion activities
  FOR user_record IN 
    SELECT user_id, team_id, COUNT(*) as delete_count
    FROM public.audit_logs 
    WHERE action LIKE '%_delete' 
    AND timestamp > recent_threshold
    GROUP BY user_id, team_id
    HAVING COUNT(*) > 5
  LOOP
    INSERT INTO public.anomaly_alerts (
      alert_type, user_id, team_id, description, severity
    )
    VALUES (
      'bulk_deletion_activity',
      user_record.user_id,
      user_record.team_id,
      format('User has deleted %s items in the last hour', user_record.delete_count),
      'critical'
    );
  END LOOP;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$function$;

-- 3. Restrict permissions table access to admin-only
DROP POLICY IF EXISTS "Users can view permissions" ON public.permissions;

CREATE POLICY "Only admins can view permissions" 
ON public.permissions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- 4. Add enhanced audit logging for security events
CREATE OR REPLACE FUNCTION public.log_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Log profile access attempts
  INSERT INTO public.audit_logs (
    user_id, action, resource_type, resource_id, metadata, severity
  )
  VALUES (
    auth.uid(),
    'profile_access',
    'profile',
    NEW.id,
    jsonb_build_object('accessed_profile_email', NEW.email),
    'low'
  );
  RETURN NEW;
END;
$function$;

-- Create trigger for profile access logging
CREATE TRIGGER log_profile_access_trigger
  AFTER SELECT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.log_profile_access();