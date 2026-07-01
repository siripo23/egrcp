import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as complianceService from '../../services/complianceService'

export const fetchComplianceData = createAsyncThunk('compliance/fetchData', async (_, { rejectWithValue }) => {
  try { return await complianceService.fetchComplianceData() } catch (e) { return rejectWithValue(e.message) }
})

const complianceSlice = createSlice({
  name: 'compliance',
  initialState: {
    violations: [],
    missingDocuments: [],
    expiredCertifications: [],
    complianceScore: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplianceData.pending, (state) => { state.loading = true })
      .addCase(fetchComplianceData.fulfilled, (state, action) => {
        state.loading = false
        state.violations = action.payload.violations
        state.missingDocuments = action.payload.missingDocuments
        state.expiredCertifications = action.payload.expiredCertifications
        state.complianceScore = action.payload.complianceScore
      })
      .addCase(fetchComplianceData.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export default complianceSlice.reducer
