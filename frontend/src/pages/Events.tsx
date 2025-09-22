import React, { useEffect, useState } from 'react'
import * as api from '../lib/api'
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Alert,
  Snackbar,
  CircularProgress,
  Box,
  CardActionArea,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

export default function Events() {
  const nav = useNavigate()
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        const data = await api.getEvents()
        setEvents(data)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const [snack, setSnack] = useState<string | null>(null)

  async function book(eid: string) {
    try {
      const res = await api.createBooking(eid)
      await api.pay(res.booking.id)
      setSnack('Booking successful!')
    } catch (e: any) {
      setSnack(e.message || 'Booking failed')
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
  if (error) return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>

  return (
    <Box sx={{ py: 1 }}>
      <Typography variant="h5" gutterBottom>Events</Typography>
      {events.length === 0 && <Typography color="text.secondary">No events</Typography>}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        {events.map(e => (
          <Card key={e.id} variant="outlined">
            <CardActionArea onClick={() => nav(`/events/${e.id}`)}>
              <CardContent>
                <Typography variant="h6">{e.title}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{e.description}</Typography>
                <Typography variant="subtitle1" fontWeight={600}>${((e.price || 0)/100).toFixed(2)}</Typography>
              </CardContent>
            </CardActionArea>
            <CardActions>
              <Button size="small" variant="contained" onClick={(ev) => { ev.stopPropagation(); book(e.id) }}>Book</Button>
            </CardActions>
          </Card>
        ))}
      </Box>
      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack || ''}
      />
    </Box>
  )
}
