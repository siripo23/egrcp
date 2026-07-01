import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as reportService from '../../services/reportService'

export const fetchReports = createAsyncThunk('report/fetchReports', async (_, { rejectWithValue }) => {
  try { return await reportService.fetchReports() } catch (e) { return rejectWithValue(e.message) }
})

const reportSlice = createSlice({
  name: 'report',
  initialState: {
    procurementData: null,
    complianceData: null,
    savedReports: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => { state.loading = true })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false
        state.procurementData = action.payload.procurement
        state.complianceData = action.payload.compliance
        state.savedReports = action.payload.savedReports
      })
      .addCase(fetchReports.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default reportSlice.reducer
