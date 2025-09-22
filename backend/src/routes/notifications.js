import { Router } from 'express';
import { authMiddleware } from '../services/auth.js';
import { loadDb } from '../services/db.js';

const router = Router();

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const db = await loadDb();
    const list = (db.notifications || []).filter(n => n.userId === req.userId).sort((a,b) => b.createdAt.localeCompare(a.createdAt));
    res.json(list);
  } catch (e) { next(e); }
});

export default router;
