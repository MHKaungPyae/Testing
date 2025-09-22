import React, { useEffect, useState } from 'react'
import { Alert, CircularProgress, List, ListItem, ListItemText, Typography, Box } from '@mui/material'
import * as api from '../lib/api'

export default function Notifications() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const list = await api.myNotifications()
        setItems(list)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
  if (error) return <Alert severity="error">{error}</Alert>

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Notifications</Typography>
      {items.length === 0 ? (
        <Typography color="text.secondary">No notifications</Typography>
      ) : (
        <List>
          {items.map(n => (
            <ListItem key={n.id} divider>
              <ListItemText primary={n.message} secondary={new Date(n.createdAt).toLocaleString()} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
