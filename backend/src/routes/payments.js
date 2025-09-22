import { Router } from 'express';
import { authMiddleware } from '../services/auth.js';
import { loadDb, saveDb, requireBody } from '../services/db.js';

const router = Router();

router.post('/intent', authMiddleware, async (req, res, next) => {
  try {
    const { bookingId, method } = requireBody(req.body, ['bookingId','method']);
    const db = await loadDb();
    const booking = db.bookings.find(b => b.id === bookingId && b.userId === req.userId);
    if (!booking) return res.status(404).json({ error: { code: 404, message: 'Booking not found' } });
    booking.status = 'paid';
    await saveDb(db);
    res.json({ clientSecret: `mock_${bookingId}`, status: 'succeeded' });
  } catch (e) { next(e); }
});

export default router;
