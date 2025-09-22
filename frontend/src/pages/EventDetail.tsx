import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Alert, Box, Button, Card, CardContent, CircularProgress, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import * as api from '../lib/api'

export default function EventDetail() {
  const { id } = useParams()
  const [event, setEvent] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        if (!id) return
        const ev = await api.getEvent(id)
        setEvent(ev)
      } catch (e: any) { setError(e.message) } finally { setLoading(false) }
    })()
  }, [id])

  async function book() {
    if (!event) return
    try {
      const res = await api.createBooking(event.id)
      await api.pay(res.booking.id)
      setMsg('Booking confirmed and paid!')
    } catch (e: any) {
      setError(e.message || 'Booking failed')
    }
  }

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
      <CircularProgress />
    </Box>
  )
  if (error) return <Alert severity="error">{error}</Alert>
  if (!event) return <Typography>No event found.</Typography>

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{event.title}</Typography>
      <Typography color="text.secondary">{event.description}</Typography>
      <Card variant="outlined">
        <CardContent>
          <Typography><strong>Location:</strong> {event.location}</Typography>
          <Typography><strong>Date:</strong> {new Date(event.date).toLocaleString()}</Typography>
          <Typography><strong>Price:</strong> ${((event.price||0)/100).toFixed(2)}</Typography>
          {typeof event.rating === 'number' && (
            <Typography><strong>Rating:</strong> {event.rating.toFixed(1)} / 5</Typography>
          )}
        </CardContent>
      </Card>
      <div>
        <Button variant="contained" onClick={book}>Book</Button>
      </div>
      <Typography variant="h6">Reviews</Typography>
      {(!event.reviews || event.reviews.length === 0) ? (
        <Typography color="text.secondary">No reviews yet</Typography>
      ) : (
        <List>
          {event.reviews.map((r: any, idx: number) => (
            <ListItem key={idx} divider>
              <ListItemText primary={`${r.user} — ${r.rating}/5`} secondary={r.comment} />
            </ListItem>
          ))}
        </List>
      )}
      {msg && <Alert severity="success" onClose={() => setMsg(null)}>{msg}</Alert>}
    </Stack>
  )
}
