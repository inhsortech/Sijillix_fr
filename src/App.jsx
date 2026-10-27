import { useEffect } from "react";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Spin, Result, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { restoreSession, sessionAbsent } from "./features/auth/authSlice";
import AppLayout from "./components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Documents from "./pages/Documents";
import Tasks from "./pages/Tasks";
function ProtectedRoute() { const { isAuthenticated, initialized } = useSelector(s => s.auth); if (!initialized) return <div className="loading-page"><Spin size="large" /></div>; return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />; }
function NotFound() { return <Result status="404" title="Page not found" extra={<Button type="primary" href="/">Back to dashboard</Button>} />; }
export default function App() { const dispatch = useDispatch(); const hasToken = Boolean(localStorage.getItem("token")); const initialized = useSelector(s => s.auth.initialized); useEffect(() => { if (hasToken) dispatch(restoreSession()); else if (!initialized) dispatch(sessionAbsent()); }, [dispatch, hasToken, initialized]); return <Routes><Route path="/login" element={<Login />} /><Route element={<ProtectedRoute />}><Route element={<AppLayout />}><Route index element={<Dashboard />} /><Route path="/employees" element={<Employees />} /><Route path="/documents" element={<Documents />} /><Route path="/tasks" element={<Tasks />} /></Route></Route><Route path="*" element={<NotFound />} /></Routes>; }
