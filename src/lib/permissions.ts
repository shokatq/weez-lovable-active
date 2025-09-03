// RBAC Permissions System for Weez Spaces
export const rolePermissions = {
  owner: [
    "create_space",
    "delete_space", 
    "manage_roles",
    "add_member",
    "remove_member",
    "edit_docs",
    "delete_docs",
    "view_docs",
    "summarize_docs",
    "manage_tasks",
    "share_files"
  ],
  admin: [
    "add_member",
    "remove_member", 
    "edit_docs",
    "delete_docs",
    "view_docs",
    "summarize_docs",
    "manage_tasks",
    "share_files"
  ],
  editor: [
    "edit_docs",
    "view_docs", 
    "summarize_docs",
    "manage_tasks",
    "share_files"
  ],
  viewer: [
    "view_docs"
  ]
} as const;

export type Permission = typeof rolePermissions[keyof typeof rolePermissions][number];
export type Role = keyof typeof rolePermissions;

export const hasPermission = (role: Role, requiredPermission: Permission): boolean => {
  const permissions = rolePermissions[role] || [];
  return (permissions as Permission[]).includes(requiredPermission);
};