import { fetchVendors, fetchVendorById } from '../services/vendorService'

describe('vendorService', () => {
  it('should fetch all vendors', async () => {
    const result = await fetchVendors()
    expect(result.vendors).toBeDefined()
    expect(result.vendors.length).toBeGreaterThan(0)
    expect(result.kpis).toBeDefined()
  })

  it('should return kpis correctly', async () => {
    const result = await fetchVendors()
    expect(result.kpis.total).toBeGreaterThan(0)
    expect(typeof result.kpis.active).toBe('number')
    expect(typeof result.kpis.highRisk).toBe('number')
  })

  it('should filter vendors by status', async () => {
    const result = await fetchVendors({ status: 'active' })
    expect(result.vendors.every(v => v.status === 'active')).toBe(true)
  })

  it('should filter vendors by risk level', async () => {
    const result = await fetchVendors({ riskLevel: 'high' })
    expect(result.vendors.every(v => v.riskLevel === 'high')).toBe(true)
  })

  it('should fetch vendor by id', async () => {
    const result = await fetchVendorById('v001')
    expect(result.id).toBe('v001')
    expect(result.name).toBeDefined()
  })

  it('should throw for invalid vendor id', async () => {
    await expect(fetchVendorById('v999')).rejects.toThrow('Vendor not found')
  })
})
