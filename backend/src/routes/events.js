import { Router } from 'express';
import { loadDb } from '../services/db.js';

const router = Router();

router.get('/', async (_req, res, next) => {
  try {
    const db = await loadDb();
    res.json(db.events);
  } catch (e) { next(e); }
});

export default router;
