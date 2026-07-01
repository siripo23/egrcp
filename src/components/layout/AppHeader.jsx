import React, { useState, useCallback } from 'react'
import { AppBar, Toolbar, IconButton, InputBase, Box, Badge, Avatar, Menu, MenuItem, Divider, Tooltip, Typography, alpha } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import NotificationsIcon from '@mui/icons-material/Notifications'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toggleSidebar, toggleTheme, setSidebarCollapsed } from '../../store/slices/uiSlice'
import { logoutUser } from '../../store/slices/authSlice'

function AppHeader({ height }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const themeMode = useSelector(state => state.ui.themeMode)
  const sidebarCollapsed = useSelector(state => state.ui.sidebarCollapsed)
  const user = useSelector(state => state.auth.user)
  const unreadCount = useSelector(state => state.notification.unreadCount)

  const [anchorEl, setAnchorEl] = useState(null)
  const [searchValue, setSearchValue] = useState('')

  const handleLogout = useCallback(async () => {
    setAnchorEl(null)
    await dispatch(logoutUser())
    navigate('/login')
  }, [dispatch, navigate])

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: theme => theme.zIndex.drawer + 1, bgcolor: 'background.paper', borderBottom: '1px solid', borderColor: 'divider', color: 'text.primary', height }}>
      <Toolbar sx={{ height, minHeight: `${height}px !important`, gap: 1 }}>
        <IconButton size="small" onClick={() => dispatch(toggleSidebar())} sx={{ color: 'text.secondary' }}>
          <MenuIcon />
        </IconButton>
        <Tooltip title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
          <IconButton size="small" onClick={() => dispatch(setSidebarCollapsed(!sidebarCollapsed))} sx={{ color: 'text.secondary' }}>
            <UnfoldLessIcon sx={{ transform: sidebarCollapsed ? 'rotate(90deg)' : 'none' }} />
          </IconButton>
        </Tooltip>

        {/* Search */}
        <Box sx={{ flex: 1, maxWidth: 480, mx: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: theme => alpha(theme.palette.text.primary, 0.06), borderRadius: 1.5, px: 1.5, py: 0.5, border: '1px solid transparent', '&:focus-within': { borderColor: 'primary.main', bgcolor: 'background.paper' } }}>
            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
            <InputBase placeholder="Search requests, vendors, risks..." value={searchValue} onChange={e => setSearchValue(e.target.value)}
              sx={{ fontSize: '0.875rem', flex: 1, '& input': { p: 0 } }} />
          </Box>
        </Box>

        <Box flex={1} />

        {/* Theme Toggle */}
        <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
          <IconButton size="small" onClick={() => dispatch(toggleTheme())} sx={{ color: 'text.secondary' }}>
            {themeMode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small" onClick={() => navigate('/notifications')} sx={{ color: 'text.secondary' }}>
            <Badge badgeContent={unreadCount} color="error" max={9}>
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Profile */}
        <Tooltip title={user?.name || 'Profile'}>
          <IconButton size="small" onClick={e => setAnchorEl(e.currentTarget)} sx={{ ml: 0.5 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', fontSize: 13 }}>{user?.name?.charAt(0)}</Avatar>
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
          PaperProps={{ elevation: 3, sx: { mt: 1, minWidth: 200, borderRadius: 2 } }}>
          <Box px={2} py={1.5}>
            <Typography variant="body2" fontWeight={600}>{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null) }} sx={{ gap: 1.5, fontSize: '0.875rem' }}>
            <PersonIcon fontSize="small" /> Profile
          </MenuItem>
          <MenuItem onClick={() => { navigate('/settings'); setAnchorEl(null) }} sx={{ gap: 1.5, fontSize: '0.875rem' }}>
            <SettingsIcon fontSize="small" /> Settings
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, fontSize: '0.875rem', color: 'error.main' }}>
            <LogoutIcon fontSize="small" /> Sign Out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}

export default React.memo(AppHeader)
