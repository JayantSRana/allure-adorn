import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';
import { Collection } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  return NextResponse.json({ collections: db.collections });
}

export async function POST(req: Request) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  if (!body.name) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 });
  }
  const db = await ensureDatabase();
  const now = new Date().toISOString();

  const isFeatured = Boolean(body.is_featured);
  if (isFeatured) {
    db.collections.forEach((c) => (c.is_featured = false));
  }

  const collection: Collection = {
    id: crypto.randomUUID(),
    name: body.name,
    description: body.description ?? '',
    hero_image: body.hero_image || '/editorial/editorial-1.jpg',
    product_ids: Array.isArray(body.product_ids) ? body.product_ids : [],
    season: body.season || undefined,
    is_featured: isFeatured,
    created_at: now,
    updated_at: now,
  };
  db.collections.push(collection);
  await writeDatabase(db);
  broadcast('SETTINGS_UPDATED', { id: collection.id });
  return NextResponse.json({ collection });
}
