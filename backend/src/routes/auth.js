import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';
import { loadDb, saveDb, findUserByEmail, requireBody } from '../services/db.js';
import { authMiddleware } from '../services/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

router.post('/register', async (req, res, next) => {
  try {
    const { name, email, password } = requireBody(req.body, ['name','email','password']);
    const db = await loadDb();
    if (findUserByEmail(db, email)) return res.status(400).json({ error: { code: 400, message: 'Email already registered' } });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = { id: nanoid(), name, email, passwordHash, createdAt: new Date().toISOString() };
    db.users.push(user);
    await saveDb(db);
    res.status(201).json({ id: user.id, name: user.name, email: user.email });
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = requireBody(req.body, ['email','password']);
    const db = await loadDb();
    const user = findUserByEmail(db, email);
    if (!user) return res.status(401).json({ error: { code: 401, message: 'Invalid credentials' } });
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: { code: 401, message: 'Invalid credentials' } });
    const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) { next(e); }
});

router.post('/request-password-reset', async (req, res, next) => {
  try {
    const { email } = requireBody(req.body, ['email']);
    const db = await loadDb();
    const user = findUserByEmail(db, email);
    if (user) {
      const token = nanoid();
      const expiresAt = new Date(Date.now() + 1000*60*15).toISOString();
      db.passwordResets.push({ token, userId: user.id, expiresAt, used: false });
      await saveDb(db);
      console.log(`[TripNest] Password reset token for ${email}: ${token} (valid 15m)`);
    }
    res.json({ message: 'If the email exists, you will receive reset instructions.' });
  } catch (e) { next(e); }
});

router.post('/reset-password', async (req, res, next) => {
  try {
    const { token, newPassword } = requireBody(req.body, ['token','newPassword']);
    const db = await loadDb();
    const pr = db.passwordResets.find(r => r.token === token && !r.used);
    if (!pr) return res.status(400).json({ error: { code: 400, message: 'Invalid reset token' } });
    if (new Date(pr.expiresAt).getTime() < Date.now()) return res.status(400).json({ error: { code: 400, message: 'Reset token expired' } });
    const user = db.users.find(u => u.id === pr.userId);
    if (!user) return res.status(400).json({ error: { code: 400, message: 'User not found' } });
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    pr.used = true;
    await saveDb(db);
    res.json({ message: 'Password reset successful' });
  } catch (e) { next(e); }
});

// Alias change-password in auth scope for spec compatibility
router.post('/change-password', authMiddleware, async (req, res, next) => {
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
