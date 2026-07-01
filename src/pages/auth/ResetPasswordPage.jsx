import React, { useState } from 'react'
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link as RouterLink, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../../services/authService'
import LockResetIcon from '@mui/icons-material/LockReset'

const schema = yup.object({
  password: yup.string().min(8, 'Minimum 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm your password'),
})

function ResetPasswordPage() {
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || 'mock-token'
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true); setError('')
    try { await resetPassword({ token, password: data.password }); setSuccess(true) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box textAlign="center" mb={4}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <LockResetIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>Set New Password</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {success ? (
              <Box textAlign="center">
                <Alert severity="success" sx={{ mb: 3 }}>Password reset successfully!</Alert>
                <Link component={RouterLink} to="/login" variant="body2">Sign In Now</Link>
              </Box>
            ) : (
              <>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <TextField fullWidth label="New Password" type="password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} sx={{ mb: 2 }} />
                  <TextField fullWidth label="Confirm Password" type="password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} sx={{ mb: 3 }} />
                  <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>{loading ? 'Resetting...' : 'Reset Password'}</Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
export default ResetPasswordPage
