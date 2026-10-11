import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { slug: string } }
) {
  const db = await ensureDatabase();
  const product = db.products.find(p => p.slug === params.slug && p.is_active);
  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }
  return NextResponse.json({ product });
}
