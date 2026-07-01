import { loginUser, logoutUser, forgotPassword } from '../services/authService'

describe('authService', () => {
  it('should login with valid credentials', async () => {
    const result = await loginUser({ email: 'alice.johnson@company.com', password: 'Admin@123' })
    expect(result.user).toBeDefined()
    expect(result.token).toBeDefined()
    expect(result.user.email).toBe('alice.johnson@company.com')
    expect(result.user.password).toBeUndefined()
  })

  it('should throw for invalid credentials', async () => {
    await expect(loginUser({ email: 'wrong@email.com', password: 'wrongpass' })).rejects.toThrow('Invalid email or password')
  })

  it('should throw for wrong password', async () => {
    await expect(loginUser({ email: 'alice.johnson@company.com', password: 'wrongpass' })).rejects.toThrow('Invalid email or password')
  })

  it('should logout successfully', async () => {
    const result = await logoutUser()
    expect(result).toBe(true)
  })

  it('should send reset link for valid email', async () => {
    const result = await forgotPassword('alice.johnson@company.com')
    expect(result.message).toContain('sent')
  })

  it('should throw for unknown email in forgotPassword', async () => {
    await expect(forgotPassword('unknown@email.com')).rejects.toThrow('No account found')
  })
})
