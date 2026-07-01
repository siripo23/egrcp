import React, { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { useSelector } from 'react-redux'
import { lightTheme, darkTheme } from './theme'
import ErrorBoundary from './components/common/ErrorBoundary'
import GlobalSnackbar from './components/common/GlobalSnackbar'
import PageLoader from './components/common/PageLoader'
import ProtectedRoute from './components/common/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'

// Lazy-loaded pages (route-based code splitting)
const LoginPage = lazy(() => import('./pages/auth/LoginPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/auth/ResetPasswordPage'))
const SessionExpiredPage = lazy(() => import('./pages/auth/SessionExpiredPage'))
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'))
const ProcurementListPage = lazy(() => import('./pages/procurement/ProcurementListPage'))
const ProcurementDetailPage = lazy(() => import('./pages/procurement/ProcurementDetailPage'))
const CreateRequestPage = lazy(() => import('./pages/procurement/CreateRequestPage'))
const VendorListPage = lazy(() => import('./pages/vendors/VendorListPage'))
const VendorDetailPage = lazy(() => import('./pages/vendors/VendorDetailPage'))
const RiskCenterPage = lazy(() => import('./pages/risk/RiskCenterPage'))
const ComplianceCenterPage = lazy(() => import('./pages/compliance/ComplianceCenterPage'))
const AuditCenterPage = lazy(() => import('./pages/audit/AuditCenterPage'))
const ApprovalWorkbenchPage = lazy(() => import('./pages/approval/ApprovalWorkbenchPage'))
const NotificationCenterPage = lazy(() => import('./pages/notifications/NotificationCenterPage'))
const ReportingCenterPage = lazy(() => import('./pages/reports/ReportingCenterPage'))
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

function App() {
  const themeMode = useSelector(state => state.ui.themeMode)
  const theme = themeMode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/session-expired" element={<SessionExpiredPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/procurement" element={<ProcurementListPage />} />
                  <Route path="/procurement/new" element={<CreateRequestPage />} />
                  <Route path="/procurement/:id" element={<ProcurementDetailPage />} />
                  <Route path="/vendors" element={<VendorListPage />} />
                  <Route path="/vendors/:id" element={<VendorDetailPage />} />
                  <Route path="/risk" element={<RiskCenterPage />} />
                  <Route path="/compliance" element={<ComplianceCenterPage />} />
                  <Route path="/audit" element={<AuditCenterPage />} />
                  <Route path="/approval" element={<ApprovalWorkbenchPage />} />
                  <Route path="/notifications" element={<NotificationCenterPage />} />
                  <Route path="/reports" element={<ReportingCenterPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
              </Route>

              {/* Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
      <GlobalSnackbar />
    </ThemeProvider>
  )
}

export default App
