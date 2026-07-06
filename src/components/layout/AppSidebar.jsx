import React, { useMemo } from 'react'
import { Drawer, Box, List, ListItemButton, ListItemIcon, ListItemText, Typography, Tooltip, Divider, Avatar } from '@mui/material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import DashboardIcon from '@mui/icons-material/Dashboard'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import StoreIcon from '@mui/icons-material/Store'
import SecurityIcon from '@mui/icons-material/Security'
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser'
import AssignmentIcon from '@mui/icons-material/Assignment'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import NotificationsIcon from '@mui/icons-material/Notifications'

const navItems = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Procurement', icon: <ShoppingCartIcon />, path: '/procurement' },
  { label: 'Vendors', icon: <StoreIcon />, path: '/vendors' },
  { label: 'Risk Center', icon: <SecurityIcon />, path: '/risk' },
  { label: 'Compliance', icon: <VerifiedUserIcon />, path: '/compliance' },
  { label: 'Audit Center', icon: <AssignmentIcon />, path: '/audit' },
  { label: 'Approval', icon: <CheckCircleOutlineIcon />, path: '/approval' },
  { label: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
  { label: 'Reports', icon: <BarChartIcon />, path: '/reports' },
  { label: 'Settings', icon: <SettingsIcon />, path: '/settings' },
]

function AppSidebar({ width, collapsedWidth }) {
  const navigate = useNavigate()
  const location = useLocation()
  const sidebarOpen = useSelector(state => state.ui.sidebarOpen)
  const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)
  const user = useSelector(state => state.auth.user)

  const drawerWidth = sidebarCollapsed ? collapsedWidth : width

  const drawerContent = useMemo(() => (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Box sx={{ height: 64, display: 'flex', alignItems: 'center', px: sidebarCollapsed ? 1.5 : 2.5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ width: 32, height: 32, borderRadius: 1.5, bgcolor: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>eG</Typography>
        </Box>
        {!sidebarCollapsed && (
          <Box ml={1.5}>
            <Typography fontWeight={700} fontSize={13} color="primary.main" lineHeight={1.2}>e-GRCP</Typography>
            <Typography variant="caption" color="text.secondary" fontSize={10}>Enterprise Platform</Typography>
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1 }}>
        <List dense disablePadding>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path)
            return (
              <Tooltip title={sidebarCollapsed ? item.label : ''} placement="right" key={item.path}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  selected={isActive}
                  sx={{
                    mx: 1, my: 0.25, borderRadius: 1.5, px: sidebarCollapsed ? 1.5 : 2,
                    '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiListItemIcon-root': { color: 'white' }, '&:hover': { bgcolor: 'primary.dark' } },
                    '&:hover': { bgcolor: 'action.hover' },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: sidebarCollapsed ? 'auto' : 36, color: isActive ? 'inherit' : 'text.secondary', '& svg': { fontSize: 20 } }}>
                    {item.icon}
                  </ListItemIcon>
                  {!sidebarCollapsed && <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.8rem', fontWeight: isActive ? 600 : 400 }} />}
                </ListItemButton>
              </Tooltip>
            )
          })}
        </List>
      </Box>

      {user && (
        <Box sx={{ p: sidebarCollapsed ? 1 : 2, borderTop: '1px solid', borderColor: 'divider' }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13, flexShrink: 0 }}>
              {user.name?.charAt(0)}
            </Avatar>
            {!sidebarCollapsed && (
              <Box overflow="hidden">
                <Typography variant="caption" fontWeight={600} noWrap display="block">{user.name}</Typography>
                <Typography variant="caption" color="text.secondary" noWrap display="block" textTransform="capitalize">{user.role}</Typography>
              </Box>
            )}
          </Box>
        </Box>
      )}
    </Box>
  ), [sidebarCollapsed, location.pathname, user, navigate])

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        position: 'fixed',
        height: '100vh',
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', transition: 'width 0.25s ease', overflowX: 'hidden' },
      }}
    >
      {drawerContent}
    </Drawer>
  )
}

export default React.memo(AppSidebar)
