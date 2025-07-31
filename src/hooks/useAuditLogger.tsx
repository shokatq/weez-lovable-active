import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';

export interface AuditLogData {
  action: string;
  resourceType: string;
  resourceId?: string;
  oldValues?: any;
  newValues?: any;
  metadata?: any;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

export const useAuditLogger = () => {
  const { user } = useAuth();
  const { userRole } = useUserRole();

  const logAuditEvent = useCallback(async (data: AuditLogData) => {
    if (!user || !userRole?.teamId) return;

    try {
      // Get client IP and user agent from browser
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase.rpc('create_audit_log', {
        p_user_id: user.id,
        p_team_id: userRole.teamId,
        p_action: data.action,
        p_resource_type: data.resourceType,
        p_resource_id: data.resourceId || null,
        p_old_values: data.oldValues || null,
        p_new_values: data.newValues || null,
        p_metadata: data.metadata || {},
        p_user_agent: userAgent,
        p_severity: data.severity || 'info'
      });

      if (error) {
        console.error('Failed to log audit event:', error);
      }
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  }, [user, userRole]);

  // Convenience methods for common actions
  const logLogin = useCallback(() => {
    logAuditEvent({
      action: 'user_login',
      resourceType: 'auth',
      severity: 'low'
    });
  }, [logAuditEvent]);

  const logLogout = useCallback(() => {
    logAuditEvent({
      action: 'user_logout',
      resourceType: 'auth',
      severity: 'low'
    });
  }, [logAuditEvent]);

  const logFileAccess = useCallback((fileId: string, fileName: string) => {
    logAuditEvent({
      action: 'file_access',
      resourceType: 'document',
      resourceId: fileId,
      metadata: { fileName },
      severity: 'low'
    });
  }, [logAuditEvent]);

  const logFileEdit = useCallback((fileId: string, fileName: string, changes: any) => {
    logAuditEvent({
      action: 'file_edit',
      resourceType: 'document',
      resourceId: fileId,
      newValues: changes,
      metadata: { fileName },
      severity: 'medium'
    });
  }, [logAuditEvent]);

  const logFileDelete = useCallback((fileId: string, fileName: string) => {
    logAuditEvent({
      action: 'file_delete',
      resourceType: 'document',
      resourceId: fileId,
      metadata: { fileName },
      severity: 'high'
    });
  }, [logAuditEvent]);

  const logPermissionChange = useCallback((targetUserId: string, oldPermission: string, newPermission: string, resourceType: string) => {
    logAuditEvent({
      action: 'permission_change',
      resourceType,
      oldValues: { permission: oldPermission },
      newValues: { permission: newPermission },
      metadata: { targetUserId },
      severity: 'high'
    });
  }, [logAuditEvent]);

  const logTeamInvite = useCallback((email: string, role: string) => {
    logAuditEvent({
      action: 'team_invite',
      resourceType: 'team',
      metadata: { email, role },
      severity: 'medium'
    });
  }, [logAuditEvent]);

  return {
    logAuditEvent,
    logLogin,
    logLogout,
    logFileAccess,
    logFileEdit,
    logFileDelete,
    logPermissionChange,
    logTeamInvite
  };
};