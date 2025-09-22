TripNest — React Web App with Node.js Backend

This repository contains:
- `frontend/` — React (Vite + TypeScript) web app
- `backend/` — Node.js + Express REST API with file-based storage
- `spec.md` — Product & Technical specification (Spec-Kit)

Core features:
- Register and login
- View events
- Book events and make a mock payment
- Notification of successful booking (in-app)
- Profile editing (name)
- Password reset and change
- View booking history

## Prerequisites

- Node.js 18+

## Quickstart

Backend
1) Install dependencies and run:

```
cd backend
npm install
npm run dev
```

Backend runs at http://localhost:4000

Web app
1) Install dependencies and run:

```
cd frontend
npm install
VITE_API_BASE_URL=http://localhost:4000 npm run dev
```

Open the printed local URL (default http://localhost:5173/).
By default, the web app calls the backend via a dev proxy at `/api` (configured in `vite.config.ts`).
If you prefer direct calls without proxy (e.g., for production), set `VITE_API_BASE_URL` to your backend URL.

## Folder Structure

- backend/
	- src/
		- index.js — server entry
		- routes/ — endpoint routers
		- services/ — business logic & storage helpers
		- middleware/ — auth
	- data/ — JSON storage
	- package.json

- frontend/
	- src/
		- auth/ — AuthContext
		- lib/ — api.ts (API client)
		- pages/ — React pages (Login, Register, Events, History, Profile, PasswordReset)
		- App.tsx, main.tsx

## Docs

See `spec.md` for full API and flows. For a write-up on how Copilot was used on this project, read `reflection.md`.

## Notes

This is a prototype for local development and demos only; not production-ready.
# Testing