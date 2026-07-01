import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as vendorService from '../../services/vendorService'

export const fetchVendors = createAsyncThunk('vendor/fetchVendors', async (params, { rejectWithValue }) => {
  try { return await vendorService.fetchVendors(params) } catch (e) { return rejectWithValue(e.message) }
})

export const fetchVendorById = createAsyncThunk('vendor/fetchVendorById', async (id, { rejectWithValue }) => {
  try { return await vendorService.fetchVendorById(id) } catch (e) { return rejectWithValue(e.message) }
})

const vendorSlice = createSlice({
  name: 'vendor',
  initialState: {
    vendors: [],
    selectedVendor: null,
    kpis: null,
    filters: { status: '', riskLevel: '', category: '', search: '' },
    loading: false,
    error: null,
  },
  reducers: {
    setVendorFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    clearSelectedVendor: (state) => { state.selectedVendor = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchVendors.pending, (state) => { state.loading = true })
      .addCase(fetchVendors.fulfilled, (state, action) => {
        state.loading = false
        state.vendors = action.payload.vendors
        state.kpis = action.payload.kpis
      })
      .addCase(fetchVendors.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchVendorById.pending, (state) => { state.loading = true })
      .addCase(fetchVendorById.fulfilled, (state, action) => { state.loading = false; state.selectedVendor = action.payload })
      .addCase(fetchVendorById.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { setVendorFilters, clearSelectedVendor } = vendorSlice.actions
export default vendorSlice.reducer
