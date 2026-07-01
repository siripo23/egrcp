import React from 'react'
import { Chip } from '@mui/material'

const statusConfig = {
  pending:      { label: 'Pending',       color: 'warning' },
  approved:     { label: 'Approved',      color: 'success' },
  rejected:     { label: 'Rejected',      color: 'error'   },
  under_review: { label: 'Under Review',  color: 'info'    },
  escalated:    { label: 'Escalated',     color: 'error'   },
  active:       { label: 'Active',        color: 'success' },
  inactive:     { label: 'Inactive',      color: 'default' },
  under_review_vendor: { label: 'Under Review', color: 'warning' },
  low:          { label: 'Low',           color: 'success' },
  medium:       { label: 'Medium',        color: 'warning' },
  high:         { label: 'High',          color: 'error'   },
  open:         { label: 'Open',          color: 'error'   },
  mitigated:    { label: 'Mitigated',     color: 'success' },
  accepted:     { label: 'Accepted',      color: 'info'    },
  valid:        { label: 'Valid',         color: 'success' },
  expiring:     { label: 'Expiring Soon', color: 'warning' },
  expired:      { label: 'Expired',       color: 'error'   },
  missing:      { label: 'Missing',       color: 'error'   },
}

function StatusChip({ status, size = 'small' }) {
  const config = statusConfig[status] || { label: status, color: 'default' }
  return <Chip label={config.label} color={config.color} size={size} sx={{ fontWeight: 500 }} />
}

export default StatusChip
