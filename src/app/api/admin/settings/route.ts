import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  return NextResponse.json({ settings: db.settings });
}

export async function PATCH(req: Request) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  const db = await ensureDatabase();
  const booleanFields = [
    'store_open',
    'cod_enabled',
    'discount_enabled',
    'international_shipping_enabled',
    'announcement_bar_enabled',
  ];
  const numberFields = [
    'discount_percent',
    'free_shipping_threshold',
    'shipping_fee_flat',
  ];

  for (const [key, value] of Object.entries(body)) {
    if (!(key in db.settings)) continue;
    if (booleanFields.includes(key)) {
      (db.settings as unknown as Record<string, unknown>)[key] = Boolean(value);
    } else if (numberFields.includes(key)) {
      (db.settings as unknown as Record<string, unknown>)[key] = Number(value) || 0;
    } else {
      (db.settings as unknown as Record<string, unknown>)[key] = value === '' ? undefined : value;
    }
  }

  await writeDatabase(db);
  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ settings: db.settings });
}
