import React, { useEffect, useCallback } from 'react'
import { Box, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, MenuItem, InputAdornment, Button, Typography, Chip, IconButton, Tooltip } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchRequests, setFilters, setPage, setPageSize } from '../../store/slices/procurementSlice'
import SectionHeader from '../../components/common/SectionHeader'
import StatusChip from '../../components/common/StatusChip'
import SearchIcon from '@mui/icons-material/Search'
import AddIcon from '@mui/icons-material/Add'
import VisibilityIcon from '@mui/icons-material/Visibility'
import FilterListIcon from '@mui/icons-material/FilterList'

const statusOptions = ['', 'pending', 'approved', 'rejected', 'under_review', 'escalated']
const priorityOptions = ['', 'high', 'medium', 'low']

function ProcurementListPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { requests, total, page, pageSize, filters, loading } = useSelector(state => state.procurement)

  useEffect(() => { dispatch(fetchRequests(filters)) }, [dispatch, filters])

  const handleFilterChange = useCallback((key, value) => {
    dispatch(setFilters({ [key]: value }))
    dispatch(setPage(0))
  }, [dispatch])

  return (
    <Box>
      <SectionHeader
        title="Procurement Workspace"
        subtitle={`${total} requests found`}
        action={<Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/procurement/new')}>New Request</Button>}
      />

      {/* Filters */}
      <Card sx={{ mb: 2, p: 2 }}>
        <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
          <TextField size="small" placeholder="Search requests..." value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
            sx={{ flex: 1, minWidth: 200 }} />
          <TextField select size="small" label="Status" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)} sx={{ minWidth: 140 }}>
            {statusOptions.map(s => <MenuItem key={s} value={s}>{s || 'All Status'}</MenuItem>)}
          </TextField>
          <TextField select size="small" label="Priority" value={filters.priority} onChange={e => handleFilterChange('priority', e.target.value)} sx={{ minWidth: 130 }}>
            {priorityOptions.map(p => <MenuItem key={p} value={p}>{p || 'All Priority'}</MenuItem>)}
          </TextField>
        </Box>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Vendor</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">Loading...</Typography></TableCell></TableRow>
              ) : requests.length === 0 ? (
                <TableRow><TableCell colSpan={9} align="center" sx={{ py: 4 }}><Typography color="text.secondary">No requests found</Typography></TableCell></TableRow>
              ) : requests.slice(page * pageSize, page * pageSize + pageSize).map(req => (
                <TableRow key={req.id} hover sx={{ cursor: 'pointer' }} onClick={() => navigate(`/procurement/${req.id}`)}>
                  <TableCell><Typography variant="body2" fontWeight={500} color="primary.main">{req.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={500}>{req.title}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{req.department}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary">{req.vendor}</Typography></TableCell>
                  <TableCell><Typography variant="body2" fontWeight={500}>${req.amount?.toLocaleString()}</Typography></TableCell>
                  <TableCell>
                    <Chip label={req.priority} size="small" color={req.priority === 'high' ? 'error' : req.priority === 'medium' ? 'warning' : 'default'} sx={{ fontWeight: 500, fontSize: '0.72rem' }} />
                  </TableCell>
                  <TableCell><StatusChip status={req.status} /></TableCell>
                  <TableCell><Typography variant="caption" color="text.secondary">{new Date(req.createdAt).toLocaleDateString()}</Typography></TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Details">
                      <IconButton size="small" color="primary" onClick={e => { e.stopPropagation(); navigate(`/procurement/${req.id}`) }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={total} page={page} rowsPerPage={pageSize}
          onPageChange={(_, p) => dispatch(setPage(p))}
          onRowsPerPageChange={e => { dispatch(setPageSize(parseInt(e.target.value, 10))); dispatch(setPage(0)) }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </Box>
  )
}

export default ProcurementListPage
