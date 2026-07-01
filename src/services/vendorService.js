import vendorsData from '../mocks/vendors.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchVendors = async (params = {}) => {
  await delay(500)
  let filtered = [...vendorsData]
  if (params.status) filtered = filtered.filter(v => v.status === params.status)
  if (params.riskLevel) filtered = filtered.filter(v => v.riskLevel === params.riskLevel)
  if (params.category) filtered = filtered.filter(v => v.category === params.category)
  if (params.search) filtered = filtered.filter(v => v.name.toLowerCase().includes(params.search.toLowerCase()))
  const kpis = {
    total: vendorsData.length,
    active: vendorsData.filter(v => v.status === 'active').length,
    highRisk: vendorsData.filter(v => v.riskLevel === 'high').length,
    expiringCerts: vendorsData.filter(v => v.documents?.some(d => d.status === 'expiring')).length,
  }
  return { vendors: filtered, kpis }
}

export const fetchVendorById = async (id) => {
  await delay(400)
  const vendor = vendorsData.find(v => v.id === id)
  if (!vendor) throw new Error('Vendor not found')
  return vendor
}
