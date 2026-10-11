import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';
import { slugify } from '@/lib/store';
import { Product } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  return NextResponse.json({ products: db.products });
}

export async function POST(req: Request) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  const db = await ensureDatabase();

  if (!body.name || !body.category) {
    return NextResponse.json({ error: 'Name and category are required.' }, { status: 400 });
  }

  const now = new Date().toISOString();
  const product: Product = {
    id: crypto.randomUUID(),
    slug: body.slug ? slugify(body.slug) : slugify(body.name),
    name: body.name,
    description_short: body.description_short ?? '',
    description_long: body.description_long ?? '',
    category: body.category,
    sub_category: body.sub_category || undefined,
    price: Number(body.price) || 0,
    compare_at_price: body.compare_at_price ? Number(body.compare_at_price) : undefined,
    cost_price: Number(body.cost_price) || 0,
    images:
      Array.isArray(body.images) && body.images.length > 0
        ? body.images
        : ['/products/product-1.jpg'],
    hover_image: body.hover_image || undefined,
    material: body.material || undefined,
    finish: body.finish || undefined,
    colour: body.colour || undefined,
    care_instructions: body.care_instructions || undefined,
    size_options: Array.isArray(body.size_options) ? body.size_options : [],
    stock: Number(body.stock) || 0,
    is_anti_tarnish: Boolean(body.is_anti_tarnish),
    is_new_arrival: Boolean(body.is_new_arrival),
    is_bestseller: Boolean(body.is_bestseller),
    collection_ids: Array.isArray(body.collection_ids) ? body.collection_ids : [],
    tags: Array.isArray(body.tags) ? body.tags : [],
    rating_avg: 0,
    rating_count: 0,
    is_active: body.is_active ?? true,
    created_at: now,
    updated_at: now,
    dimensions: body.dimensions || undefined,
    weight: body.weight ? Number(body.weight) : undefined,
    fragile: body.fragile ?? undefined,
    room_type: body.room_type || undefined,
  };

  db.products.push(product);
  await writeDatabase(db);
  broadcast('INVENTORY_UPDATED', { id: product.id });
  return NextResponse.json({ product });
}
