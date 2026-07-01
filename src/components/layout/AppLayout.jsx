import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import AppHeader from './AppHeader'
import AppSidebar from './AppSidebar'

const SIDEBAR_WIDTH = 240
const SIDEBAR_COLLAPSED = 64
const HEADER_HEIGHT = 64

function AppLayout() {
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen)
  const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)
  const effectiveWidth = !sidebarOpen ? 0 : sidebarCollapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden', bgcolor: 'background.default' }}>
      <AppSidebar width={SIDEBAR_WIDTH} collapsedWidth={SIDEBAR_COLLAPSED} />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, ml: `${effectiveWidth}px`, transition: 'margin 0.25s ease' }}>
        <AppHeader height={HEADER_HEIGHT} />
        <Box component="main" sx={{ flex: 1, overflow: 'auto', p: 3, mt: `${HEADER_HEIGHT}px` }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default AppLayout
