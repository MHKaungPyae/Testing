TripNest — Product & Technical Specification (Spec-Kit)

Last updated: 2025-09-22

## 1. Summary

TripNest is a mobile app prototype for discovering events and booking them with a simple flow. Scope includes:
- User accounts: register, login, profile edit, password change/reset
- Events: view all events
- Bookings: create booking, view booking history
- Payments: mock payment confirmation
- Notifications: in-app success confirmation (push notifications out-of-scope for prototype)
- Backend: simple REST API with file-based storage and JWT auth

Non-goals (prototype): real payment gateway integration, production-grade security hardening, email delivery, push notifications, multi-tenancy, analytics, admin console.

## 2. Personas & Top Stories

- Guest user: Wants to browse events and create an account to book
- Registered user: Wants to book an event, pay, and see booking history

Top user stories:
1) As a guest, I can create an account and login
2) As a user, I can view a list of events
3) As a user, I can book an event and see a confirmation
4) As a user, I can make a mock payment and receive a success notification
5) As a user, I can edit my profile and change my password
6) As a user, I can view my booking history

## 3. Success Metrics (prototype)

- End-to-end booking happy path works locally (login → view events → book → pay → see success)
- Core screens function without crashes
- API returns expected JSON shapes documented below

## 4. System Architecture

- Client: React web app — state via Context; API via fetch
- Server: Node.js + Express — JWT auth; file-based JSON persistence
- Data store: JSON files under `backend/data/`
- Notifications: in-app Snackbar/dialog on success (server responds with status)

## 5. Data Models (simplified)

User
- id: string (uuid)
- name: string
- email: string (unique)
- passwordHash: string (bcrypt)
- createdAt: ISO string

Event
- id: string (uuid)
- title: string
- description: string
- location: string
- date: ISO string
- price: number (minor units or decimal)

Booking
- id: string (uuid)
- userId: string
- eventId: string
- status: enum("pending","confirmed","paid","cancelled")
- amount: number
- createdAt: ISO string

PasswordResetToken
- token: string (uuid)
- userId: string
- expiresAt: ISO string
- used: boolean

## 6. API Design

Auth
- POST /auth/register — { name, email, password } → 201 { id, name, email }
- POST /auth/login — { email, password } → 200 { token, user: { id, name, email } }
- POST /auth/request-password-reset — { email } → 200 { message }
- POST /auth/reset-password — { token, newPassword } → 200 { message }
- POST /auth/change-password — [auth] { oldPassword, newPassword } → 200 { message }

Profile
- GET /profile/me — [auth] → { id, name, email }
- PATCH /profile/me — [auth] { name? } → updated profile

Events
- GET /events — → [ { id, title, description, location, date, price } ]

Bookings
- POST /bookings — [auth] { eventId } → 201 { booking }
- GET /bookings/me — [auth] → [ bookings for current user ]
- GET /bookings/:id — [auth] → { booking }

Payments (mock)
- POST /payments/intent — [auth] { bookingId, method } → 200 { clientSecret, status:"succeeded" }

Auth: Bearer token in Authorization header. JSON responses with `{ error }` on failures.

## 7. Flows

Registration & Login
1) User registers → login automatically or navigate to login
2) Login returns JWT; app stores token in localStorage

View Events
1) App GET /events → shows list

Book & Pay
1) App POST /bookings { eventId }
2) App POST /payments/intent { bookingId, method } → success → show snackbar/dialog

Profile Edit & Password Change
1) GET /profile/me → populate fields
2) PATCH /profile/me to update name
3) POST /auth/change-password to update password

Reset Password (prototype)
1) POST /auth/request-password-reset — server generates token and stores it; returns generic message
2) POST /auth/reset-password with token and new password (token may be retrieved from server logs during prototype)

## 8. Error Handling

- 400: validation errors; 401: unauthenticated; 403: forbidden; 404: not found
- Response shape: { error: { code, message, details? } }

## 9. Security (prototype)

- Passwords hashed with bcryptjs
- JWT secret via env var or default (development only)
- CORS: allow localhost origins (dev)
- Rate limiting, CSRF, email verification: out-of-scope for prototype

## 10. Non-Functional

- Perf: ok for <= 1000 items; JSON file I/O is synchronous per request with locking avoided; acceptable for dev
- Observability: basic console logs

## 11. Open Questions / Future

- Real payments (Stripe) with webhooks
- Push notifications (FCM/APNs)
- Database (Postgres) and migrations
- Email delivery and templates
- Admin CMS for events

## 12. Milestones

M1: Backend endpoints + seed events
M2: Flutter screens for auth, events, booking, history, profile
M3: Payment mock flow + in-app success notification
M4: Polish, docs, smoke tests
