import React, { useEffect, useState } from 'react'
import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Tab, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReports } from '../../store/slices/reportSlice'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line, AreaChart, Area } from 'recharts'
import SectionHeader from '../../components/common/SectionHeader'
import DownloadIcon from '@mui/icons-material/Download'
import SaveIcon from '@mui/icons-material/Save'

function TabPanel({ value, index, children }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

function ReportingCenterPage() {
  const dispatch = useDispatch()
  const { procurementData, complianceData, savedReports, loading } = useSelector(state => state.report)
  const [tab, setTab] = useState(0)

  useEffect(() => { dispatch(fetchReports()) }, [dispatch])

  const handleExportCSV = (data, filename) => {
    if (!data || data.length === 0) return
    const keys = Object.keys(data[0])
    const csv = [keys.join(','), ...data.map(row => keys.map(k => row[k]).join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `${filename}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  if (loading && !procurementData) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <SectionHeader title="Reporting Center" subtitle="Generate and export business intelligence reports"
        action={<Button variant="outlined" startIcon={<DownloadIcon />} onClick={() => handleExportCSV(procurementData?.monthly, 'procurement-report')}>Export CSV</Button>}
      />

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          <Tab label="Procurement Report" />
          <Tab label="Compliance Report" />
          <Tab label="Saved Reports" />
        </Tabs>
        <CardContent>
          <TabPanel value={tab} index={0}>
            <Box display="flex" justifyContent="flex-end" mb={2} gap={1}>
              <Button size="small" startIcon={<DownloadIcon />} variant="outlined" onClick={() => handleExportCSV(procurementData?.monthly, 'procurement-monthly')}>Export Monthly</Button>
              <Button size="small" startIcon={<DownloadIcon />} variant="outlined" onClick={() => handleExportCSV(procurementData?.departmentSpend, 'department-spend')}>Export Dept. Spend</Button>
            </Box>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} lg={8}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Monthly Procurement Summary</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={procurementData?.monthly || []}>
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="approved" fill="#2E7D32" name="Approved" radius={[3,3,0,0]} />
                    <Bar dataKey="rejected" fill="#D32F2F" name="Rejected" radius={[3,3,0,0]} />
                    <Bar dataKey="pending" fill="#ED6C02" name="Pending" radius={[3,3,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
              <Grid item xs={12} lg={4}>
                <Typography variant="subtitle2" fontWeight={600} mb={1}>Department Spend ($)</Typography>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={procurementData?.departmentSpend || []} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="department" type="category" tick={{ fontSize: 11 }} width={80} />
                    <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                    <Bar dataKey="spend" fill="#0057B8" radius={[0,3,3,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Grid>
            </Grid>

            <Typography variant="subtitle2" fontWeight={600} mb={1}>Monthly Data Table</Typography>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>Month</TableCell><TableCell>Total</TableCell><TableCell>Approved</TableCell><TableCell>Rejected</TableCell><TableCell>Pending</TableCell><TableCell>Spend ($)</TableCell></TableRow></TableHead>
                <TableBody>
                  {procurementData?.monthly?.map(row => (
                    <TableRow key={row.month} hover>
                      <TableCell fontWeight={600}>{row.month}</TableCell>
                      <TableCell>{row.total}</TableCell>
                      <TableCell sx={{ color: 'success.main', fontWeight: 500 }}>{row.approved}</TableCell>
                      <TableCell sx={{ color: 'error.main', fontWeight: 500 }}>{row.rejected}</TableCell>
                      <TableCell sx={{ color: 'warning.main', fontWeight: 500 }}>{row.pending}</TableCell>
                      <TableCell fontWeight={500}>${row.spend?.toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Box display="flex" justifyContent="flex-end" mb={2}>
              <Button size="small" startIcon={<DownloadIcon />} variant="outlined" onClick={() => handleExportCSV(complianceData?.monthly, 'compliance-report')}>Export CSV</Button>
            </Box>
            <Typography variant="subtitle2" fontWeight={600} mb={1}>Compliance Trend</Typography>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={complianceData?.monthly || []}>
                <defs>
                  <linearGradient id="colorCompliant" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="compliant" stroke="#2E7D32" fill="url(#colorCompliant)" strokeWidth={2} name="Compliant %" />
                <Area type="monotone" dataKey="violations" stroke="#D32F2F" fill="transparent" strokeWidth={2} name="Violations" />
              </AreaChart>
            </ResponsiveContainer>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <TableContainer>
              <Table size="small">
                <TableHead><TableRow><TableCell>Report Name</TableCell><TableCell>Type</TableCell><TableCell>Created By</TableCell><TableCell>Date</TableCell><TableCell align="center">Actions</TableCell></TableRow></TableHead>
                <TableBody>
                  {savedReports?.map(r => (
                    <TableRow key={r.id} hover>
                      <TableCell><Typography variant="body2" fontWeight={500}>{r.name}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary" sx={{ textTransform: 'capitalize' }}>{r.type}</Typography></TableCell>
                      <TableCell><Typography variant="body2" color="text.secondary">{r.createdBy}</Typography></TableCell>
                      <TableCell><Typography variant="caption" color="text.secondary">{r.createdAt}</Typography></TableCell>
                      <TableCell align="center">
                        <Button size="small" startIcon={<DownloadIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: '0.75rem' }}>Download</Button>
                      </TableCell>
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

export default ReportingCenterPage
