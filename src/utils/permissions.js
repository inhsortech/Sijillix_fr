const permissions = {
  super_admin: ["*"],

  admin: [
    "dashboard:read",
    "users:read", "users:create", "users:update", "users:delete",
    "employees:read", "employees:create", "employees:update", "employees:delete",
    "documents:read", "documents:create", "documents:update", "documents:delete",
    "tasks:read", "tasks:create", "tasks:update", "tasks:delete",
    "auditlogs:read",
  ],

  manager: [
    "dashboard:read",
    "employees:read", "employees:create", "employees:update",
    "documents:read", "documents:create", "documents:update",
    "tasks:read", "tasks:create", "tasks:update",
  ],

  viewer: [
    "dashboard:read",
    "employees:read",
    "documents:read",
    "tasks:read",
  ],
};

export function hasPermission(role, permission) {
  const rolePermissions = permissions[role] || [];

  return (
    rolePermissions.includes("*") ||
    rolePermissions.includes(permission)
  );
}