import React, { useEffect } from 'react'
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert, InputAdornment, IconButton } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { loginUser, clearError } from '../../store/slices/authSlice'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

function LoginPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, isAuthenticated } = useSelector(state => state.auth)
  const [showPassword, setShowPassword] = React.useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => { if (isAuthenticated) navigate('/dashboard', { replace: true }) }, [isAuthenticated, navigate])
  useEffect(() => { return () => dispatch(clearError()) }, [dispatch])

  const onSubmit = (data) => dispatch(loginUser(data))

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box textAlign="center" mb={4}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LockOutlinedIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>Welcome to e-GRCP</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>Enterprise Governance, Risk, Compliance & Procurement</Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight={600} mb={0.5}>Sign in to your account</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>Enter your credentials to continue</Typography>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
              <TextField fullWidth label="Email Address" type="email" {...register('email')}
                error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 2 }} autoComplete="email" autoFocus />
              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} {...register('password')}
                error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 1 }}
                InputProps={{ endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setShowPassword(v => !v)} edge="end">
                      {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                )}} />

              <Box textAlign="right" mb={3}>
                <Link component={RouterLink} to="/forgot-password" variant="caption" underline="hover">Forgot password?</Link>
              </Box>

              <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Box>

            <Box mt={3} p={2} bgcolor="action.hover" borderRadius={1}>
              <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>Demo Credentials</Typography>
              <Typography variant="caption" color="text.secondary" display="block">Admin: alice.johnson@company.com / Admin@123</Typography>
              <Typography variant="caption" color="text.secondary" display="block">Manager: bob.smith@company.com / Manager@123</Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default LoginPage
