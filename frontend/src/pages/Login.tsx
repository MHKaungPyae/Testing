import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      nav('/events', { replace: true })
    } catch (e: any) {
      setError(e.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Welcome back</Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Sign in to continue to TripNest
        </Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
            />
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              disabled={loading}
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={loading ? <CircularProgress size={18} /> : null}
            >
              {loading ? 'Signing in…' : 'Login'}
            </Button>
          </Stack>
        </form>
        <Stack direction="row" spacing={1} justifyContent="space-between" sx={{ mt: 2 }}>
          <Link component={RouterLink} to="/register" underline="hover">Create an account</Link>
          <Link component={RouterLink} to="/reset" underline="hover">Forgot password?</Link>
        </Stack>
      </Paper>
    </Container>
  )
}
