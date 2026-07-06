import React, { useEffect } from 'react'
import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Alert } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComplianceData } from '../../store/slices/complianceSlice'
import SectionHeader from '../../components/common/SectionHeader'
import KpiCard from '../../components/common/KpiCard'
import StatusChip from '../../components/common/StatusChip'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import FindInPageIcon from '@mui/icons-material/FindInPage'
import CancelIcon from '@mui/icons-material/Cancel'

function ComplianceCenterPage() {
  const dispatch = useDispatch()
  const { violations, missingDocuments, expiredCertifications, complianceScore, loading } = useSelector(state => state.compliance)

  useEffect(() => { dispatch(fetchComplianceData()) }, [dispatch])

  if (loading && violations.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <SectionHeader title="Compliance Center" subtitle="Monitor compliance status, violations and certifications" />

      <Grid container spacing={2} mb={3}>
        <Grid item xs={6} sm={3}><KpiCard title="Compliance Score" value={`${complianceScore}%`} icon={<VerifiedUserIcon sx={{ fontSize: 20 }} />} color={complianceScore >= 80 ? 'success.main' : 'warning.main'} /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="Violations" value={violations.length} icon={<ErrorOutlineIcon sx={{ fontSize: 20 }} />} color="error.main" /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="Missing Docs" value={missingDocuments.length} icon={<FindInPageIcon sx={{ fontSize: 20 }} />} color="warning.main" /></Grid>
        <Grid item xs={6} sm={3}><KpiCard title="Expired Certs" value={expiredCertifications.length} icon={<CancelIcon sx={{ fontSize: 20 }} />} color="error.main" /></Grid>
      </Grid>

      {violations.length > 0 && <Alert severity="error" sx={{ mb: 3 }}>⚠ {violations.length} compliance violation{violations.length > 1 ? 's' : ''} require immediate attention</Alert>}

      <Grid container spacing={2}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Compliance Violations</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Vendor</TableCell><TableCell>Issue</TableCell><TableCell>Score</TableCell><TableCell>Severity</TableCell></TableRow></TableHead>
                  <TableBody>
                    {violations.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">No violations found</Typography></TableCell></TableRow>
                    ) : violations.map(v => (
                      <TableRow key={v.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{v.vendorName}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{v.issue}</Typography></TableCell>
                        <TableCell><Typography variant="body2" fontWeight={600} color="error.main">{v.score}%</Typography></TableCell>
                        <TableCell><StatusChip status={v.severity} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Certification Status</Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead><TableRow><TableCell>Vendor</TableCell><TableCell>Certificate</TableCell><TableCell>Expiry</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
                  <TableBody>
                    {expiredCertifications.length === 0 ? (
                      <TableRow><TableCell colSpan={4} align="center" sx={{ py: 3 }}><Typography variant="body2" color="text.secondary">All certifications are valid</Typography></TableCell></TableRow>
                    ) : expiredCertifications.map(cert => (
                      <TableRow key={cert.id} hover>
                        <TableCell><Typography variant="body2" fontWeight={500}>{cert.vendorName}</Typography></TableCell>
                        <TableCell><Typography variant="body2" color="text.secondary">{cert.certName}</Typography></TableCell>
                        <TableCell><Typography variant="body2">{cert.expiry || '—'}</Typography></TableCell>
                        <TableCell><StatusChip status={cert.status} /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} mb={2}>Missing Documents</Typography>
              {missingDocuments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No missing documents</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead><TableRow><TableCell>Vendor</TableCell><TableCell>Document</TableCell><TableCell>Severity</TableCell></TableRow></TableHead>
                    <TableBody>
                      {missingDocuments.map(doc => (
                        <TableRow key={doc.id} hover>
                          <TableCell><Typography variant="body2" fontWeight={500}>{doc.vendorName}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary">{doc.documentName}</Typography></TableCell>
                          <TableCell><StatusChip status={doc.severity} /></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default ComplianceCenterPage
