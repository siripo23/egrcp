import uiReducer, { toggleTheme, setTheme, toggleSidebar, showSnackbar, hideSnackbar, setSidebarCollapsed } from '../store/slices/uiSlice'

const initial = { themeMode: 'light', sidebarOpen: true, sidebarCollapsed: false, globalLoading: false, snackbar: { open: false, message: '', severity: 'info' } }

describe('uiSlice', () => {
  it('returns initial state', () => {
    expect(uiReducer(undefined, { type: '@@INIT' })).toEqual(initial)
  })

  it('toggles theme light -> dark', () => {
    expect(uiReducer(initial, toggleTheme()).themeMode).toBe('dark')
  })

  it('toggles theme dark -> light', () => {
    expect(uiReducer({ ...initial, themeMode: 'dark' }, toggleTheme()).themeMode).toBe('light')
  })

  it('sets theme directly', () => {
    expect(uiReducer(initial, setTheme('dark')).themeMode).toBe('dark')
  })

  it('toggles sidebar', () => {
    expect(uiReducer(initial, toggleSidebar()).sidebarOpen).toBe(false)
    expect(uiReducer({ ...initial, sidebarOpen: false }, toggleSidebar()).sidebarOpen).toBe(true)
  })

  it('collapses sidebar', () => {
    expect(uiReducer(initial, setSidebarCollapsed(true)).sidebarCollapsed).toBe(true)
  })

  it('shows snackbar', () => {
    const state = uiReducer(initial, showSnackbar({ message: 'Test message', severity: 'success' }))
    expect(state.snackbar.open).toBe(true)
    expect(state.snackbar.message).toBe('Test message')
    expect(state.snackbar.severity).toBe('success')
  })

  it('hides snackbar', () => {
    const withSnackbar = { ...initial, snackbar: { open: true, message: 'hello', severity: 'info' } }
    expect(uiReducer(withSnackbar, hideSnackbar()).snackbar.open).toBe(false)
  })
})
