import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#00897b' }, // teal
    secondary: { main: '#ff7043' },
  },
  shape: { borderRadius: 10 },
});
