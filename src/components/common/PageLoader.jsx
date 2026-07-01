import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

function PageLoader({ message = 'Loading...' }) {
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
      <CircularProgress size={40} thickness={4} />
      <Typography variant="body2" color="text.secondary">{message}</Typography>
    </Box>
  )
}

export default PageLoader
