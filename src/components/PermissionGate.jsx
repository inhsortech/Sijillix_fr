import { useSelector } from "react-redux";
import { hasPermission } from "../utils/permissions";

export default function PermissionGate({
  permission,
  children,
  fallback = null,
}) {
  const role = useSelector((state) => state.auth.user?.role);

  if (!hasPermission(role, permission)) {
    return fallback;
  }

  return children;
}