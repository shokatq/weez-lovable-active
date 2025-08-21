-- Fix the auth.raw_user_meta_data() issue in create_team_with_setup function
CREATE OR REPLACE FUNCTION public.create_team_with_setup(team_name text, team_description text DEFAULT NULL::text, user_first_name text DEFAULT NULL::text, user_last_name text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;

-- Also fix the handle_new_user function
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