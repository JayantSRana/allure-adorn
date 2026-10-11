import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import { broadcast } from '@/lib/realtime';
import { Database, Review } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * A review is only ever marked "verified" when the reviewer's phone number
 * matches an order that was actually paid. New reviews await admin approval.
 */
function phoneHasPaidOrder(db: Database, phone: string): boolean {
  return db.orders.some(
    (o) =>
      o.customer_phone === phone &&
      (o.payment_status === 'PAID' || o.status === 'DELIVERED'),
  );
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const product_id = String(body.product_id ?? '').trim();
  const customer_name = String(body.customer_name ?? '').trim();
  const customer_phone = String(body.customer_phone ?? '').trim();
  const title = String(body.title ?? '').trim().slice(0, 120);
  const reviewBody = String(body.body ?? '').trim();
  const rating = Number(body.rating);

  if (!product_id) {
    return NextResponse.json({ error: 'Missing product.' }, { status: 400 });
  }
  if (!customer_name) {
    return NextResponse.json({ error: 'Please add your name.' }, { status: 400 });
  }
  if (!/^[0-9+\-\s()]{7,15}$/.test(customer_phone)) {
    return NextResponse.json(
      { error: 'Please add a valid phone number (used to verify your purchase).' },
      { status: 400 },
    );
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Please choose a rating.' }, { status: 400 });
  }
  if (reviewBody.length < 5) {
    return NextResponse.json({ error: 'Please write a little more.' }, { status: 400 });
  }

  const created = await mutateDatabase((db) => {
    if (!db.products.some((p) => p.id === product_id)) return null;
    const review: Review = {
      id: crypto.randomUUID(),
      product_id,
      customer_name,
      customer_phone,
      rating,
      title: title || 'A lovely piece',
      body: reviewBody,
      images: [],
      is_verified_purchase: phoneHasPaidOrder(db, customer_phone),
      is_approved: false,
      created_at: new Date().toISOString(),
    };
    db.reviews.unshift(review);
    return review;
  });

  if (!created) {
    return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
  }

  broadcast('REVIEW_ADDED', { id: created.id });
  return NextResponse.json({
    success: true,
    verified: created.is_verified_purchase,
  });
}
