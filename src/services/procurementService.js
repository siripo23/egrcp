import requestsData from '../mocks/requests.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))
let requests = [...requestsData]

export const fetchRequests = async (params = {}) => {
  await delay(500)
  let filtered = [...requests]
  if (params.status) filtered = filtered.filter(r => r.status === params.status)
  if (params.search) filtered = filtered.filter(r =>
    r.title.toLowerCase().includes(params.search.toLowerCase()) ||
    r.id.toLowerCase().includes(params.search.toLowerCase())
  )
  if (params.department) filtered = filtered.filter(r => r.department === params.department)
  if (params.priority) filtered = filtered.filter(r => r.priority === params.priority)
  return { requests: filtered, total: filtered.length }
}

export const fetchRequestById = async (id) => {
  await delay(400)
  const request = requests.find(r => r.id === id)
  if (!request) throw new Error('Request not found')
  return request
}

export const createRequest = async (data) => {
  await delay(600)
  const newRequest = {
    id: `REQ-00${requests.length + 1}`,
    ...data,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    approvalHistory: [],
    comments: [],
    auditLogs: [{ id: `al-new`, action: 'Request Created', user: data.requestedBy, timestamp: new Date().toISOString() }],
  }
  requests.unshift(newRequest)
  return newRequest
}

export const updateRequest = async (id, data) => {
  await delay(500)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) throw new Error('Request not found')
  requests[idx] = { ...requests[idx], ...data, updatedAt: new Date().toISOString() }
  return requests[idx]
}

export const approveRequest = async (id, comment) => {
  await delay(500)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) throw new Error('Request not found')
  const approval = { id: `ap-${Date.now()}`, action: 'Approved', user: 'Bob Smith', role: 'Procurement Manager', comment, timestamp: new Date().toISOString() }
  requests[idx] = { ...requests[idx], status: 'approved', updatedAt: new Date().toISOString(), approvalHistory: [...requests[idx].approvalHistory, approval] }
  return requests[idx]
}

export const rejectRequest = async (id, comment) => {
  await delay(500)
  const idx = requests.findIndex(r => r.id === id)
  if (idx === -1) throw new Error('Request not found')
  const rejection = { id: `ap-${Date.now()}`, action: 'Rejected', user: 'Bob Smith', role: 'Procurement Manager', comment, timestamp: new Date().toISOString() }
  requests[idx] = { ...requests[idx], status: 'rejected', updatedAt: new Date().toISOString(), approvalHistory: [...requests[idx].approvalHistory, rejection] }
  return requests[idx]
}
