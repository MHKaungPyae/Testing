import React, { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import * as api from '../lib/api'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  Link,
} from '@mui/material'

export default function Register() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await api.register(name, email, password)
      nav('/login')
    } catch (e: any) {
      setError(e.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Create your account</Typography>
        <form onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Name" value={name} onChange={e => setName(e.target.value)} required fullWidth />
            <TextField label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required fullWidth />
            <TextField label="Password" type="password" inputProps={{ minLength: 6 }} value={password} onChange={e => setPassword(e.target.value)} required fullWidth />
            {error && <Alert severity="error">{error}</Alert>}
            <Button disabled={loading} type="submit" variant="contained" fullWidth>
              {loading ? 'Creating…' : 'Register'}
            </Button>
          </Stack>
        </form>
        <Link component={RouterLink} to="/login" underline="hover" sx={{ display: 'inline-block', mt: 2 }}>Back to login</Link>
      </Paper>
    </Container>
  )
}
