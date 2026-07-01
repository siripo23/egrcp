import { fetchRequests, fetchRequestById, createRequest, approveRequest, rejectRequest } from '../services/procurementService'

describe('procurementService', () => {
  it('should fetch all requests', async () => {
    const result = await fetchRequests()
    expect(result.requests).toBeDefined()
    expect(Array.isArray(result.requests)).toBe(true)
    expect(result.total).toBeGreaterThan(0)
  })

  it('should filter requests by status', async () => {
    const result = await fetchRequests({ status: 'approved' })
    expect(result.requests.every(r => r.status === 'approved')).toBe(true)
  })

  it('should filter requests by search term', async () => {
    const result = await fetchRequests({ search: 'laptop' })
    expect(result.requests.length).toBeGreaterThan(0)
    expect(result.requests[0].title.toLowerCase()).toContain('laptop')
  })

  it('should fetch a request by id', async () => {
    const result = await fetchRequestById('REQ-001')
    expect(result.id).toBe('REQ-001')
    expect(result.title).toBeDefined()
  })

  it('should throw for invalid request id', async () => {
    await expect(fetchRequestById('REQ-999')).rejects.toThrow('Request not found')
  })

  it('should create a new request', async () => {
    const data = { title: 'New Test Request', department: 'IT', vendorId: 'v001', vendor: 'TechSupply Corp', amount: 5000, priority: 'medium', requestedBy: 'Test User', requestedById: 'u001', category: 'IT Equipment', dueDate: '2026-12-01', description: 'Test description' }
    const result = await createRequest(data)
    expect(result.id).toBeDefined()
    expect(result.status).toBe('pending')
    expect(result.title).toBe('New Test Request')
  })

  it('should approve a request', async () => {
    const result = await approveRequest('REQ-002', 'Looks good')
    expect(result.status).toBe('approved')
  })

  it('should reject a request', async () => {
    const result = await rejectRequest('REQ-004', 'Over budget')
    expect(result.status).toBe('rejected')
  })
})
