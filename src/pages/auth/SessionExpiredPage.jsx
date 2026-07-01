import React from 'react'
import { Box, Card, CardContent, Button, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { clearAuth } from '../../store/slices/authSlice'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

function SessionExpiredPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogin = () => { dispatch(clearAuth()); navigate('/login') }
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default', p: 2 }}>
      <Card sx={{ maxWidth: 440, width: '100%' }}>
        <CardContent sx={{ p: 5, textAlign: 'center' }}>
          <AccessTimeIcon sx={{ fontSize: 64, color: 'warning.main', mb: 2 }} />
          <Typography variant="h5" fontWeight={700} mb={1}>Session Expired</Typography>
          <Typography variant="body2" color="text.secondary" mb={4}>Your session has expired due to inactivity. Please sign in again to continue.</Typography>
          <Button variant="contained" size="large" onClick={handleLogin} fullWidth>Sign In Again</Button>
        </CardContent>
      </Card>
    </Box>
  )
}
export default SessionExpiredPage
