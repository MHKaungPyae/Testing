import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authMiddleware } from '../services/auth.js';
import { loadDb, saveDb, requireBody } from '../services/db.js';

const router = Router();

router.get('/me', authMiddleware, async (req, res, next) => {
  try {
    const db = await loadDb();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: { code: 404, message: 'User not found' } });
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) { next(e); }
});

router.patch('/me', authMiddleware, async (req, res, next) => {
  try {
    const db = await loadDb();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: { code: 404, message: 'User not found' } });
    const { name } = req.body;
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    await saveDb(db);
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (e) { next(e); }
});

router.post('/password', authMiddleware, async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = requireBody(req.body, ['oldPassword','newPassword']);
    const db = await loadDb();
    const user = db.users.find(u => u.id === req.userId);
    if (!user) return res.status(404).json({ error: { code: 404, message: 'User not found' } });
    const ok = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!ok) return res.status(400).json({ error: { code: 400, message: 'Old password incorrect' } });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await saveDb(db);
    res.json({ message: 'Password changed successfully' });
  } catch (e) { next(e); }
});

export default router;
