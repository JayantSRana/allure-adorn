import { Database, SystemSettings } from '@/types';

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
  return DEFAULT_DB;
}

export async function writeDatabase(_db: Database): Promise<void> {
  void _db;
  // In production, this would sync to Redis/KV with atomic locking
  // For now, just a no-op stub - actual implementation would write to data/db.json
}
