import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline, AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material'
import { theme } from './theme'
import Login from './pages/Login'
import Register from './pages/Register'
import History from './pages/History'
import Profile from './pages/Profile'
import PasswordReset from './pages/PasswordReset'
import { AuthProvider, useAuth } from './auth/AuthContext'
import Events from './pages/Events'

function Protected({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <AppBar position="static" color="primary" enableColorOnDark>
          <Toolbar sx={{ gap: 1 }}>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>TripNest</Typography>
            <Button color="inherit" component={Link} to="/events">Events</Button>
            <Button color="inherit" component={Link} to="/history">History</Button>
            <Button color="inherit" component={Link} to="/profile">Profile</Button>
          </Toolbar>
        </AppBar>
        <Container maxWidth="md">
          <Box sx={{ py: 3 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/events" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/reset" element={<PasswordReset />} />
              <Route path="/events" element={<Protected><Events /></Protected>} />
              <Route path="/history" element={<Protected><History /></Protected>} />
              <Route path="/profile" element={<Protected><Profile /></Protected>} />
            </Routes>
          </Box>
        </Container>
      </AuthProvider>
    </ThemeProvider>
  )
}
