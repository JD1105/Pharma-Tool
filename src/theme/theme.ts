import { createTheme } from '@mui/material/styles'
import type {} from '@mui/x-data-grid/themeAugmentation'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1F3A5F', light: '#3F6EA8' },
    secondary: { main: '#0E9AA7' },
    success: { main: '#2E7D32' },
    warning: { main: '#ED6C02' },
    error: { main: '#D32F2F' },
    background: { default: '#F4F6F9', paper: '#FFFFFF' },
    text: { primary: '#1B2733' },
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiPaper: { styleOverrides: { root: { border: '1px solid #E3E8EF', boxShadow: 'none' } } },
    MuiDataGrid: {
      styleOverrides: { columnHeaders: { backgroundColor: '#F4F6F9', fontWeight: 700 } },
    },
  },
})