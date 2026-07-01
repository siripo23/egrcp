import users from '../mocks/users.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const loginUser = async ({ email, password }) => {
  await delay(800)
  const user = users.find(u => u.email === email && u.password === password)
  if (!user) throw new Error('Invalid email or password')
  const { password: _pw, ...safeUser } = user
  return { user: safeUser, token: `mock-token-${safeUser.id}-${Date.now()}` }
}

export const logoutUser = async () => {
  await delay(200)
  return true
}

export const forgotPassword = async (email) => {
  await delay(600)
  const user = users.find(u => u.email === email)
  if (!user) throw new Error('No account found with that email address')
  return { message: 'Password reset link sent to your email' }
}

export const resetPassword = async ({ token, password }) => {
  await delay(600)
  if (!token) throw new Error('Invalid reset token')
  return { message: 'Password reset successfully' }
}
