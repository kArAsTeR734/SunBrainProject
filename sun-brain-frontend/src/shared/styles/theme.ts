import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#b5472a' },
    error: { main: '#b22d35' },
    success: { main: '#2e6b50' },
    text: { primary: '#252e28', secondary: '#626963' },
    divider: '#e3e3dc',
    background: { default: '#f8f7f4', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { minHeight: 44 } },
    },
  },
});
