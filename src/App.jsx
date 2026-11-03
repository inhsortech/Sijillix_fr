import { Navigate, Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
import Users from "./pages/Users";
import Organizations from "./pages/Organizations";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGate from "./components/PermissionGate";

function PageNotFound() {
  return <h2>404 - Page not found</h2>;
}

function ProtectedPage({ permission, children }) {
  return (
    <PermissionGate
      permission={permission}
      fallback={<Navigate to="/" replace />}
    >
      {children}
    </PermissionGate>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />

          <Route
            path="/organizations"
            element={
              <ProtectedPage permission="organizations:manage">
                <Organizations />
              </ProtectedPage>
            }
          />

          <Route
            path="/users"
            element={
              <ProtectedPage permission="users:read">
                <Users />
              </ProtectedPage>
            }
          />

          <Route
            path="/employees"
            element={
              <ProtectedPage permission="employees:read">
                <Employees />
              </ProtectedPage>
            }
          />

          <Route
            path="/documents"
            element={
              <ProtectedPage permission="documents:read">
                <Documents />
              </ProtectedPage>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedPage permission="tasks:read">
                <Tasks />
              </ProtectedPage>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}