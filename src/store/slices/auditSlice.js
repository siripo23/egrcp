import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as auditService from '../../services/auditService'

export const fetchAuditLogs = createAsyncThunk('audit/fetchLogs', async (_, { rejectWithValue }) => {
  try { return await auditService.fetchAuditLogs() } catch (e) { return rejectWithValue(e.message) }
})

const auditSlice = createSlice({
  name: 'audit',
  initialState: {
    logs: [],
    userActivities: [],
    systemLogs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuditLogs.pending, (state) => { state.loading = true })
      .addCase(fetchAuditLogs.fulfilled, (state, action) => {
        state.loading = false
        state.logs = action.payload.logs
        state.userActivities = action.payload.userActivities
        state.systemLogs = action.payload.systemLogs
      })
      .addCase(fetchAuditLogs.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default auditSlice.reducer
