import React, { useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRisks } from '../../store/slices/riskSlice'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import SectionHeader from '../../components/common/SectionHeader'
import KpiCard from '../../components/common/KpiCard'
import StatusChip from '../../components/common/StatusChip'
import SecurityIcon from '@mui/icons-material/Security'
import WarningIcon from '@mui/icons-material/Warning'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import PauseCircleIcon from '@mui/icons-material/PauseCircle'

const COLORS = ['#D32F2F', '#ED6C02', '#0057B8', '#2E7D32', '#7B1FA2', '#00796B']

const MATRIX_LABELS = { impact: ['', 'Negligible', 'Minor', 'Moderate', 'Major', 'Critical'], likelihood: ['', 'Rare', 'Unlikely', 'Possible', 'Likely', 'Almost Certain'] }

function RiskMatrixCell({ l, i, risks }) {
  const score = l * i
  const cellRisks = risks.filter(r => r.likelihood === l && r.impact === i)
  const bg = score >= 15 ? '#FFEBEE' : score >= 8 ? '#FFF3E0' : '#E8F5E9'
  const border = score >= 15 ? '#EF9A9A' : score >= 8 ? '#FFCC80' : '#A5D6A7'
  return (
    <Box sx={{ width: 70, height: 56, bgcolor: bg, border: `1px solid ${border}`, borderRadius: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 0.25 }}>
      <Typography variant="caption" fontWeight={700} color={score >= 15 ? 'error.main' : score >= 8 ? 'warning.main' : 'success.main'}>{score}</Typography>
      {cellRisks.length > 0 && <Chip label={cellRisks.length} size="small" color={score >= 15 ? 'error' : score >= 8 ? 'warning' : 'success'} sx={{ height: 16, fontSize: '0.65rem' }} />}
    </Box>
  )
}

function RiskCenterPage() {
  const dispatch = useDispatch()
  const { risks, trends, distribution, loading } = useSelector(state => state.risk)

  useEffect(() => { dispatch(fetchRisks()) }, [dispatch])

  if (loading && risks.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  const open = risks.filter(r => r.status === 'open').length
  const mitigated = risks.filter(r => r.status === 'mitigated').length
  const accepted = risks.filter(r => r.status === 'accepted').length
  const highRisk = risks.filter(r => r.score >= 15).length

  return (
    <Box>
      <SectionHeader title="Risk Center" subtitle="Monitor, assess and mitigate organizational risks" />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}><KpiCard title="Total Risks" value={risks.length} icon={<SecurityIcon sx={{ fontSize: 20 }} />} color="primary.main" /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="Open Risks" value={open} icon={<WarningIcon sx={{ fontSize: 20 }} />} color="error.main" /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="Mitigated" value={mitigated} icon={<CheckCircleIcon sx={{ fontSize: 20 }} />} color="success.main" /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="High Severity" value={highRisk} icon={<PauseCircleIcon sx={{ fontSize: 20 }} />} color="warning.main" /></Grid>
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Risk Heat Matrix</Typography>
              <Box sx={{ overflowX: 'auto' }}>
                <Box sx={{ display: 'inline-block', minWidth: 400 }}>
                  <Box display="flex" alignItems="flex-end" mb={0.5} pl={8}>
                    {[1,2,3,4,5].map(i => (
                      <Box key={i} width={70} textAlign="center">
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{MATRIX_LABELS.impact[i]}</Typography>
                      </Box>
                    ))}
                  </Box>
                  {[5,4,3,2,1].map(l => (
                    <Box key={l} display="flex" alignItems="center" gap={0.5} mb={0.5}>
                      <Box width={72} textAlign="right" pr={1}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{MATRIX_LABELS.likelihood[l]}</Typography>
                      </Box>
                      {[1,2,3,4,5].map(i => <RiskMatrixCell key={i} l={l} i={i} risks={risks} />)}
                    </Box>
                  ))}
                  <Box pl={8} mt={0.5}><Typography variant="caption" color="text.secondary">← Impact →</Typography></Box>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>By Category</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={distribution} cx="50%" cy="50%" outerRadius={70} dataKey="value" nameKey="name">
                    {distribution.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend iconSize={10} wrapperStyle={{ fontSize: '0.75rem' }} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Risk Trend</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={trends}>
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="open" stroke="#D32F2F" strokeWidth={2} dot={false} name="Open" />
                  <Line type="monotone" dataKey="mitigated" stroke="#2E7D32" strokeWidth={2} dot={false} name="Mitigated" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} mb={2}>Risk Register</Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Risk ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell align="center">Likelihood</TableCell>
                  <TableCell align="center">Impact</TableCell>
                  <TableCell align="center">Score</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Owner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {risks.map(risk => (
                  <TableRow key={risk.id} hover>
                    <TableCell><Typography variant="caption" fontWeight={600} color="primary.main">{risk.id}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{risk.title}</Typography></TableCell>
                    <TableCell><Typography variant="body2" color="text.secondary">{risk.category}</Typography></TableCell>
                    <TableCell align="center"><Chip label={risk.likelihood} size="small" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                    <TableCell align="center"><Chip label={risk.impact} size="small" variant="outlined" sx={{ fontWeight: 600 }} /></TableCell>
                    <TableCell align="center">
                      <Chip label={risk.score} size="small" color={risk.score >= 15 ? 'error' : risk.score >= 8 ? 'warning' : 'success'} sx={{ fontWeight: 700, minWidth: 36 }} />
                    </TableCell>
                    <TableCell><StatusChip status={risk.status} /></TableCell>
                    <TableCell><Typography variant="caption">{risk.owner}</Typography></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RiskCenterPage
