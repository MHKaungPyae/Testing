import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import { useAuth } from '../auth/AuthContext'
import { Typography, Stack, TextField, Button, Alert } from '@mui/material'

export default function Profile() {
  const { user, logout } = useAuth()
  const [name, setName] = useState('')
  const [oldPassword, setOld] = useState('')
  const [newPassword, setNew] = useState('')
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      const u = await api.getMe()
      setName(u.name || '')
    })()
  }, [])

  async function saveProfile() {
    await api.updateMe({ name })
    setMsg('Profile updated')
  }

  async function changePassword() {
    await api.changePassword(oldPassword, newPassword)
    setOld(''); setNew(''); setMsg('Password changed')
  }

  return (
    <Stack spacing={2} sx={{ py: 1 }}>
      <Typography variant="h5">Profile</Typography>
      <Typography color="text.secondary">Email: {user?.email}</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
        <TextField label="Name" value={name} onChange={e => setName(e.target.value)} sx={{ maxWidth: 360 }} />
        <Button variant="contained" onClick={saveProfile}>Save</Button>
      </Stack>
      <Typography variant="h6" sx={{ mt: 2 }}>Change Password</Typography>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'flex-end' }}>
        <TextField label="Old password" type="password" value={oldPassword} onChange={e => setOld(e.target.value)} sx={{ maxWidth: 360 }} />
        <TextField label="New password" type="password" value={newPassword} onChange={e => setNew(e.target.value)} sx={{ maxWidth: 360 }} />
        <Button variant="outlined" onClick={changePassword}>Change</Button>
      </Stack>
      <Button color="secondary" variant="text" onClick={logout} sx={{ mt: 1, alignSelf: 'flex-start' }}>Logout</Button>
      {msg && <Alert severity="success" onClose={() => setMsg(null)}>{msg}</Alert>}
    </Stack>
  )
}
