import vendorsData from '../mocks/vendors.json'
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fetchComplianceData = async () => {
  await delay(500)
  const violations = vendorsData.filter(v => v.complianceScore < 60).map(v => ({
    id: v.id, vendorName: v.name, issue: 'Low compliance score', score: v.complianceScore, severity: 'high',
  }))
  const missingDocuments = vendorsData.flatMap(v =>
    (v.documents || []).filter(d => d.status === 'missing').map(d => ({
      id: d.id, vendorName: v.name, documentName: d.name, severity: 'high',
    }))
  )
  const expiredCertifications = vendorsData.flatMap(v =>
    (v.documents || []).filter(d => d.status === 'expired' || d.status === 'expiring').map(d => ({
      id: d.id, vendorName: v.name, certName: d.name, expiry: d.expiry, status: d.status,
    }))
  )
  const totalVendors = vendorsData.length
  const compliantVendors = vendorsData.filter(v => v.complianceScore >= 80).length
  return {
    violations, missingDocuments, expiredCertifications,
    complianceScore: Math.round((compliantVendors / totalVendors) * 100),
  }
}
