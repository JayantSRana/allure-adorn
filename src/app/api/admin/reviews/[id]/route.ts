import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Auto-verifies a review against paid orders by matching the reviewer's
 * phone number. Only a paid order ever marks a review verified.
 */
function phoneHasPaidOrder(
  db: Awaited<ReturnType<typeof ensureDatabase>>,
  phone: string,
): boolean {
  return db.orders.some(
    (o) =>
      o.customer_phone === phone &&
      (o.payment_status === 'PAID' || o.status === 'DELIVERED'),
  );
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  const db = await ensureDatabase();
  const review = db.reviews.find((r) => r.id === params.id);
  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 });

  if (body.action === 'reverify') {
    review.is_verified_purchase = phoneHasPaidOrder(db, review.customer_phone);
  }
  if (typeof body.is_approved === 'boolean') review.is_approved = body.is_approved;
  if (typeof body.is_verified_purchase === 'boolean') {
    review.is_verified_purchase = body.is_verified_purchase;
  }

  await writeDatabase(db);
  broadcast('REVIEW_ADDED', { id: review.id });
  return NextResponse.json({ review });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  const idx = db.reviews.findIndex((r) => r.id === params.id);
  if (idx < 0) return NextResponse.json({ error: 'Review not found' }, { status: 404 });
  db.reviews.splice(idx, 1);
  await writeDatabase(db);
  broadcast('REVIEW_ADDED', { id: params.id });
  return NextResponse.json({ success: true });
}
