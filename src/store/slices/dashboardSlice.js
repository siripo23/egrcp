import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { fetchDashboardData as fetchDashboardApi } from '../../services/dashboardService'

export const fetchDashboardData = createAsyncThunk('dashboard/fetchData', async (_, { rejectWithValue }) => {
  try {
    return await fetchDashboardApi()
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    kpis: null,
    procurementTrend: [],
    riskTrend: [],
    complianceTrend: [],
    departmentSpend: [],
    activityTimeline: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false
        state.kpis = action.payload.kpis
        state.procurementTrend = action.payload.procurementTrend
        state.riskTrend = action.payload.riskTrend
        state.complianceTrend = action.payload.complianceTrend
        state.departmentSpend = action.payload.departmentSpend
        state.activityTimeline = action.payload.activityTimeline
      })
      .addCase(fetchDashboardData.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default dashboardSlice.reducer
