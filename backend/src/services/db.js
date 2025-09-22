import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataDir = join(__dirname, '../../data');
const dbPath = join(dataDir, 'db.json');

async function ensureDb() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
    await fs.access(dbPath);
  } catch {
    const seed = {
      users: [],
      events: [
        { id: 'ev_1', title: 'City Walking Tour', description: 'Explore the city highlights', location: 'Downtown', date: new Date(Date.now()+86400000).toISOString(), price: 2000 },
        { id: 'ev_2', title: 'Museum Night', description: 'Exclusive after-hours museum access', location: 'Museum Ave', date: new Date(Date.now()+172800000).toISOString(), price: 3500 },
        { id: 'ev_3', title: 'Wine Tasting', description: 'Local vineyard experience', location: 'Vine Valley', date: new Date(Date.now()+259200000).toISOString(), price: 5000 }
      ],
      bookings: [],
      passwordResets: []
    };
    await fs.writeFile(dbPath, JSON.stringify(seed, null, 2), 'utf-8');
  }
}

export async function loadDb() {
  await ensureDb();
  const raw = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(raw);
}

export async function saveDb(db) {
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2), 'utf-8');
}

export function findUserByEmail(db, email) {
  const e = String(email || '').toLowerCase();
  return db.users.find(u => u.email.toLowerCase() === e);
}

export function requireBody(body, keys) {
  if (!body || typeof body !== 'object') throw Object.assign(new Error('Invalid body'), { status: 400 });
  for (const k of keys) {
    if (!(k in body)) throw Object.assign(new Error(`Missing body field: ${k}`), { status: 400 });
  }
  return body;
}
