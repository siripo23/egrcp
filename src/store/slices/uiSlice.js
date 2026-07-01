import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    themeMode: 'light',
    sidebarOpen: true,
    sidebarCollapsed: false,
    globalLoading: false,
    snackbar: { open: false, message: '', severity: 'info' },
  },
  reducers: {
    toggleTheme: (state) => { state.themeMode = state.themeMode === 'light' ? 'dark' : 'light' },
    setTheme: (state, action) => { state.themeMode = action.payload },
    toggleSidebar: (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebarCollapsed: (state, action) => { state.sidebarCollapsed = action.payload },
    setGlobalLoading: (state, action) => { state.globalLoading = action.payload },
    showSnackbar: (state, action) => {
      state.snackbar = { open: true, message: action.payload.message, severity: action.payload.severity || 'info' }
    },
    hideSnackbar: (state) => { state.snackbar.open = false },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebarCollapsed, setGlobalLoading, showSnackbar, hideSnackbar } = uiSlice.actions
export default uiSlice.reducer
