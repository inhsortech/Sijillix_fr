import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedRoute() {
  const { isAuthenticated, initialized } = useSelector(
    (state) => state.auth
  );

  if (!initialized) return null;

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" replace />;
}