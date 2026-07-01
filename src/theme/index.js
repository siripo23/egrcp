import { createTheme } from '@mui/material/styles'

const commonTypography = {
  fontFamily: '"Inter", "Segoe UI", "Roboto", sans-serif',
  h1: { fontWeight: 700, fontSize: '2rem' },
  h2: { fontWeight: 600, fontSize: '1.75rem' },
  h3: { fontWeight: 600, fontSize: '1.5rem' },
  h4: { fontWeight: 600, fontSize: '1.25rem' },
  h5: { fontWeight: 600, fontSize: '1.1rem' },
  h6: { fontWeight: 600, fontSize: '1rem' },
  body1: { fontSize: '0.875rem' },
  body2: { fontSize: '0.8125rem' },
  caption: { fontSize: '0.75rem' },
}

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0057B8', light: '#3378C9', dark: '#003E8A', contrastText: '#fff' },
    secondary: { main: '#00A0DC', light: '#33B3E3', dark: '#0070A0', contrastText: '#fff' },
    success: { main: '#2E7D32', light: '#4CAF50' },
    warning: { main: '#ED6C02', light: '#FF9800' },
    error: { main: '#D32F2F', light: '#EF5350' },
    info: { main: '#0057B8' },
    background: { default: '#F0F2F5', paper: '#FFFFFF' },
    text: { primary: '#1A2332', secondary: '#5A6677' },
    divider: '#E0E4EA',
  },
  typography: commonTypography,
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 4px rgba(0,0,0,0.08)', border: '1px solid #E0E4EA' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 500, borderRadius: 6 },
        containedPrimary: { boxShadow: '0 2px 6px rgba(0,87,184,0.3)' },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-head': { backgroundColor: '#F5F7FA', fontWeight: 600, color: '#1A2332', fontSize: '0.8125rem' } },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 500, fontSize: '0.75rem' } },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { border: 'none', boxShadow: '2px 0 8px rgba(0,0,0,0.08)' },
      },
    },
  },
})

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#4D9FFF', light: '#80BFFF', dark: '#1A7AE6', contrastText: '#fff' },
    secondary: { main: '#33C3F0', light: '#66D3F5', dark: '#0099CC' },
    success: { main: '#66BB6A' },
    warning: { main: '#FFA726' },
    error: { main: '#EF5350' },
    background: { default: '#0D1117', paper: '#161B22' },
    text: { primary: '#E6EDF3', secondary: '#8B949E' },
    divider: '#30363D',
  },
  typography: commonTypography,
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: { boxShadow: '0 1px 4px rgba(0,0,0,0.3)', border: '1px solid #30363D' },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 500, borderRadius: 6 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: { '& .MuiTableCell-head': { backgroundColor: '#1C2128', fontWeight: 600, fontSize: '0.8125rem' } },
      },
    },
    MuiDrawer: {
      styleOverrides: { paper: { border: 'none', backgroundColor: '#161B22' } },
    },
  },
})
