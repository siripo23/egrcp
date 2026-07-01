import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2} bgcolor="background.default">
      <Typography variant="h1" fontWeight={800} color="primary.main" sx={{ fontSize: '6rem', lineHeight: 1 }}>404</Typography>
      <Typography variant="h5" fontWeight={600}>Page Not Found</Typography>
      <Typography variant="body2" color="text.secondary">The page you're looking for doesn't exist or has been moved.</Typography>
      <Button variant="contained" onClick={() => navigate('/dashboard')} sx={{ mt: 1 }}>Go to Dashboard</Button>
    </Box>
  )
}
export default NotFoundPage
