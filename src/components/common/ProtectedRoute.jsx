import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const sessionExpired = useSelector(state => state.auth.sessionExpired)
  const location = useLocation()

  if (sessionExpired) return <Navigate to="/session-expired" replace />
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />
  if (allowedRoles && user && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />

  return <Outlet />
}

export default ProtectedRoute
