
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Fetch employees
export const fetchEmployees = createAsyncThunk(
  "employees/fetch",
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/employees", { params });
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch employees"
      );
    }
  }
);

// Add employee
export const createEmployee = createAsyncThunk(
  "employees/createEmployee",
  async (employeeData, { rejectWithValue }) => {
    console.log(employeeData);
    
    try {
      const response = await api.post(
        "/employees",
        employeeData
      );

      return response.data.employee;

    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to add employee"
      );
    }
  }
);

// Update employee
export const updateEmployee = createAsyncThunk(
  "employees/update",
  async ({ id, employeeData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(
        `/employees/${id}`,
        employeeData
      );
      return data.employee;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update employee"
      );
    }
  }
);

// Delete employee
export const deleteEmployee = createAsyncThunk(
  "employees/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete employee"
      );
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",

  initialState: {
    items: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    saving: false,
    error: null,
  },

  reducers: {
    clearEmployeeError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.employees || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createEmployee.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.saving = false;
        state.items.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateEmployee.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.saving = false;
        state.items = state.items.map((item) =>
          item._id === action.payload._id ? action.payload : item
        );
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => item._id !== action.payload
        );
        state.total = Math.max(0, state.total - 1);
      });
  },
});

export const { clearEmployeeError } = employeeSlice.actions;

export default employeeSlice.reducer;
