import { Router } from 'express';
import { authMiddleware } from '../services/auth.js';
import { loadDb, saveDb, requireBody } from '../services/db.js';
import { nanoid } from 'nanoid';

const router = Router();

router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { eventId } = requireBody(req.body, ['eventId']);
    const db = await loadDb();
    const event = db.events.find(e => e.id === eventId);
    if (!event) return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    const booking = { id: nanoid(), userId: req.userId, eventId, status: 'confirmed', amount: event.price, createdAt: new Date().toISOString() };
    db.bookings.push(booking);
    await saveDb(db);
    res.status(201).json({ booking });
  } catch (e) { next(e); }
});

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const db = await loadDb();
    const my = db.bookings.filter(b => b.userId === req.userId);
    res.json(my);
  } catch (e) { next(e); }
});

router.get('/:id', authMiddleware, async (req, res, next) => {
  try {
    const db = await loadDb();
    const b = db.bookings.find(x => x.id === req.params.id && x.userId === req.userId);
    if (!b) return res.status(404).json({ error: { code: 404, message: 'Booking not found' } });
    res.json(b);
  } catch (e) { next(e); }
});

export default router;
