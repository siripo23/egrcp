import React, { useEffect } from 'react'
import { Box, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, Button, Chip, Divider, CircularProgress } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchNotifications, markAsRead, markAllAsRead } from '../../store/slices/notificationSlice'
import SectionHeader from '../../components/common/SectionHeader'
import NotificationsIcon from '@mui/icons-material/Notifications'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import WarningIcon from '@mui/icons-material/Warning'
import InfoIcon from '@mui/icons-material/Info'
import SecurityIcon from '@mui/icons-material/Security'

const typeIcons = {
  approval: <CheckCircleIcon sx={{ color: '#2E7D32' }} />,
  risk: <SecurityIcon sx={{ color: '#D32F2F' }} />,
  compliance: <WarningIcon sx={{ color: '#ED6C02' }} />,
  procurement: <InfoIcon sx={{ color: '#0057B8' }} />,
  system: <NotificationsIcon sx={{ color: '#5A6677' }} />,
  escalation: <WarningIcon sx={{ color: '#D32F2F' }} />,
  vendor: <InfoIcon sx={{ color: '#00A0DC' }} />,
}

const priorityColor = { high: 'error', medium: 'warning', low: 'default' }

function NotificationCenterPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { notifications, unreadCount, loading } = useSelector(state => state.notification)

  useEffect(() => { dispatch(fetchNotifications()) }, [dispatch])

  const handleClick = (n) => {
    dispatch(markAsRead(n.id))
    if (n.link) navigate(n.link)
  }

  if (loading && notifications.length === 0) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>

  return (
    <Box>
      <SectionHeader
        title="Notification Center"
        subtitle={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
        action={unreadCount > 0 ? <Button size="small" variant="outlined" onClick={() => dispatch(markAllAsRead())}>Mark All as Read</Button> : null}
      />

      <Card>
        <List disablePadding>
          {notifications.length === 0 ? (
            <Box py={6} textAlign="center">
              <NotificationsIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography color="text.secondary">No notifications</Typography>
            </Box>
          ) : notifications.map((n, idx) => (
            <React.Fragment key={n.id}>
              <ListItem
                alignItems="flex-start"
                onClick={() => handleClick(n)}
                sx={{ cursor: 'pointer', bgcolor: n.read ? 'transparent' : 'action.selected', px: 3, py: 2, '&:hover': { bgcolor: 'action.hover' } }}
              >
                <ListItemIcon sx={{ mt: 0.5, minWidth: 40 }}>
                  {typeIcons[n.type] || <NotificationsIcon />}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Box display="flex" justifyContent="space-between" alignItems="center" gap={1}>
                      <Typography variant="body2" fontWeight={n.read ? 400 : 600}>{n.title}</Typography>
                      <Box display="flex" gap={1} alignItems="center" flexShrink={0}>
                        <Chip label={n.priority} size="small" color={priorityColor[n.priority]} sx={{ fontSize: '0.7rem', fontWeight: 500 }} />
                        {!n.read && <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'primary.main' }} />}
                      </Box>
                    </Box>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary" mt={0.25}>{n.message}</Typography>
                      <Typography variant="caption" color="text.secondary" mt={0.5} display="block">
                        {new Date(n.createdAt).toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {idx < notifications.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Card>
    </Box>
  )
}

export default NotificationCenterPage
