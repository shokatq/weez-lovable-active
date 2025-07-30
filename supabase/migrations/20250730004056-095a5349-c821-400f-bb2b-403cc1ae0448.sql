-- Fix ambiguous column reference in handle_team_invitation function
CREATE OR REPLACE FUNCTION public.handle_team_invitation(invitation_email text, team_id uuid, role app_role, invited_by uuid, custom_department text DEFAULT NULL::text)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
$function$;