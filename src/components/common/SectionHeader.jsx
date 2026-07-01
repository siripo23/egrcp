import React from 'react'
import { Box, Typography, Divider } from '@mui/material'

function SectionHeader({ title, subtitle, action }) {
  return (
    <Box mb={3}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Box>
          <Typography variant="h5" fontWeight={600}>{title}</Typography>
          {subtitle && <Typography variant="body2" color="text.secondary" mt={0.25}>{subtitle}</Typography>}
        </Box>
        {action && <Box>{action}</Box>}
      </Box>
      <Divider />
    </Box>
  )
}

export default SectionHeader
