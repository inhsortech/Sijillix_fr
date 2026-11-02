
import { Navigate, Route, Routes } from "react-router-dom";
import { Result, Button } from "antd";

import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
import ProtectedRoute from "./components/ProtectedRoute";

function NotFound() {
  return (
    <Result
      status="404"
      title="Page not found"
      extra={
        <Button type="primary" href="/">
          Back to dashboard
        </Button>
      }
    />
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/tasks" element={<Tasks />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
