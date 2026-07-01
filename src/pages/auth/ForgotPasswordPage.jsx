import React, { useState } from 'react'
import { Box, Card, CardContent, TextField, Button, Typography, Link, Alert } from '@mui/material'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Link as RouterLink } from 'react-router-dom'
import { forgotPassword } from '../../services/authService'
import EmailIcon from '@mui/icons-material/Email'

const schema = yup.object({ email: yup.string().email('Enter a valid email').required('Email is required') })

function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  const onSubmit = async (data) => {
    setLoading(true); setError('')
    try { await forgotPassword(data.email); setSubmitted(true) } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box textAlign="center" mb={4}>
          <Box sx={{ width: 56, height: 56, borderRadius: 2, bgcolor: 'primary.main', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <EmailIcon sx={{ color: '#fff', fontSize: 28 }} />
          </Box>
          <Typography variant="h5" fontWeight={700}>Reset Password</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>We'll send a reset link to your email</Typography>
        </Box>
        <Card>
          <CardContent sx={{ p: 4 }}>
            {submitted ? (
              <Box textAlign="center">
                <Alert severity="success" sx={{ mb: 3 }}>Reset link sent! Check your inbox.</Alert>
                <Link component={RouterLink} to="/login" variant="body2">Back to Sign In</Link>
              </Box>
            ) : (
              <>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <TextField fullWidth label="Email Address" type="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} sx={{ mb: 3 }} autoFocus />
                  <Button fullWidth variant="contained" type="submit" size="large" disabled={loading}>{loading ? 'Sending...' : 'Send Reset Link'}</Button>
                </Box>
                <Box textAlign="center" mt={2}><Link component={RouterLink} to="/login" variant="body2">Back to Sign In</Link></Box>
              </>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}
export default ForgotPasswordPage
