// =============================================
// 3. PERMISSION COMPONENTS & HOOKS
// =============================================

import React from 'react';
import { useRBAC } from '@/contexts/RBACContext';
import { Role, Permission } from '@/types/rbac';

interface ProtectedComponentProps {
  permissions?: Permission[];
  roles?: Role[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({
  permissions = [],
  roles = [],
  fallback = null,
  children
}) => {
  const { canAccess, hasRole } = useRBAC();

  const hasRequiredRole = roles.length === 0 || roles.some(role => hasRole(role));
  const hasRequiredPermissions = permissions.length === 0 || canAccess(permissions);

  if (hasRequiredRole && hasRequiredPermissions) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};

// Custom hook for conditional rendering based on permissions
export const usePermissions = () => {
  const { hasPermission, hasRole, canAccess } = useRBAC();
  return { hasPermission, hasRole, canAccess };
};