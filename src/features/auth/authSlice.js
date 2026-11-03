import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/auth/login", credentials);

      if (!data.token || !data.user) {
        return rejectWithValue("Invalid login response");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);

// RESTORE SESSION
export const restoreSession = createAsyncThunk(
  "auth/restore",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");

    if (!token) {
      return rejectWithValue({
        unauthorized: true,
        message: "No session",
      });
    }

    try {
      const { data } = await api.get("/auth/me");

      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        user: data.user,
        token,
      };
    } catch (error) {
      const status = error.response?.status;

      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return rejectWithValue({
          unauthorized: true,
          message: "Session expired",
        });
      }

      return rejectWithValue({
        unauthorized: false,
        message: "Server unavailable. Try again.",
      });
    }
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState: {
    user: getStoredUser(),
    token: localStorage.getItem("token"),
    initialized: false,
    loading: false,
    isAuthenticated: Boolean(localStorage.getItem("token")),
    error: null,
  },

  reducers: {
    noSession: (state) => {
      state.initialized = true;
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
      })

      .addCase(restoreSession.rejected, (state, action) => {
        state.initialized = true;

        if (action.payload?.unauthorized) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        } else {
          state.isAuthenticated = Boolean(state.token);
        }
      });
  },
});

export const { noSession, logout, clearAuthError } = authSlice.actions;

export default authSlice.reducer;