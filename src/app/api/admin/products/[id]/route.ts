import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';
import { slugify } from '@/lib/store';

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
  const product = db.products.find((p) => p.id === params.id);
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

  const numberFields = ['price', 'compare_at_price', 'cost_price', 'stock', 'weight'];
  const booleanFields = [
    'is_anti_tarnish',
    'is_new_arrival',
    'is_bestseller',
    'is_active',
    'fragile',
  ];
  const arrayFields = ['images', 'size_options', 'collection_ids', 'tags'];

  for (const [key, value] of Object.entries(body)) {
    if (key === 'id' || key === 'slug') continue;
    if (numberFields.includes(key)) {
      (product as unknown as Record<string, unknown>)[key] =
        value === '' || value === null ? undefined : Number(value);
    } else if (booleanFields.includes(key)) {
      (product as unknown as Record<string, unknown>)[key] = Boolean(value);
    } else if (arrayFields.includes(key)) {
      (product as unknown as Record<string, unknown>)[key] = Array.isArray(value) ? value : [];
    } else {
      (product as unknown as Record<string, unknown>)[key] = value === '' ? undefined : value;
    }
  }
  if (body.slug) product.slug = slugify(body.slug);
  product.updated_at = new Date().toISOString();

  await writeDatabase(db);
  broadcast('INVENTORY_UPDATED', { id: product.id });
  return NextResponse.json({ product });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  const idx = db.products.findIndex((p) => p.id === params.id);
  if (idx < 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  db.products.splice(idx, 1);
  await writeDatabase(db);
  broadcast('INVENTORY_UPDATED', { id: params.id });
  return NextResponse.json({ success: true });
}
