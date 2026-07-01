import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as riskService from '../../services/riskService'

export const fetchRisks = createAsyncThunk('risk/fetchRisks', async (_, { rejectWithValue }) => {
  try { return await riskService.fetchRisks() } catch (e) { return rejectWithValue(e.message) }
})

const riskSlice = createSlice({
  name: 'risk',
  initialState: {
    risks: [],
    trends: [],
    distribution: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRisks.pending, (state) => { state.loading = true })
      .addCase(fetchRisks.fulfilled, (state, action) => {
        state.loading = false
        state.risks = action.payload.risks
        state.trends = action.payload.trends
        state.distribution = action.payload.distribution
      })
      .addCase(fetchRisks.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default riskSlice.reducer
