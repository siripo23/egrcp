import requestsData from '../mocks/requests.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchAuditLogs = async () => {
  await delay(500)
  const logs = requestsData.flatMap(r => r.auditLogs || []).map(l => ({ ...l, requestId: l.id }))
  const userActivities = [
    { id: 'ua1', user: 'Alice Johnson', action: 'Logged in', timestamp: '2026-06-04T09:15:00Z', ip: '192.168.1.10' },
    { id: 'ua2', user: 'Bob Smith', action: 'Approved REQ-002', timestamp: '2026-05-18T14:00:00Z', ip: '192.168.1.11' },
    { id: 'ua3', user: 'Carol White', action: 'Created REQ-001', timestamp: '2026-06-01T09:00:00Z', ip: '192.168.1.12' },
    { id: 'ua4', user: 'David Brown', action: 'Generated audit report', timestamp: '2026-06-02T16:00:00Z', ip: '192.168.1.13' },
    { id: 'ua5', user: 'Emma Davis', action: 'Flagged compliance violation', timestamp: '2026-06-05T10:00:00Z', ip: '192.168.1.14' },
  ]
  const systemLogs = [
    { id: 'sl1', event: 'Scheduled backup completed', timestamp: '2026-06-05T02:00:00Z', level: 'info' },
    { id: 'sl2', event: 'REQ-005 auto-escalated after 30 days', timestamp: '2026-06-01T11:00:00Z', level: 'warning' },
    { id: 'sl3', event: 'Vendor certification expiry check ran', timestamp: '2026-06-01T08:00:00Z', level: 'info' },
    { id: 'sl4', event: 'Failed login attempt for unknown@company.com', timestamp: '2026-05-30T15:30:00Z', level: 'error' },
  ]
  return { logs, userActivities, systemLogs }
}
