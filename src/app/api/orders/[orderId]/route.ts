import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { broadcast } from '@/lib/realtime';
import { isAdminAuthed } from '@/lib/admin-auth';
import { OrderStatus } from '@/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function findOrder(db: Awaited<ReturnType<typeof ensureDatabase>>, key: string) {
  return db.orders.find(
    (o) => o.id === key || o.order_number === key || o.order_number === `#${key}`,
  );
}

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } },
) {
  const db = await ensureDatabase();
  const order = findOrder(db, params.orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  return NextResponse.json({ order });
}

/**
 * Confirms payment (simulated gateway callback for demo) OR lets admin
 * advance status. `action: "PAY"` marks a PENDING_PAYMENT order as paid.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { orderId: string } },
) {
  const body = await req.json();
  const db = await ensureDatabase();
  const order = findOrder(db, params.orderId);
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  const now = new Date().toISOString();

  if (body.action === 'PAY') {
    order.payment_status = 'PAID';
    order.status = 'PAID';
    order.razorpay_payment_id = order.razorpay_payment_id || `demo_pay_${now}`;
    order.status_history.push({ status: 'PAID', timestamp: now, note: 'Payment confirmed' });
    order.updated_at = now;
    await writeDatabase(db);
    broadcast('ORDER_PAID', { id: order.id, order_number: order.order_number });
    return NextResponse.json({ order });
  }

  if (body.status) {
    if (!isAdminAuthed()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const status = body.status as OrderStatus;
    order.status = status;
    if (status === 'SHIPPED') {
      order.tracking_number = body.tracking_number || order.tracking_number;
      order.courier = body.courier || order.courier;
      broadcast('ORDER_SHIPPED', { id: order.id, order_number: order.order_number });
    } else {
      broadcast('ORDER_UPDATED', { id: order.id, order_number: order.order_number, status });
    }
    order.status_history.push({ status, timestamp: now, note: body.note });
    order.updated_at = now;
    await writeDatabase(db);
    return NextResponse.json({ order });
  }

  if (body.refund || body.admin_notes !== undefined || body.delete) {
    if (!isAdminAuthed()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (body.delete) {
      const idx = db.orders.findIndex((o) => o.id === order.id);
      db.orders.splice(idx, 1);
      await writeDatabase(db);
      broadcast('ORDER_UPDATED', { id: order.id, deleted: true });
      return NextResponse.json({ deleted: true });
    }

    if (body.admin_notes !== undefined) {
      order.admin_notes = body.admin_notes;
    }
    if (body.refund) {
      order.refund_status = body.refund.status;
      order.refund_amount = Number(body.refund.amount) || 0;
      order.refund_reason = body.refund.reason;
      order.refund_notes = body.refund.notes;
      if (body.refund.status === 'REFUNDED') {
        order.payment_status = 'REFUNDED';
        order.status = 'RETURNED';
        order.status_history.push({
          status: 'RETURNED',
          timestamp: now,
          note: `Refunded ${order.refund_amount}`,
        });
      } else if (body.refund.status === 'NEEDS_REFUND') {
        order.status_history.push({
          status: order.status,
          timestamp: now,
          note: 'Flagged for refund',
        });
      }
    }
    order.updated_at = now;
    await writeDatabase(db);
    broadcast('ORDER_UPDATED', { id: order.id, order_number: order.order_number });
    return NextResponse.json({ order });
  }

  return NextResponse.json({ error: 'No action specified' }, { status: 400 });
}
