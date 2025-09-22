const BASE: string = (import.meta.env.VITE_API_BASE_URL as string) || '/api'

async function request(path: string, opts: RequestInit = {}) {
  const token = localStorage.getItem('token')
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string> || {})
  }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${BASE}${path}`, { ...opts, headers })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || res.statusText)
  }
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) return res.json()
  return res.text()
}

export async function register(name: string, email: string, password: string) {
  await request('/auth/register', { method: 'POST', body: JSON.stringify({ name, email, password }) })
}

export async function login(email: string, password: string): Promise<{ token: string, user: any }> {
  return request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
}

export async function getEvents() {
  return request('/events')
}

export async function getEvent(id: string) {
  return request(`/events/${id}`)
}

export async function createBooking(eventId: string) {
  return request('/bookings', { method: 'POST', body: JSON.stringify({ eventId }) })
}

export async function pay(bookingId: string) {
  return request('/payments/intent', { method: 'POST', body: JSON.stringify({ bookingId, method: 'mock' }) })
}

export async function myNotifications() {
  return request('/notifications/me')
}

export async function myBookings() {
  return request('/bookings/me')
}

export async function getMe() {
  return request('/profile/me')
}

export async function updateMe(partial: { name?: string }) {
  return request('/profile/me', { method: 'PATCH', body: JSON.stringify(partial) })
}

export async function changePassword(oldPassword: string, newPassword: string) {
  await request('/profile/password', { method: 'POST', body: JSON.stringify({ oldPassword, newPassword }) })
}

export async function requestPasswordReset(email: string) {
  await request('/auth/request-password-reset', { method: 'POST', body: JSON.stringify({ email }) })
}

export async function resetPassword(token: string, newPassword: string) {
  await request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, newPassword }) })
}
