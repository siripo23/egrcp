import React from 'react'
import { Card, CardContent, Box, Typography, Avatar } from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

function KpiCard({ title, value, subtitle, icon, color = 'primary.main', trend, trendValue }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box flex={1}>
            <Typography variant="caption" color="text.secondary" fontWeight={500} textTransform="uppercase" letterSpacing={0.5}>
              {title}
            </Typography>
            <Typography variant="h4" fontWeight={700} mt={0.5} color="text.primary">
              {value}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.secondary" mt={0.5} display="block">{subtitle}</Typography>
            )}
            {trendValue !== undefined && (
              <Box display="flex" alignItems="center" gap={0.5} mt={1}>
                {trend === 'up' ? <TrendingUpIcon sx={{ fontSize: 16, color: 'success.main' }} /> : <TrendingDownIcon sx={{ fontSize: 16, color: 'error.main' }} />}
                <Typography variant="caption" color={trend === 'up' ? 'success.main' : 'error.main'} fontWeight={500}>
                  {trendValue}
                </Typography>
              </Box>
            )}
          </Box>
          <Avatar sx={{ bgcolor: color, width: 44, height: 44, ml: 2 }}>{icon}</Avatar>
        </Box>
      </CardContent>
    </Card>
  )
}

export default React.memo(KpiCard)
