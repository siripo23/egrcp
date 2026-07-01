import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Grid, Tabs, Tab, Button, Chip, Divider, Avatar, CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRequestById, approveRequest, rejectRequest } from '../../store/slices/procurementSlice'
import { showSnackbar } from '../../store/slices/uiSlice'
import StatusChip from '../../components/common/StatusChip'
import SectionHeader from '../../components/common/SectionHeader'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import HistoryIcon from '@mui/icons-material/History'

function TabPanel({ value, index, children }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

function ProcurementDetailPage() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { selectedRequest: req, detailLoading } = useSelector(state => state.procurement)
  const user = useSelector(state => state.auth.user)
  const [tab, setTab] = useState(0)
  const [dialogType, setDialogType] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => { dispatch(fetchRequestById(id)) }, [dispatch, id])

  const handleAction = async () => {
    if (!comment.trim()) return
    const action = dialogType === 'approve' ? approveRequest : rejectRequest
    const result = await dispatch(action({ id, comment }))
    if (!result.error) {
      dispatch(showSnackbar({ message: dialogType === 'approve' ? 'Request approved successfully' : 'Request rejected', severity: dialogType === 'approve' ? 'success' : 'warning' }))
      setDialogType(null); setComment('')
    }
  }

  if (detailLoading || !req) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>
  )

  const canApprove = user?.role === 'manager' || user?.role === 'admin'

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/procurement')} size="small">Back</Button>
      </Box>

      <SectionHeader
        title={req.title}
        subtitle={`${req.id} · Created by ${req.requestedBy}`}
        action={
          canApprove && req.status === 'pending' ? (
            <Box display="flex" gap={1}>
              <Button variant="contained" color="success" startIcon={<CheckCircleIcon />} onClick={() => setDialogType('approve')}>Approve</Button>
              <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => setDialogType('reject')}>Reject</Button>
            </Box>
          ) : null
        }
      />

      {/* Overview Card */}
      <Card sx={{ mb: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            {[
              ['Request ID', req.id], ['Status', <StatusChip status={req.status} />],
              ['Department', req.department], ['Vendor', req.vendor],
              ['Amount', `$${req.amount?.toLocaleString()}`], ['Priority', <Chip label={req.priority} size="small" color={req.priority === 'high' ? 'error' : req.priority === 'medium' ? 'warning' : 'default'} />],
              ['Due Date', req.dueDate], ['Category', req.category],
            ].map(([label, value]) => (
              <Grid item xs={12} sm={6} md={3} key={label}>
                <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>{label}</Typography>
                <Box mt={0.5}>{typeof value === 'string' ? <Typography variant="body2" fontWeight={500}>{value}</Typography> : value}</Box>
              </Grid>
            ))}
            <Grid item xs={12}>
              <Typography variant="caption" color="text.secondary" textTransform="uppercase" letterSpacing={0.5}>Description</Typography>
              <Typography variant="body2" mt={0.5}>{req.description}</Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          <Tab label="Overview" />
          <Tab label={`Attachments (${req.attachments?.length || 0})`} icon={<AttachFileIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label={`Approval History (${req.approvalHistory?.length || 0})`} icon={<HistoryIcon sx={{ fontSize: 16 }} />} iconPosition="start" />
          <Tab label="Audit Logs" />
        </Tabs>

        <CardContent>
          <TabPanel value={tab} index={0}>
            <Typography variant="body2" color="text.secondary">Full details are shown in the header card above.</Typography>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {req.attachments?.length === 0 ? <Typography variant="body2" color="text.secondary">No attachments</Typography> :
              req.attachments?.map(a => (
                <Box key={a.id} display="flex" alignItems="center" gap={2} p={1.5} border="1px solid" borderColor="divider" borderRadius={1} mb={1}>
                  <AttachFileIcon color="primary" />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight={500}>{a.name}</Typography>
                    <Typography variant="caption" color="text.secondary">{a.size} · {new Date(a.uploadedAt).toLocaleDateString()}</Typography>
                  </Box>
                  <Button size="small" variant="outlined">Download</Button>
                </Box>
              ))
            }
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {req.approvalHistory?.length === 0 ? <Typography variant="body2" color="text.secondary">No approval history yet</Typography> :
              req.approvalHistory?.map(ap => (
                <Box key={ap.id} display="flex" gap={2} p={2} border="1px solid" borderColor="divider" borderRadius={1} mb={1}>
                  <Avatar sx={{ width: 36, height: 36, bgcolor: ap.action === 'Approved' ? 'success.main' : 'error.main', fontSize: 14 }}>
                    {ap.action === 'Approved' ? '✓' : '✗'}
                  </Avatar>
                  <Box flex={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" fontWeight={600}>{ap.user} <Typography component="span" variant="caption" color="text.secondary">({ap.role})</Typography></Typography>
                      <Typography variant="caption" color="text.secondary">{new Date(ap.timestamp).toLocaleString()}</Typography>
                    </Box>
                    <Chip label={ap.action} size="small" color={ap.action === 'Approved' ? 'success' : 'error'} sx={{ my: 0.5 }} />
                    {ap.comment && <Typography variant="body2" color="text.secondary" mt={0.5}>"{ap.comment}"</Typography>}
                  </Box>
                </Box>
              ))
            }
          </TabPanel>

          <TabPanel value={tab} index={3}>
            {req.auditLogs?.map(log => (
              <Box key={log.id} display="flex" gap={2} py={1} borderBottom="1px solid" borderColor="divider">
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main', mt: 0.75, flexShrink: 0 }} />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>{log.action}</Typography>
                  <Typography variant="caption" color="text.secondary">{log.user} · {new Date(log.timestamp).toLocaleString()}</Typography>
                </Box>
              </Box>
            ))}
          </TabPanel>
        </CardContent>
      </Card>

      {/* Action Dialog */}
      <Dialog open={!!dialogType} onClose={() => setDialogType(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogType === 'approve' ? 'Approve Request' : 'Reject Request'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} label="Comment (required)" value={comment} onChange={e => setComment(e.target.value)} sx={{ mt: 1 }} placeholder="Enter your comments..." />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => { setDialogType(null); setComment('') }}>Cancel</Button>
          <Button variant="contained" color={dialogType === 'approve' ? 'success' : 'error'} onClick={handleAction} disabled={!comment.trim()}>
            {dialogType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProcurementDetailPage
