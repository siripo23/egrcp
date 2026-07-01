import authReducer, { clearError, setSessionExpired, clearAuth } from '../store/slices/authSlice'

const initialState = {
  user: null, token: null, isAuthenticated: false,
  loading: false, error: null, sessionExpired: false,
}

describe('authSlice', () => {
  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: '@@INIT' })).toEqual(initialState)
  })

  it('should handle clearError', () => {
    const stateWithError = { ...initialState, error: 'Login failed' }
    expect(authReducer(stateWithError, clearError()).error).toBeNull()
  })

  it('should handle setSessionExpired', () => {
    const state = authReducer(initialState, setSessionExpired(true))
    expect(state.sessionExpired).toBe(true)
  })

  it('should handle clearAuth', () => {
    const loggedInState = { ...initialState, user: { id: 'u1', name: 'Alice' }, isAuthenticated: true, token: 'abc' }
    const state = authReducer(loggedInState, clearAuth())
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('should handle loginUser.pending', () => {
    const action = { type: 'auth/loginUser/pending' }
    const state = authReducer(initialState, action)
    expect(state.loading).toBe(true)
    expect(state.error).toBeNull()
  })

  it('should handle loginUser.fulfilled', () => {
    const action = { type: 'auth/loginUser/fulfilled', payload: { user: { id: 'u1', name: 'Alice' }, token: 'tok123' } }
    const state = authReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.isAuthenticated).toBe(true)
    expect(state.user.name).toBe('Alice')
    expect(state.token).toBe('tok123')
  })

  it('should handle loginUser.rejected', () => {
    const action = { type: 'auth/loginUser/rejected', payload: 'Invalid credentials' }
    const state = authReducer(initialState, action)
    expect(state.loading).toBe(false)
    expect(state.error).toBe('Invalid credentials')
    expect(state.isAuthenticated).toBe(false)
  })
})
