import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  const db = await ensureDatabase();
  const collection = db.collections.find((c) => c.id === params.id);
  if (!collection) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });

  if (body.is_featured) {
    db.collections.forEach((c) => (c.is_featured = false));
  }
  for (const [key, value] of Object.entries(body)) {
    if (key === 'id' || key === 'created_at') continue;
    if (key === 'product_ids') {
      collection.product_ids = Array.isArray(value) ? value : [];
    } else if (key === 'is_featured') {
      collection.is_featured = Boolean(value);
    } else {
      (collection as unknown as Record<string, unknown>)[key] = value === '' ? undefined : value;
    }
  }
  collection.updated_at = new Date().toISOString();
  await writeDatabase(db);
  broadcast('SETTINGS_UPDATED', { id: collection.id });
  return NextResponse.json({ collection });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  const idx = db.collections.findIndex((c) => c.id === params.id);
  if (idx < 0) return NextResponse.json({ error: 'Collection not found' }, { status: 404 });
  db.collections.splice(idx, 1);
  await writeDatabase(db);
  broadcast('SETTINGS_UPDATED', { id: params.id });
  return NextResponse.json({ success: true });
}
