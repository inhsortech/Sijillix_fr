
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";

// Get user from localStorage
const getStoredUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Invalid stored user:", error);
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

      if (!data.token) {
        return rejectWithValue("Token not received from server");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        token: data.token,
        user: data.user,
      };
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
console.log(token);

    if (!token) {
      return rejectWithValue({
        message: "No active session",
        unauthorized: true,
      });
    }

    try {
      const { data } = await api.get("/auth/me");
console.log(data);

      if (!data.user) {
        throw new Error("User information not received");
      }

      localStorage.setItem("user", JSON.stringify(data.user));

      return {
        user: data.user,
        token,
      };
    } catch (error) {
      const status = error.response?.status;

      // Clear session ONLY when token is rejected
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return rejectWithValue({
          message: "Session expired. Please login again.",
          unauthorized: true,
        });
      }

      // Network error, timeout, or server error:
      // Keep the existing token and user.
      return rejectWithValue({
        message: error.message || "Unable to restore session",
        unauthorized: false,
      });
    }
  }
);

// INITIAL STATE
const initialState = {
  user: getStoredUser(),
  token: localStorage.getItem("token"),
  loading: false,
  initialized: false,
  error: null,
  isAuthenticated: Boolean(localStorage.getItem("token")),
};

// AUTH SLICE
const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      state.loading = false;
      state.error = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    clearAuthError: (state) => {
      state.error = null;
    },

    sessionAbsent: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.initialized = true;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // LOGIN PENDING
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      // LOGIN SUCCESS
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })

      // LOGIN FAILED
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // RESTORE SUCCESS
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.initialized = true;
        state.error = null;
      })

      // RESTORE FAILED
      .addCase(restoreSession.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;

        if (action.payload?.unauthorized) {
          state.user = null;
          state.token = null;
          state.isAuthenticated = false;
        } else {
          // Preserve existing session on server/network errors
          state.isAuthenticated = Boolean(state.token);
        }

        state.error = action.payload?.message || null;
      });
  },
});

export const {
  logout,
  clearAuthError,
  sessionAbsent,
} = authSlice.actions;

export default authSlice.reducer;
