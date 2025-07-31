-- Create audit logs table
CREATE TABLE public.audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  team_id uuid,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id uuid,
  old_values jsonb,
  new_values jsonb,
  metadata jsonb DEFAULT '{}',
  ip_address inet,
  user_agent text,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  severity text DEFAULT 'info' CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

-- Create document versions table
CREATE TABLE public.document_versions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  document_id uuid NOT NULL,
  version_number integer NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  team_id uuid,
  content jsonb,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(document_id, version_number)
);

-- Create permission audit table
CREATE TABLE public.permission_audits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  team_id uuid,
  target_user_id uuid,
  permission_type text NOT NULL,
  old_permission text,
  new_permission text,
  resource_type text,
  resource_id uuid,
  granted_by uuid REFERENCES auth.users(id),
  timestamp timestamp with time zone NOT NULL DEFAULT now()
);

-- Create anomaly alerts table
CREATE TABLE public.anomaly_alerts (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  alert_type text NOT NULL,
  user_id uuid REFERENCES auth.users(id),
  team_id uuid,
  description text NOT NULL,
  severity text DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'dismissed')),
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone
);

-- Enable RLS on all audit tables
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permission_audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.anomaly_alerts ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for audit_logs
CREATE POLICY "Admins can view all audit logs" 
ON public.audit_logs 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND team_id = audit_logs.team_id 
    AND role = 'admin'
  )
);

CREATE POLICY "System can insert audit logs" 
ON public.audit_logs 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for document_versions
CREATE POLICY "Team members can view document versions" 
ON public.document_versions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND team_id = document_versions.team_id
  )
);

CREATE POLICY "Authenticated users can create document versions" 
ON public.document_versions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for permission_audits
CREATE POLICY "Admins can view permission audits" 
ON public.permission_audits 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND team_id = permission_audits.team_id 
    AND role = 'admin'
  )
);

CREATE POLICY "System can insert permission audits" 
ON public.permission_audits 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for anomaly_alerts
CREATE POLICY "Admins can manage anomaly alerts" 
ON public.anomaly_alerts 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND team_id = anomaly_alerts.team_id 
    AND role = 'admin'
  )
);

-- Create indexes for performance
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_team_id ON public.audit_logs(team_id);
CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);

CREATE INDEX idx_document_versions_document_id ON public.document_versions(document_id);
CREATE INDEX idx_document_versions_created_at ON public.document_versions(created_at DESC);

CREATE INDEX idx_permission_audits_user_id ON public.permission_audits(user_id);
CREATE INDEX idx_permission_audits_team_id ON public.permission_audits(team_id);
CREATE INDEX idx_permission_audits_timestamp ON public.permission_audits(timestamp DESC);

CREATE INDEX idx_anomaly_alerts_team_id ON public.anomaly_alerts(team_id);
CREATE INDEX idx_anomaly_alerts_status ON public.anomaly_alerts(status);
CREATE INDEX idx_anomaly_alerts_severity ON public.anomaly_alerts(severity);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION public.create_audit_log(
  p_user_id uuid,
  p_team_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid DEFAULT NULL,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_metadata jsonb DEFAULT '{}',
  p_ip_address inet DEFAULT NULL,
  p_user_agent text DEFAULT NULL,
  p_severity text DEFAULT 'info'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  audit_id uuid;
BEGIN
  INSERT INTO public.audit_logs (
    user_id, team_id, action, resource_type, resource_id,
    old_values, new_values, metadata, ip_address, user_agent, severity
  )
  VALUES (
    p_user_id, p_team_id, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_metadata, p_ip_address, p_user_agent, p_severity
  )
  RETURNING id INTO audit_id;
  
  RETURN audit_id;
END;
$$;

-- Create function to detect anomalies
CREATE OR REPLACE FUNCTION public.detect_anomalies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;