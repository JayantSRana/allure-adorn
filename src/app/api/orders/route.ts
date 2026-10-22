import { NextResponse } from 'next/server';
import { ensureDatabase, mutateDatabase } from '@/lib/db';
import { broadcast } from '@/lib/realtime';
import { Order, OrderItem } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const db = await ensureDatabase();
  return NextResponse.json({ orders: db.orders });
}

function orderNumber(db: { orders: Order[] }): string {
  const d = new Date();
  const yymmdd =
    String(d.getFullYear()).slice(2) +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0');
  const seq = String(db.orders.length + 1).padStart(4, '0');
  return `#AA-${yymmdd}-${seq}`;
}

export async function POST(req: Request) {
  const body = await req.json();

  const rawItems = (body.items || []) as (OrderItem & { size?: string })[];
  if (rawItems.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
  }

  const items: OrderItem[] = rawItems.map((i) => ({
    product_id: i.product_id,
    slug: i.slug,
    name: i.name,
    image: i.image,
    price: i.price,
    cost_price: i.cost_price,
    qty: i.qty,
    total: i.price * i.qty,
    total_cost: i.cost_price * i.qty,
  }));

  const subtotal = items.reduce((n, i) => n + i.total, 0);
  const totalCost = items.reduce((n, i) => n + i.total_cost, 0);

  const paymentMethod =
    body.payment_method === 'RAZORPAY_UPI' ? 'RAZORPAY_UPI' : 'COD';
  const paidNow = paymentMethod === 'RAZORPAY_UPI';

  const order = await mutateDatabase((db) => {
    const discountEnabled = db.settings.discount_enabled;
    const discount_percent = discountEnabled ? db.settings.discount_percent : 0;
    const discount_amount = Math.round((subtotal * discount_percent) / 100);
    const afterDiscount = subtotal - discount_amount;

    const shipping_fee =
      afterDiscount >= db.settings.free_shipping_threshold
        ? 0
        : db.settings.shipping_fee_flat;
    const total_amount = afterDiscount + shipping_fee;

    const now = new Date().toISOString();
    const created: Order = {
      id: crypto.randomUUID(),
      order_number: orderNumber(db),
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_email: body.customer_email,
      shipping_address: body.shipping_address,
      billing_address: body.billing_address,
      items,
      subtotal,
      discount_percent,
      discount_amount,
      discount_code: db.settings.discount_code,
      shipping_fee,
      total_amount,
      total_cost: totalCost,
      payment_method: paymentMethod,
      payment_status: paidNow ? 'PAID' : 'PENDING',
      razorpay_order_id: paidNow
        ? `demo_order_${crypto.randomUUID().slice(0, 8)}`
        : undefined,
      razorpay_payment_id: paidNow
        ? `demo_pay_${crypto.randomUUID().slice(0, 8)}`
        : undefined,
      status: paidNow ? 'PAID' : 'PENDING_PAYMENT',
      tracking_number: undefined,
      courier: undefined,
      notes: body.notes,
      admin_notes: paidNow ? 'Paid online (demo gateway).' : undefined,
      refund_status: 'NONE',
      refund_amount: 0,
      status_history: [
        { status: 'PENDING_PAYMENT', timestamp: now, note: 'Order created' },
        ...(paidNow
          ? [
              {
                status: 'PAID' as const,
                timestamp: now,
                note: 'Payment confirmed (demo)',
              },
            ]
          : []),
      ],
      created_at: now,
      updated_at: now,
    };

    db.orders.push(created);

    // Decrement stock
    for (const item of items) {
      const p = db.products.find((x) => x.id === item.product_id);
      if (p) p.stock = Math.max(0, p.stock - item.qty);
    }

    return created;
  });

  broadcast('ORDER_CREATED', { id: order.id, order_number: order.order_number });
  if (paidNow)
    broadcast('ORDER_PAID', { id: order.id, order_number: order.order_number });

  return NextResponse.json({ order });
}

