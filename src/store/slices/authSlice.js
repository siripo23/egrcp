import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { loginUser as loginUserApi, logoutUser as logoutUserApi } from '../../services/authService'

export const loginUser = createAsyncThunk('auth/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await loginUserApi(credentials)
    return response
  } catch (error) {
    return rejectWithValue(error.message || 'Login failed')
  }
})

export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutUserApi()
    return null
  } catch (error) {
    return rejectWithValue(error.message)
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null,
    sessionExpired: false,
  },
  reducers: {
    clearError: (state) => { state.error = null },
    setSessionExpired: (state, action) => { state.sessionExpired = action.payload },
    clearAuth: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.sessionExpired = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
        state.sessionExpired = false
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export const { clearError, setSessionExpired, clearAuth } = authSlice.actions
export default authSlice.reducer
