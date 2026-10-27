import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import employeeReducer from "../features/employees/employeeSlice";
export const store = configureStore({ reducer: { auth: authReducer, dashboard: dashboardReducer, employees: employeeReducer } });
