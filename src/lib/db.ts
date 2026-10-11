import { Database, SystemSettings } from '@/types';
import { SEED_PRODUCTS, SEED_COLLECTIONS, SEED_REVIEWS } from './seed-catalog';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');
const DB_KEY = 'allure_adorn_db';

export const DEFAULT_SETTINGS: SystemSettings = {
  store_open: true,
  admin_pin: '0314',
  staff_pin: '0314',
  cod_enabled: true,
  discount_enabled: false,
  discount_percent: 0,
  discount_code: undefined,
  free_shipping_threshold: 3000,
  shipping_fee_flat: 150,
  international_shipping_enabled: true,
  google_sheets_webhook_url: undefined,
  whatsapp_number: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
  instagram_handle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'allureadorn',
  announcement_bar_text: '✨ Worldwide Shipping Available | Free Shipping Above ₹3000 ✨',
  announcement_bar_enabled: true,
};

export function freshDatabase(): Database {
  return {
    products: JSON.parse(JSON.stringify(SEED_PRODUCTS)),
    collections: JSON.parse(JSON.stringify(SEED_COLLECTIONS)),
    orders: [],
    customers: [],
    reviews: JSON.parse(JSON.stringify(SEED_REVIEWS)),
    settings: { ...DEFAULT_SETTINGS },
  };
}

/* ------------------------------------------------------------------ *
 *  Remote layer (Upstash Redis / Vercel KV REST API) — optional.
 *  If credentials are present, Redis becomes the source of truth and
 *  the local file is kept as an auto-syncing fallback.
 * ------------------------------------------------------------------ */

function redisConfig(): { url: string; token: string } | null {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (url && token) return { url, token };
  return null;
}

async function redisGet(): Promise<Database | null> {
  const cfg = redisConfig();
  if (!cfg) return null;
  try {
    const res = await fetch(`${cfg.url}/get/${DB_KEY}`, {
      headers: { Authorization: `Bearer ${cfg.token}` },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { result?: string | null };
    if (!json.result) return null;
    return JSON.parse(json.result) as Database;
  } catch {
    return null;
  }
}

async function redisSet(db: Database): Promise<void> {
  const cfg = redisConfig();
  if (!cfg) return;
  try {
    await fetch(`${cfg.url}/set/${DB_KEY}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${cfg.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(db)),
    });
  } catch {
    // best-effort; local file remains the fallback
  }
}

/* ------------------------------------------------------------------ *
 *  Local file layer with a simple async mutex to avoid write races.
 * ------------------------------------------------------------------ */

let lock: Promise<void> = Promise.resolve();

function withLock<T>(fn: () => Promise<T> | T): Promise<T> {
  const run = lock.then(fn, fn);
  lock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function readLocal(): Database | null {
  try {
    if (!fs.existsSync(DB_PATH)) return null;
    const raw = fs.readFileSync(DB_PATH, 'utf8');
    const parsed = JSON.parse(raw) as Database;
    if (!parsed.products || parsed.products.length === 0) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeLocal(db: Database): void {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // read-only filesystem (e.g. Vercel) — Redis is the fallback
  }
}

/* ------------------------------------------------------------------ *
 *  Public API
 * ------------------------------------------------------------------ */

export async function ensureDatabase(): Promise<Database> {
  const remote = await redisGet();
  if (remote && remote.products && remote.products.length > 0) {
    writeLocal(remote);
    return remote;
  }
  const local = readLocal();
  if (local) return local;
  const seeded = freshDatabase();
  writeLocal(seeded);
  await redisSet(seeded);
  return seeded;
}

export async function writeDatabase(db: Database): Promise<void> {
  await withLock(async () => {
    writeLocal(db);
    await redisSet(db);
  });
}

export async function mutateDatabase<T>(
  fn: (db: Database) => T | Promise<T>,
): Promise<T> {
  return withLock(async () => {
    const db = await ensureDatabase();
    const result = await fn(db);
    writeLocal(db);
    await redisSet(db);
    return result;
  });
}
