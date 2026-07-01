import React, { useEffect, useState } from 'react'
import { Box, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, Chip, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAuditLogs } from '../../store/slices/auditSlice'
import SectionHeader from '../../components/common/SectionHeader'
import KpiCard from '../../components/common/KpiCard'
import AssignmentIcon from '@mui/icons-material/Assignment'
import PersonIcon from '@mui/icons-material/Person'
import ComputerIcon from '@mui/icons-material/Computer'

const levelColors = { info: 'info', warning: 'warning', error: 'error' }

function TabPanel({ value, index, children }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

function AuditCenterPage() {
  const dispatch = useDispatch()
  const { logs, userActivities, systemLogs, loading } = useSelector(state => state.audit)
  const [tab, setTab] = useState(0)

  useEffect(() => { dispatch(fetchAuditLogs()) }, [dispatch])

  if (loading && logs.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <SectionHeader title="Audit Center" subtitle="Complete audit trail, user activities and system logs" />

      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <Box flex={1} minWidth={180}><KpiCard title="Audit Events" value={logs.length} icon={<AssignmentIcon sx={{ fontSize: 20 }} />} color="primary.main" /></Box>
        <Box flex={1} minWidth={180}><KpiCard title="User Activities" value={userActivities.length} icon={<PersonIcon sx={{ fontSize: 20 }} />} color="secondary.main" /></Box>
        <Box flex={1} minWidth={180}><KpiCard title="System Logs" value={systemLogs.length} icon={<ComputerIcon sx={{ fontSize: 20 }} />} color="warning.main" /></Box>
      </Box>

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          <Tab label={`Audit History (${logs.length})`} />
          <Tab label={`User Activities (${userActivities.length})`} />
          <Tab label={`System Logs (${systemLogs.length})`} />
        </Tabs>
        <CardContent>
          <TabPanel value={tab} index={0}>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>Event</TableCell><TableCell>User</TableCell><TableCell>Timestamp</TableCell></TableRow></TableHead>
                <TableBody>
                  {logs.map(log => (
                    <TableRow key={log.id} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{log.action}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{log.user}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{new Date(log.timestamp).toLocaleString()}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>User</TableCell><TableCell>Action</TableCell><TableCell>IP Address</TableCell><TableCell>Timestamp</TableCell></TableRow></TableHead>
                <TableBody>
                  {userActivities.map(a => (
                    <TableRow key={a.id} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{a.user}</Typography></TableCell>
                      <TableCell><Typography variant="body2">{a.action}</Typography></TableCell>
                      <TableCell><Typography variant="caption" fontFamily="monospace">{a.ip}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{new Date(a.timestamp).toLocaleString()}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>Event</TableCell><TableCell>Level</TableCell><TableCell>Timestamp</TableCell></TableRow></TableHead>
                <TableBody>
                  {systemLogs.map(log => (
                    <TableRow key={log.id} hover>
                      <TableCell><Typography variant="body2">{log.event}</Typography></TableCell>
                      <TableCell><Chip label={log.level} size="small" color={levelColors[log.level] || 'default'} sx={{ fontWeight: 500, fontSize: '0.72rem' }} /></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{new Date(log.timestamp).toLocaleString()}</Typography></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AuditCenterPage
