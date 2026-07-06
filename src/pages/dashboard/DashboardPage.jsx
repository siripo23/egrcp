import React, { useEffect, useMemo } from 'react'
import { Grid, Box, Card, CardContent, Typography, Divider, Avatar, Chip, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'
import { fetchDashboardData } from '../../store/slices/dashboardSlice'
import KpiCard from '../../components/common/KpiCard'
import SectionHeader from '../../components/common/SectionHeader'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import StorefrontIcon from '@mui/icons-material/Storefront'
import SecurityIcon from '@mui/icons-material/Security'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'

const COLORS = ['#0057B8', '#00A0DC', '#2E7D32', '#ED6C02', '#D32F2F', '#7B1FA2']

function ActivityItem({ item }) {
  const colorMap = { procurement: 'primary.main', risk: 'error.main', approval: 'success.main', vendor: 'warning.main' }
  return (
    <Box display="flex" gap={1.5} py={1.25} borderBottom="1px solid" borderColor="divider">
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colorMap[item.type] || 'grey.400', mt: 0.75, flexShrink: 0 }} />
      <Box flex={1}>
        <Typography variant="body2" fontWeight={500}>{item.action}</Typography>
        <Typography variant="caption" color="text.secondary">{item.user} · {new Date(item.time).toLocaleDateString()}</Typography>
      </Box>
    </Box>
  )
}

function DashboardPage() {
  const dispatch = useDispatch()
  const { kpis, procurementTrend, riskTrend, departmentSpend, activityTimeline, loading } = useSelector(state => state.dashboard)

  useEffect(() => { dispatch(fetchDashboardData()) }, [dispatch])

  const kpiCards = useMemo(() => kpis ? [
    { title: 'Total Requests', value: kpis.totalRequests, icon: <ShoppingCartIcon sx={{ fontSize: 20 }} />, color: 'primary.main' },
    { title: 'Pending Approval', value: kpis.pendingRequests, icon: <HourglassEmptyIcon sx={{ fontSize: 20 }} />, color: 'warning.main', subtitle: `${kpis.escalatedRequests} escalated` },
    { title: 'Approved', value: kpis.approvedRequests, icon: <CheckCircleIcon sx={{ fontSize: 20 }} />, color: 'success.main' },
    { title: 'Rejected', value: kpis.rejectedRequests, icon: <CancelIcon sx={{ fontSize: 20 }} />, color: 'error.main' },
    { title: 'Total Vendors', value: kpis.totalVendors, icon: <StorefrontIcon sx={{ fontSize: 20 }} />, color: 'secondary.main', subtitle: `${kpis.activeVendors} active` },
    { title: 'Open Risks', value: kpis.openRisks, icon: <SecurityIcon sx={{ fontSize: 20 }} />, color: 'error.main', subtitle: `${kpis.highRisks} high severity` },
    { title: 'Compliance Issues', value: kpis.complianceIssues, icon: <WarningAmberIcon sx={{ fontSize: 20 }} />, color: 'warning.main' },
  ] : [], [kpis])

  if (loading && !kpis) return (
    <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
      <CircularProgress />
    </Box>
  )

  return (
    <Box>
      <SectionHeader title="Executive Dashboard" subtitle="Business overview and key performance indicators" />

      <Grid container spacing={2} mb={3}>
        {kpiCards.map((card, i) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
            <KpiCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Monthly Procurement Trend</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={procurementTrend}>
                  <defs>
                    <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0057B8" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0057B8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="approved" stroke="#2E7D32" fill="transparent" strokeWidth={2} name="Approved" />
                  <Area type="monotone" dataKey="pending" stroke="#ED6C02" fill="transparent" strokeWidth={2} name="Pending" />
                  <Area type="monotone" dataKey="rejected" stroke="#D32F2F" fill="transparent" strokeWidth={2} name="Rejected" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Risk Trend</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={riskTrend}>
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="open" fill="#D32F2F" name="Open" radius={[3,3,0,0]} />
                  <Bar dataKey="mitigated" fill="#2E7D32" name="Mitigated" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Department Spending</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={departmentSpend} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="spend" nameKey="department" paddingAngle={3}>
                    {departmentSpend.map((_, idx) => <Cell key={idx} fill={COLORS[idx % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={v => `$${v.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6} lg={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={1}>Recent Activity</Typography>
              <Typography variant="caption" color="text.secondary">Latest system events and actions</Typography>
              <Divider sx={{ my: 1.5 }} />
              {activityTimeline.map(item => <ActivityItem key={item.id} item={item} />)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage
