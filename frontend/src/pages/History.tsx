import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import { Typography, Alert, List, ListItem, ListItemText, CircularProgress, Box } from '@mui/material'

export default function History() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const d = await api.myBookings()
        setData(d)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [])

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
  if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" gutterBottom>My Bookings</Typography>
      {data.length === 0 ? (
        <Typography color="text.secondary">No bookings yet</Typography>
      ) : (
        <List>
          {data.map(b => (
            <ListItem key={b.id} divider>
              <ListItemText primary={`#${b.id} — ${b.status}`} secondary={`$${((b.amount||0)/100).toFixed(2)}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}
