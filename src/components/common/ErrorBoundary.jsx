import React from 'react'
import { Box, Typography, Button, Paper } from '@mui/material'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="background.default" p={3}>
          <Paper elevation={0} sx={{ p: 6, maxWidth: 500, textAlign: 'center', border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
            <ErrorOutlineIcon sx={{ fontSize: 56, color: 'error.main', mb: 2 }} />
            <Typography variant="h5" fontWeight={600} mb={1}>Something went wrong</Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              An unexpected error occurred. Please refresh the page or contact support if the issue persists.
            </Typography>
            <Typography variant="caption" color="error.main" sx={{ display: 'block', mb: 3, fontFamily: 'monospace' }}>
              {this.state.error?.message}
            </Typography>
            <Button variant="contained" onClick={() => window.location.reload()}>Reload Page</Button>
          </Paper>
        </Box>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
