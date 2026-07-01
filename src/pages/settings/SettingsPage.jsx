import React, { useState } from 'react'
import { Box, Card, CardContent, Typography, TextField, Button, Grid, Avatar, Switch, FormControlLabel, Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Alert, Tabs, Tab } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../../store/slices/uiSlice'
import { showSnackbar } from '../../store/slices/uiSlice'
import SectionHeader from '../../components/common/SectionHeader'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import SecurityIcon from '@mui/icons-material/Security'

function TabPanel({ value, index, children }) {
  return value === index ? <Box pt={2}>{children}</Box> : null
}

function SettingsPage() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const themeMode = useSelector(state => state.ui.themeMode)
  const [tab, setTab] = useState(0)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    dispatch(showSnackbar({ message: 'Settings saved successfully', severity: 'success' }))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Box>
      <SectionHeader title="User Settings" subtitle="Manage your profile, preferences and security" />

      <Card>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ borderBottom: '1px solid', borderColor: 'divider', px: 2 }}>
          <Tab label="Profile" />
          <Tab label="Appearance" />
          <Tab label="Preferences" />
          <Tab label="Security" />
        </Tabs>
        <CardContent sx={{ p: 3 }}>
          <TabPanel value={tab} index={0}>
            <Box display="flex" gap={3} alignItems="flex-start" flexWrap="wrap">
              <Box display="flex" flexDirection="column" alignItems="center" gap={1.5}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: 32, fontWeight: 700 }}>{user?.name?.charAt(0)}</Avatar>
                <Button size="small" variant="outlined">Change Photo</Button>
              </Box>
              <Box flex={1} minWidth={280}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Full Name" defaultValue={user?.name} size="small" /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Email" defaultValue={user?.email} size="small" disabled /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Department" defaultValue={user?.department} size="small" /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Role" defaultValue={user?.role} size="small" disabled /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Phone" placeholder="+1-555-0000" size="small" /></Grid>
                  <Grid item xs={12} sm={6}><TextField fullWidth label="Location" placeholder="New York, USA" size="small" /></Grid>
                  <Grid item xs={12}>
                    <Button variant="contained" onClick={handleSave}>Save Profile</Button>
                  </Grid>
                </Grid>
              </Box>
            </Box>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>Theme</Typography>
            <Box display="flex" gap={2} mb={3}>
              {['light', 'dark'].map(mode => (
                <Box key={mode} onClick={() => { if (themeMode !== mode) dispatch(toggleTheme()) }}
                  sx={{ width: 140, p: 2, border: '2px solid', borderColor: themeMode === mode ? 'primary.main' : 'divider', borderRadius: 2, cursor: 'pointer', textAlign: 'center', bgcolor: themeMode === mode ? 'action.selected' : 'transparent' }}>
                  {mode === 'light' ? <LightModeIcon sx={{ mb: 0.5, color: 'warning.main' }} /> : <DarkModeIcon sx={{ mb: 0.5, color: 'text.secondary' }} />}
                  <Typography variant="body2" fontWeight={themeMode === mode ? 600 : 400} textTransform="capitalize">{mode} Mode</Typography>
                </Box>
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="subtitle2" fontWeight={600} mb={2}>Display Options</Typography>
            <List disablePadding>
              {[['Compact Mode', 'Reduce spacing for more content'], ['Show Tooltips', 'Display helpful hints']].map(([label, desc]) => (
                <ListItem key={label} disableGutters>
                  <ListItemText primary={<Typography variant="body2" fontWeight={500}>{label}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{desc}</Typography>} />
                  <ListItemSecondaryAction><Switch defaultChecked size="small" /></ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <Typography variant="subtitle2" fontWeight={600} mb={2}>Notifications</Typography>
            <List disablePadding>
              {[['Email Notifications', 'Receive emails for approvals and alerts'],
                ['In-App Notifications', 'Show notifications in the platform'],
                ['Approval Alerts', 'Notify when requests need your approval'],
                ['Risk Alerts', 'Notify for new high-risk events']].map(([label, desc]) => (
                <ListItem key={label} disableGutters>
                  <ListItemText primary={<Typography variant="body2" fontWeight={500}>{label}</Typography>} secondary={<Typography variant="caption" color="text.secondary">{desc}</Typography>} />
                  <ListItemSecondaryAction><Switch defaultChecked size="small" /></ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Button variant="contained" onClick={handleSave}>Save Preferences</Button>
          </TabPanel>

          <TabPanel value={tab} index={3}>
            <Box maxWidth={480}>
              <Box display="flex" gap={1.5} alignItems="center" mb={2}>
                <SecurityIcon color="primary" />
                <Typography variant="subtitle2" fontWeight={600}>Change Password</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}><TextField fullWidth label="Current Password" type="password" size="small" /></Grid>
                <Grid item xs={12}><TextField fullWidth label="New Password" type="password" size="small" /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Confirm New Password" type="password" size="small" /></Grid>
                <Grid item xs={12}><Button variant="contained" onClick={handleSave}>Update Password</Button></Grid>
              </Grid>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" fontWeight={600} mb={2}>Two-Factor Authentication</Typography>
              <Box display="flex" justifyContent="space-between" alignItems="center" p={2} border="1px solid" borderColor="divider" borderRadius={1}>
                <Box>
                  <Typography variant="body2" fontWeight={500}>Authenticator App</Typography>
                  <Typography variant="caption" color="text.secondary">Use an authenticator app for 2FA</Typography>
                </Box>
                <Switch size="small" />
              </Box>
            </Box>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SettingsPage
