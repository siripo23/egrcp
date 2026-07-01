import requests from '../mocks/requests.json'
import vendors from '../mocks/vendors.json'
import riskData from '../mocks/riskData.json'
import reports from '../mocks/reports.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchDashboardData = async () => {
  await delay(600)
  const kpis = {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    approvedRequests: requests.filter(r => r.status === 'approved').length,
    rejectedRequests: requests.filter(r => r.status === 'rejected').length,
    totalVendors: vendors.length,
    activeVendors: vendors.filter(v => v.status === 'active').length,
    highRisks: riskData.risks.filter(r => r.score >= 15).length,
    openRisks: riskData.risks.filter(r => r.status === 'open').length,
    complianceIssues: vendors.filter(v => v.complianceScore < 60).length,
    escalatedRequests: requests.filter(r => r.status === 'escalated').length,
  }

  const activityTimeline = [
    { id: 1, action: 'REQ-001 submitted', user: 'Carol White', time: '2026-06-05T09:00:00Z', type: 'procurement' },
    { id: 2, action: 'High risk alert: BuildRight Construction', user: 'System', time: '2026-06-05T07:00:00Z', type: 'risk' },
    { id: 3, action: 'REQ-003 sent back for revision', user: 'Bob Smith', time: '2026-06-02T09:00:00Z', type: 'approval' },
    { id: 4, action: 'REQ-002 approved', user: 'Bob Smith', time: '2026-05-18T14:00:00Z', type: 'approval' },
    { id: 5, action: 'Vendor FastFreight Co suspended', user: 'Bob Smith', time: '2026-01-05T10:00:00Z', type: 'vendor' },
  ]

  return {
    kpis,
    procurementTrend: reports.procurement.monthly,
    riskTrend: riskData.trends,
    complianceTrend: reports.compliance.monthly,
    departmentSpend: reports.procurement.departmentSpend,
    activityTimeline,
  }
}
