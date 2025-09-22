import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import authRouter from './routes/auth.js';
import eventsRouter from './routes/events.js';
import bookingsRouter from './routes/bookings.js';
import paymentsRouter from './routes/payments.js';
import profileRouter from './routes/profile.js';
import notificationsRouter from './routes/notifications.js';
import notificationsRouter from './routes/notifications.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
// Relaxed CORS for development; tighten for production
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({ name: 'TripNest API', status: 'ok' });
});

// Serve API only under /api to avoid collisions with SPA routes
app.use('/api/auth', authRouter);
app.use('/api/events', eventsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/profile', profileRouter);
app.use('/api/notifications', notificationsRouter);

// In production, serve the built frontend and enable SPA fallback for client routes
const staticDir = join(__dirname, '../../frontend/dist');
if (existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    return res.sendFile(join(staticDir, 'index.html'));
  });
}

// Error handler
app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: { code: status, message: err.message || 'Internal error' } });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`TripNest API running at http://localhost:${PORT}`);
});
