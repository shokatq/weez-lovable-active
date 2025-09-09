-- Fix remaining function search_path security issues

-- Update all remaining functions to have proper search_path settings
CREATE OR REPLACE FUNCTION public.validate_email_format(email_input text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Basic email validation regex
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.check_invitation_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_invitations integer;
BEGIN
  -- Check if user has sent more than 10 invitations in the last hour
  SELECT COUNT(*) INTO recent_invitations
  FROM public.team_invitations
  WHERE invited_by = auth.uid()
  AND created_at > (now() - interval '1 hour');
  
  IF recent_invitations >= 10 THEN
    RAISE EXCEPTION 'Rate limit exceeded. Please wait before sending more invitations.';
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.create_audit_log(p_user_id uuid, p_team_id uuid, p_action text, p_resource_type text, p_resource_id uuid DEFAULT NULL::uuid, p_old_values jsonb DEFAULT NULL::jsonb, p_new_values jsonb DEFAULT NULL::jsonb, p_metadata jsonb DEFAULT '{}'::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text, p_severity text DEFAULT 'info'::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  audit_id uuid;
  current_user_id uuid := auth.uid();
  team_to_use uuid := NULL;
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  -- Validate team membership if a team_id is provided
  IF p_team_id IS NOT NULL THEN
    IF EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = current_user_id AND team_id = p_team_id
    ) THEN
      team_to_use := p_team_id;
    ELSE
      RAISE EXCEPTION 'User is not a member of the specified team';
    END IF;
  END IF;

  INSERT INTO public.audit_logs (
    user_id, team_id, action, resource_type, resource_id,
    old_values, new_values, metadata, ip_address, user_agent, severity
  )
  VALUES (
    current_user_id, team_to_use, p_action, p_resource_type, p_resource_id,
    p_old_values, p_new_values, p_metadata, p_ip_address, p_user_agent, p_severity
  )
  RETURNING id INTO audit_id;

  RETURN audit_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.detect_anomalies()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
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
$$;

CREATE OR REPLACE FUNCTION public.create_team_with_setup(team_name text, team_description text DEFAULT NULL::text, user_first_name text DEFAULT NULL::text, user_last_name text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
  new_team_id uuid;
  dept_record record;
  result jsonb;
  user_email text;
  user_metadata jsonb;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Verify user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get user email and metadata safely
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  SELECT raw_user_meta_data INTO user_metadata FROM auth.users WHERE id = current_user_id;
  
  -- Ensure user profile exists (create if missing)
  INSERT INTO public.profiles (id, email, first_name, last_name)
  SELECT 
    current_user_id,
    user_email,
    COALESCE(user_first_name, user_metadata->>'first_name'),
    COALESCE(user_last_name, user_metadata->>'last_name')
  WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = current_user_id
  );
  
  -- Create the team
  INSERT INTO public.teams (name, description, created_by)
  VALUES (team_name, team_description, current_user_id)
  RETURNING id INTO new_team_id;
  
  -- Assign user as admin
  INSERT INTO public.user_roles (user_id, team_id, role)
  VALUES (current_user_id, new_team_id, 'admin');
  
  -- Create default departments
  FOR dept_record IN 
    SELECT * FROM (VALUES 
      ('Engineering', 'Software development and technical teams'),
      ('Marketing', 'Marketing and brand management'),
      ('Sales', 'Sales and business development'),
      ('HR', 'Human resources and people operations'),
      ('Finance', 'Financial planning and accounting'),
      ('Operations', 'Business operations and logistics')
    ) AS depts(name, description)
  LOOP
    INSERT INTO public.departments (name, description, team_id)
    VALUES (dept_record.name, dept_record.description, new_team_id);
  END LOOP;
  
  -- Add user to team employees
  INSERT INTO public.team_employees (user_id, team_id, status, invited_by)
  VALUES (current_user_id, new_team_id, 'active', current_user_id);
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'team_id', new_team_id,
    'message', 'Team created successfully'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.accept_team_invitation(invitation_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
  invitation_record record;
  result jsonb;
  user_email text;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Verify user is authenticated
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get user email
  SELECT email INTO user_email FROM auth.users WHERE id = current_user_id;
  
  -- Get invitation details
  SELECT * INTO invitation_record 
  FROM public.team_invitations 
  WHERE id = invitation_id 
  AND expires_at > now() 
  AND accepted_at IS NULL;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Invalid or expired invitation';
  END IF;
  
  -- Verify email matches
  IF invitation_record.email != user_email THEN
    RAISE EXCEPTION 'Invitation email does not match your account';
  END IF;
  
  -- Check if user is already in the team
  IF EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = current_user_id AND team_id = invitation_record.team_id
  ) THEN
    RAISE EXCEPTION 'User is already a member of this team';
  END IF;
  
  -- Add user to team
  INSERT INTO public.user_roles (user_id, team_id, role)
  VALUES (current_user_id, invitation_record.team_id, invitation_record.role);
  
  -- Add to team employees
  INSERT INTO public.team_employees (user_id, team_id, status, invited_by)
  VALUES (current_user_id, invitation_record.team_id, 'active', invitation_record.invited_by);
  
  -- Mark invitation as accepted
  UPDATE public.team_invitations 
  SET accepted_at = now() 
  WHERE id = invitation_id;
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'team_id', invitation_record.team_id,
    'role', invitation_record.role,
    'message', 'Successfully joined team'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_team_invitation(invitation_email text, team_id uuid, role app_role, invited_by uuid, custom_department text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  current_user_id uuid;
  invitation_id uuid;
  result jsonb;
BEGIN
  -- Get the current authenticated user
  current_user_id := auth.uid();
  
  -- Verify user is authenticated and has permission to invite
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Check if user can manage team (admin or team_lead)
  IF NOT (is_team_admin(current_user_id, handle_team_invitation.team_id) OR 
          get_user_role_in_team(current_user_id, handle_team_invitation.team_id) = 'team_lead') THEN
    RAISE EXCEPTION 'Insufficient permissions to invite team members';
  END IF;
  
  -- Check if email is already invited to this team (fix ambiguous column reference)
  IF EXISTS (
    SELECT 1 FROM public.team_invitations ti
    WHERE ti.email = handle_team_invitation.invitation_email 
    AND ti.team_id = handle_team_invitation.team_id 
    AND ti.accepted_at IS NULL
    AND ti.expires_at > now()
  ) THEN
    RAISE EXCEPTION 'User is already invited to this team';
  END IF;
  
  -- Create the invitation
  INSERT INTO public.team_invitations (email, team_id, role, invited_by)
  VALUES (handle_team_invitation.invitation_email, handle_team_invitation.team_id, handle_team_invitation.role, handle_team_invitation.invited_by)
  RETURNING id INTO invitation_id;
  
  -- Return success result
  result := jsonb_build_object(
    'success', true,
    'invitation_id', invitation_id,
    'message', 'Invitation created successfully'
  );
  
  RETURN result;
  
EXCEPTION
  WHEN OTHERS THEN
    -- Return error details
    result := jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'code', SQLSTATE
    );
    RETURN result;
END;
$$;