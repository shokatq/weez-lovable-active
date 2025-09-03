import React from "react";
import { hasPermission, Role, Permission } from "@/lib/permissions";

interface PermissionGuardProps {
  role: Role;
  required: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onDeniedAction?: () => void;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ 
  role, 
  required, 
  children, 
  fallback = null,
  onDeniedAction 
}) => {
  if (hasPermission(role, required)) {
    return <>{children}</>;
  }
  
  if (onDeniedAction) {
    onDeniedAction();
  }
  
  return <>{fallback}</>;
};

export default PermissionGuard;