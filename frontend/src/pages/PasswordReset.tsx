import React, { useState } from 'react'
import * as api from '../lib/api'
import { Container, Paper, Typography, TextField, Button, Stack, Alert, Divider } from '@mui/material'

export default function PasswordReset() {
  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  async function requestToken() {
    await api.requestPasswordReset(email)
    setMsg('If email exists, a token is logged on server.')
  }

  async function reset() {
    await api.resetPassword(token, newPassword)
    setMsg('Password reset successful')
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>Password Reset</Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
          <Button variant="outlined" onClick={requestToken}>Request Token</Button>
        </Stack>
        <Divider sx={{ my: 2 }} />
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
          <TextField label="Token" value={token} onChange={e => setToken(e.target.value)} fullWidth />
          <TextField label="New password" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} fullWidth />
          <Button variant="contained" onClick={reset}>Reset Password</Button>
        </Stack>
        {msg && <Alert severity="info" sx={{ mt: 2 }}>{msg}</Alert>}
      </Paper>
    </Container>
  )
}
