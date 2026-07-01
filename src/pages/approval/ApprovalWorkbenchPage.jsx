import React, { useEffect, useState, useCallback } from 'react'
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRequests, approveRequest, rejectRequest } from '../../store/slices/procurementSlice'
import { showSnackbar } from '../../store/slices/uiSlice'
import SectionHeader from '../../components/common/SectionHeader'
import StatusChip from '../../components/common/StatusChip'
import KpiCard from '../../components/common/KpiCard'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import ErrorIcon from '@mui/icons-material/Error'
import VisibilityIcon from '@mui/icons-material/Visibility'

const tabs = ['pending', 'approved', 'rejected', 'escalated']

function ApprovalWorkbenchPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { requests, loading } = useSelector(state => state.procurement)
  const user = useSelector(state => state.auth.user)
  const [tab, setTab] = useState(0)
  const [dialogType, setDialogType] = useState(null)
  const [selectedId, setSelectedId] = useState(null)
  const [comment, setComment] = useState('')

  useEffect(() => { dispatch(fetchRequests({})) }, [dispatch])

  const filtered = requests.filter(r => r.status === tabs[tab])

  const openDialog = useCallback((type, id) => { setDialogType(type); setSelectedId(id); setComment('') }, [])

  const handleAction = async () => {
    const action = dialogType === 'approve' ? approveRequest : rejectRequest
    const result = await dispatch(action({ id: selectedId, comment }))
    if (!result.error) {
      dispatch(showSnackbar({ message: dialogType === 'approve' ? 'Request approved' : 'Request rejected', severity: dialogType === 'approve' ? 'success' : 'warning' }))
      setDialogType(null)
    }
  }

  const counts = {
    pending: requests.filter(r => r.status === 'pending').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    escalated: requests.filter(r => r.status === 'escalated').length,
  }

  const canApprove = user?.role === 'manager' || user?.role === 'admin'

  return (
    <Box>
      <SectionHeader title="Approval Workbench" subtitle="Review and action procurement requests" />

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Box flex={1} minWidth={150}><KpiCard title="Pending" value={counts.pending} icon={<HourglassEmptyIcon sx={{ fontSize: 20 }} />} color="warning.main" /></Box>
        <Box flex={1} minWidth={150}><KpiCard title="Approved" value={counts.approved} icon={<CheckCircleIcon sx={{ fontSize: 20 }} />} color="success.main" /></Box>
        <Box flex={1} minWidth={150}><KpiCard title="Rejected" value={counts.rejected} icon={<CancelIcon sx={{ fontSize: 20 }} />} color="error.main" /></Box>
        <Box flex={1} minWidth={150}><KpiCard title="Escalated" value={counts.escalated} icon={<ErrorIcon sx={{ fontSize: 20 }} />} color="error.main" /></Box>
      </Box>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          {tabs.map((t, i) => (
            <Tab key={t} label={<Box display="flex" gap={1} alignItems="center" sx={{ textTransform: 'capitalize' }}>
              {t} <Chip label={counts[t]} size="small" color={t === 'pending' ? 'warning' : t === 'approved' ? 'success' : 'default'} sx={{ height: 18, fontSize: '0.7rem' }} />
            </Box>} />
          ))}
        </Tabs>
        <CardContent>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Requested By</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Date</TableCell>
                  {canApprove && tab === 0 && <TableCell align="center">Actions</TableCell>}
                  <TableCell align="center">View</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><CircularProgress size={24} /></TableCell></TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No {tabs[tab]} requests</Typography></TableCell></TableRow>
                ) : filtered.map(req => (
                  <TableRow key={req.id} hover>
                    <TableCell><Typography variant="caption" fontWeight={600} color="primary.main">{req.id}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={500}>{req.title}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{req.requestedBy}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{req.department}</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={500}>${req.amount?.toLocaleString()}</Typography></TableCell>
                    <TableCell><Chip label={req.priority} size="small" color={req.priority === 'high' ? 'error' : req.priority === 'medium' ? 'warning' : 'default'} sx={{ fontWeight: 500, fontSize: '0.7rem' }} /></TableCell>
                    <TableCell><Typography variant="caption" color="text.secondary">{new Date(req.createdAt).toLocaleDateString()}</Typography></TableCell>
                    {canApprove && tab === 0 && (
                      <TableCell align="center">
                        <Box display="flex" gap={0.5} justifyContent="center">
                          <Button size="small" variant="contained" color="success" onClick={() => openDialog('approve', req.id)} sx={{ minWidth: 70, fontSize: '0.75rem' }}>Approve</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => openDialog('reject', req.id)} sx={{ minWidth: 70, fontSize: '0.75rem' }}>Reject</Button>
                        </Box>
                      </TableCell>
                    )}
                    <TableCell align="center">
                      <Button size="small" startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />} onClick={() => navigate(`/procurement/${req.id}`)} sx={{ fontSize: '0.75rem' }}>View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={!!dialogType} onClose={() => setDialogType(null)} maxWidth="xs" fullWidth>
        <DialogTitle>{dialogType === 'approve' ? 'Approve Request' : 'Reject Request'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline rows={3} label="Comment (required)" value={comment} onChange={e => setComment(e.target.value)} sx={{ mt: 1 }} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogType(null)}>Cancel</Button>
          <Button variant="contained" color={dialogType === 'approve' ? 'success' : 'error'} onClick={handleAction} disabled={!comment.trim()}>
            {dialogType === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ApprovalWorkbenchPage
