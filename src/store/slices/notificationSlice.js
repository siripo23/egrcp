import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import * as notificationService from '../../services/notificationService'

export const fetchNotifications = createAsyncThunk('notification/fetchAll', async (_, { rejectWithValue }) => {
  try { return await notificationService.fetchNotifications() } catch (e) { return rejectWithValue(e.message) }
})

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    markAsRead: (state, action) => {
      const n = state.notifications.find(n => n.id === action.payload)
      if (n && !n.read) { n.read = true; state.unreadCount = Math.max(0, state.unreadCount - 1) }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => { n.read = true })
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.loading = true })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read).length
      })
      .addCase(fetchNotifications.rejected, (state, action) => { state.loading = false; state.error = action.payload })
  },
})

export const { markAsRead, markAllAsRead } = notificationSlice.actions
export default notificationSlice.reducer
