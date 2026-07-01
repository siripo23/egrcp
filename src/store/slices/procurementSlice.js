import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as procurementService from '../../services/procurementService'

export const fetchRequests = createAsyncThunk('procurement/fetchRequests', async (params, { rejectWithValue }) => {
  try { return await procurementService.fetchRequests(params) } catch (e) { return rejectWithValue(e.message) }
})

export const fetchRequestById = createAsyncThunk('procurement/fetchRequestById', async (id, { rejectWithValue }) => {
  try { return await procurementService.fetchRequestById(id) } catch (e) { return rejectWithValue(e.message) }
})

export const createRequest = createAsyncThunk('procurement/createRequest', async (data, { rejectWithValue }) => {
  try { return await procurementService.createRequest(data) } catch (e) { return rejectWithValue(e.message) }
})

export const updateRequest = createAsyncThunk('procurement/updateRequest', async ({ id, data }, { rejectWithValue }) => {
  try { return await procurementService.updateRequest(id, data) } catch (e) { return rejectWithValue(e.message) }
})

export const approveRequest = createAsyncThunk('procurement/approveRequest', async ({ id, comment }, { rejectWithValue }) => {
  try { return await procurementService.approveRequest(id, comment) } catch (e) { return rejectWithValue(e.message) }
})

export const rejectRequest = createAsyncThunk('procurement/rejectRequest', async ({ id, comment }, { rejectWithValue }) => {
  try { return await procurementService.rejectRequest(id, comment) } catch (e) { return rejectWithValue(e.message) }
})

const procurementSlice = createSlice({
  name: 'procurement',
  initialState: {
    requests: [],
    selectedRequest: null,
    total: 0,
    page: 0,
    pageSize: 10,
    filters: { status: '', search: '', department: '', priority: '' },
    loading: false,
    detailLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setFilters: (state, action) => { state.filters = { ...state.filters, ...action.payload } },
    setPage: (state, action) => { state.page = action.payload },
    setPageSize: (state, action) => { state.pageSize = action.payload },
    clearSelectedRequest: (state) => { state.selectedRequest = null },
    clearMessages: (state) => { state.error = null; state.successMessage = null },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => { state.loading = true; state.error = null })
      .addCase(fetchRequests.fulfilled, (state, action) => { state.loading = false; state.requests = action.payload.requests; state.total = action.payload.total })
      .addCase(fetchRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload })
      .addCase(fetchRequestById.pending, (state) => { state.detailLoading = true })
      .addCase(fetchRequestById.fulfilled, (state, action) => { state.detailLoading = false; state.selectedRequest = action.payload })
      .addCase(fetchRequestById.rejected, (state, action) => { state.detailLoading = false; state.error = action.payload })
      .addCase(createRequest.fulfilled, (state, action) => { state.requests.unshift(action.payload); state.successMessage = 'Request created successfully' })
      .addCase(approveRequest.fulfilled, (state, action) => {
        const idx = state.requests.findIndex(r => r.id === action.payload.id)
        if (idx !== -1) state.requests[idx] = action.payload
        if (state.selectedRequest?.id === action.payload.id) state.selectedRequest = action.payload
        state.successMessage = 'Request approved'
      })
      .addCase(rejectRequest.fulfilled, (state, action) => {
        const idx = state.requests.findIndex(r => r.id === action.payload.id)
        if (idx !== -1) state.requests[idx] = action.payload
        if (state.selectedRequest?.id === action.payload.id) state.selectedRequest = action.payload
        state.successMessage = 'Request rejected'
      })
  },
})

export const { setFilters, setPage, setPageSize, clearSelectedRequest, clearMessages } = procurementSlice.actions
export default procurementSlice.reducer
