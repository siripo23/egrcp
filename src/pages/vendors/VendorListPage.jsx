import React, { useEffect, useCallback } from 'react'
import { Box, Grid, Card, CardContent, Typography, TextField, MenuItem, InputAdornment, Chip, Button, LinearProgress, Avatar } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchVendors, setVendorFilters } from '../../store/slices/vendorSlice'
import SectionHeader from '../../components/common/SectionHeader'
import StatusChip from '../../components/common/StatusChip'
import KpiCard from '../../components/common/KpiCard'
import SearchIcon from '@mui/icons-material/Search'
import StoreIcon from '@mui/icons-material/Store'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import CertificateIcon from '@mui/icons-material/VerifiedUser'

const riskColors = { low: 'success', medium: 'warning', high: 'error' }

function VendorCard({ vendor, onClick }) {
  return (
    <Card sx={{ cursor: 'pointer', transition: 'box-shadow 0.2s', '&:hover': { boxShadow: 4 } }} onClick={onClick}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
          <Box display="flex" gap={1.5} alignItems="center">
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.light', color: 'primary.main', fontSize: 15, fontWeight: 700 }}>
              {vendor.name.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600}>{vendor.name}</Typography>
              <Typography variant="caption" color="text.secondary">{vendor.category} · {vendor.country}</Typography>
            </Box>
          </Box>
          <StatusChip status={vendor.status} />
        </Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography variant="caption" color="text.secondary">Risk Level</Typography>
          <Chip label={vendor.riskLevel} size="small" color={riskColors[vendor.riskLevel]} sx={{ fontWeight: 600, fontSize: '0.72rem' }} />
        </Box>
        <Box mb={1}>
          <Box display="flex" justifyContent="space-between" mb={0.5}>
            <Typography variant="caption" color="text.secondary">Compliance Score</Typography>
            <Typography variant="caption" fontWeight={600} color={vendor.complianceScore >= 80 ? 'success.main' : vendor.complianceScore >= 60 ? 'warning.main' : 'error.main'}>
              {vendor.complianceScore}%
            </Typography>
          </Box>
          <LinearProgress variant="determinate" value={vendor.complianceScore}
            color={vendor.complianceScore >= 80 ? 'success' : vendor.complianceScore >= 60 ? 'warning' : 'error'}
            sx={{ height: 6, borderRadius: 3 }} />
        </Box>
        <Typography variant="caption" color="text.secondary">
          Contract: <strong>${vendor.contractValue?.toLocaleString()}</strong>
        </Typography>
      </CardContent>
    </Card>
  )
}

function VendorListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { vendors, kpis, filters, loading } = useSelector(state => state.vendor)

  useEffect(() => { dispatch(fetchVendors(filters)) }, [dispatch, filters])

  const handleFilter = useCallback((key, val) => dispatch(setVendorFilters({ [key]: val })), [dispatch])

  return (
    <Box>
      <SectionHeader title="Vendor Governance" subtitle="Monitor and manage all vendor relationships" />

      {/* KPIs */}
      {kpis && (
        <Grid container spacing={2} mb={3}>
          <Grid item xs={6} sm={3}><KpiCard title="Total Vendors" value={kpis.total} icon={<StoreIcon sx={{ fontSize: 20 }} />} color="primary.main" /></Grid>
          <Grid item xs={6} sm={3}><KpiCard title="Active" value={kpis.active} icon={<CheckCircleIcon sx={{ fontSize: 20 }} />} color="success.main" /></Grid>
          <Grid item xs={6} sm={3}><KpiCard title="High Risk" value={kpis.highRisk} icon={<WarningIcon sx={{ fontSize: 20 }} />} color="error.main" /></Grid>
          <Grid item xs={6} sm={3}><KpiCard title="Expiring Certs" value={kpis.expiringCerts} icon={<CertificateIcon sx={{ fontSize: 20 }} />} color="warning.main" /></Grid>
        </Grid>
      )}

      {/* Filters */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap">
          <TextField size="small" placeholder="Search vendors..." value={filters.search} onChange={e => handleFilter('search', e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }} sx={{ flex: 1, minWidth: 200 }} />
          <TextField select size="small" label="Status" value={filters.status} onChange={e => handleFilter('status', e.target.value)} sx={{ minWidth: 130 }}>
            {['', 'active', 'inactive', 'under_review'].map(s => <MenuItem key={s} value={s}>{s || 'All Status'}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Risk Level" value={filters.riskLevel} onChange={e => handleFilter('riskLevel', e.target.value)} sx={{ minWidth: 130 }}>
            {['', 'low', 'medium', 'high'].map(r => <MenuItem key={r} value={r}>{r || 'All Risk'}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      {/* Vendor Grid */}
      <Grid container spacing={2}>
        {loading ? <Grid item xs={12}><Typography color="text.secondary" align="center" py={4}>Loading vendors...</Typography></Grid>
          : vendors.length === 0 ? <Grid item xs={12}><Typography color="text.secondary" align="center" py={4}>No vendors found</Typography></Grid>
          : vendors.map(v => (
            <Grid item xs={12} sm={6} lg={4} key={v.id}>
              <VendorCard vendor={v} onClick={() => navigate(`/vendors/${v.id}`)} />
            </Grid>
          ))
        }
      </Grid>
    </Box>
  )
}

export default VendorListPage
