import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Grid, Tabs, Tab, Button, Chip, Avatar, LinearProgress, CircularProgress, Divider } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchVendorById } from '../../store/slices/vendorSlice'
import SectionHeader from '../../components/common/SectionHeader'
import StatusChip from '../../components/common/StatusChip'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

function TabPanel({ value, index, children }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

function VendorDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedVendor: vendor, loading } = useSelector(state => state.vendor)
  const [tab, setTab] = useState(0)

  useEffect(() => { dispatch(fetchVendorById(id)) }, [dispatch, id])

  if (loading || !vendor) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <Box mb={2}><Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/vendors')} size="small">Back to Vendors</Button></Box>
      <SectionHeader title={vendor.name} subtitle={`${vendor.category} · ${vendor.country}`}
        action={<StatusChip status={vendor.status} />} />

      {/* Profile Header */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" gap={3} alignItems="center" flexWrap="wrap">
            <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.main', fontSize: 26, fontWeight: 700 }}>{vendor.name.charAt(0)}</Avatar>
            <Box flex={1}>
              <Grid container spacing={2}>
                {[
                  ['Category', vendor.category], ['Country', vendor.country],
                  ['Contract Value', `$${vendor.contractValue?.toLocaleString()}`],
                  ['Cert. Expiry', vendor.certificationExpiry],
                ].map(([label, value]) => (
                  <Grid item xs={6} sm={3} key={label}>
                    <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>{label}</Typography>
                    <Typography variant="body2" fontWeight={500} mt={0.25}>{value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Box>
            <Box textAlign="center">
              <Typography variant="caption" color="text.secondary">Compliance Score</Typography>
              <Typography variant="h4" fontWeight={700} color={vendor.complianceScore >= 80 ? 'success.main' : vendor.complianceScore >= 60 ? 'warning.main' : 'error.main'}>
                {vendor.complianceScore}%
              </Typography>
              <LinearProgress variant="determinate" value={vendor.complianceScore}
                color={vendor.complianceScore >= 80 ? 'success' : vendor.complianceScore >= 60 ? 'warning' : 'error'}
                sx={{ height: 8, borderRadius: 4, width: 100, mt: 0.5 }} />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          <Tab label="Basic Details" />
          <Tab label="Contacts" />
          <Tab label={`Documents (${vendor.documents?.length || 0})`} />
          <Tab label="Risk Information" />
          <Tab label="History" />
        </Tabs>
        <CardContent>
          <TabPanel value={tab} index={0}>
            <Grid container spacing={2}>
              {[['Name', vendor.name], ['Category', vendor.category], ['Country', vendor.country],
                ['Status', <StatusChip status={vendor.status} />], ['Risk Level', <Chip label={vendor.riskLevel} size="small" color={vendor.riskLevel === 'high' ? 'error' : vendor.riskLevel === 'medium' ? 'warning' : 'success'} />],
                ['Onboarded', new Date(vendor.onboardedAt).toLocaleDateString()]
              ].map(([label, value]) => (
                <Grid item xs={12} sm={4} key={label}>
                  <Typography variant="caption" color="text.secondary" textTransform="uppercase">{label}</Typography>
                  <Box mt={0.5}>{typeof value === 'string' ? <Typography variant="body2" fontWeight={500}>{value}</Typography> : value}</Box>
                </Grid>
              ))}
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box display="flex" gap={2} p={2} border="1px solid" borderColor="divider" borderRadius={1} alignItems="center">
              <Avatar sx={{ bgcolor: 'secondary.main' }}>{vendor.contact?.name?.charAt(0)}</Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600}>{vendor.contact?.name}</Typography>
                <Box display="flex" gap={2} mt={0.5}>
                  <Box display="flex" alignItems="center" gap={0.5}><EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} /><Typography variant="caption">{vendor.contact?.email}</Typography></Box>
                  <Box display="flex" alignItems="center" gap={0.5}><PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} /><Typography variant="caption">{vendor.contact?.phone}</Typography></Box>
                </Box>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {vendor.documents?.map(doc => (
              <Box key={doc.id} display="flex" justifyContent="space-between" alignItems="center" p={1.5} border="1px solid" borderColor="divider" borderRadius={1} mb={1}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>{doc.name}</Typography>
                  {doc.expiry && <Typography variant="caption" color="text.secondary">Expires: {doc.expiry}</Typography>}
                </Box>
                <StatusChip status={doc.status} />
              </Box>
            ))}
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Risk Level</Typography>
                <Box mt={0.5}><Chip label={vendor.riskLevel} color={vendor.riskLevel === 'high' ? 'error' : vendor.riskLevel === 'medium' ? 'warning' : 'success'} /></Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Typography variant="caption" color="text.secondary">Compliance Score</Typography>
                <Typography variant="h5" fontWeight={700} mt={0.5} color={vendor.complianceScore >= 80 ? 'success.main' : vendor.complianceScore >= 60 ? 'warning.main' : 'error.main'}>{vendor.complianceScore}%</Typography>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tab} index={4}>
            {vendor.history?.map((h, i) => (
              <Box key={i} display="flex" gap={2} py={1.5} borderBottom="1px solid" borderColor="divider">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.75, flexShrink: 0 }} />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>{h.event}</Typography>
                  <Typography variant="caption" color="text.secondary">{h.user} · {h.date}</Typography>
                </Box>
              </Box>
            ))}
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default VendorDetailPage
