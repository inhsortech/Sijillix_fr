import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
export const fetchDashboard = createAsyncThunk("dashboard/fetch", async (_, { rejectWithValue }) => { try { const { data } = await api.get("/dashboard"); return data; } catch (error) { return rejectWithValue(error.response?.data?.message || "Unable to load dashboard"); } });
const slice = createSlice({ name: "dashboard", initialState: { data: null, loading: false, error: null }, reducers: {}, extraReducers: b => { b.addCase(fetchDashboard.pending, s => { s.loading = true; s.error = null; }).addCase(fetchDashboard.fulfilled, (s,a) => { s.loading = false; s.data = a.payload; }).addCase(fetchDashboard.rejected, (s,a) => { s.loading = false; s.error = a.payload; }); } });
export default slice.reducer;
