import { Database, SystemSettings } from '@/types';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../../data/db.json');

const DEFAULT_SETTINGS: SystemSettings = {
  store_open: true,
  admin_pin: '0314',
  staff_pin: '0314',
  cod_enabled: true,
  discount_enabled: false,
  discount_percent: 0,
  discount_code: undefined,
  free_shipping_threshold: 3000,
  shipping_fee_flat: 150,
  international_shipping_enabled: false,
  google_sheets_webhook_url: undefined,
  whatsapp_number: undefined,
  instagram_handle: 'allureadorn',
  announcement_bar_text: '✨ Worldwide Shipping Available | Free shipping above ₹3000 ✨',
  announcement_bar_enabled: true,
};

const DEFAULT_DB: Database = {
  products: [],
  collections: [],
  orders: [],
  customers: [],
  reviews: [],
  settings: DEFAULT_SETTINGS,
};

export async function ensureDatabase(): Promise<Database> {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      const parsed = JSON.parse(raw) as Database;
      return parsed;
    }
  } catch {
    // ignore and return default
  }
  await writeDatabase(DEFAULT_DB);
  return DEFAULT_DB;
}

export async function writeDatabase(db: Database): Promise<void> {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch {
    // ignore
  }
}
