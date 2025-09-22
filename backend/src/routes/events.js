import { Router } from 'express';
import { loadDb } from '../services/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const db = await loadDb();
    res.json(db.events);
  } catch (e) { next(e); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const db = await loadDb();
    const ev = db.events.find(e => e.id === req.params.id);
    if (!ev) return res.status(404).json({ error: { code: 404, message: 'Event not found' } });
    res.json(ev);
  } catch (e) { next(e); }
});

export default router;
