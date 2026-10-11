import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';
import { Order, OrderItem, PaymentMethod, OrderStatus, PaymentStatus } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEMO_TAG = 'DEMO DATA';
const PHONES = [
  '9812345670',
  '9812345670', // repeat customer
  '9812345671',
  '9812345672',
  '9812345673',
  '9812345674',
  '9812345675',
  '9812345676',
  '9812345670', // repeat again
  '9812345677',
  '9812345678',
  '9812345679',
];
const NAMES = [
  'Riya Mehta', 'Riya Mehta', 'Ananya Sharma', 'Karan Patel', 'Meera Nair',
  'Sneha Rao', 'Divya Kapoor', 'Ishita Bose', 'Riya Mehta', 'Tara Singh',
  'Nisha Verma', 'Priya Iyer',
];
const METHODS: PaymentMethod[] = ['RAZORPAY_UPI', 'RAZORPAY_CARD', 'COD', 'RAZORPAY_NETBANKING'];
const CITIES = [
  { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
  { city: 'Delhi', state: 'Delhi', pincode: '110001' },
  { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
  { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
  { city: 'Jaipur', state: 'Rajasthan', pincode: '302001' },
];

function orderNumber(index: number, when: Date): string {
  const yymmdd =
    String(when.getFullYear()).slice(2) +
    String(when.getMonth() + 1).padStart(2, '0') +
    String(when.getDate()).padStart(2, '0');
  return `#AA-${yymmdd}-${String(index).padStart(4, '0')}`;
}

export async function POST() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();

  const products = db.products.filter((p) => p.is_active);
  if (products.length === 0) {
    return NextResponse.json({ error: 'No products to build demo orders from.' }, { status: 400 });
  }

  const now = Date.now();
  const existingCount = db.orders.length;
  const created: Order[] = [];

  PHONES.forEach((phone, i) => {
    const daysAgo = Math.floor((i / PHONES.length) * 14);
    const when = new Date(now - daysAgo * 24 * 60 * 60 * 1000 - (i % 7) * 60 * 60 * 1000);
    const itemCount = 1 + (i % 3);

    const items: OrderItem[] = [];
    for (let k = 0; k < itemCount; k++) {
      const p = products[(i * 3 + k) % products.length];
      const qty = 1 + ((i + k) % 2);
      items.push({
        product_id: p.id,
        slug: p.slug,
        name: p.name,
        image: p.images[0],
        price: p.price,
        cost_price: p.cost_price,
        qty,
        total: p.price * qty,
        total_cost: p.cost_price * qty,
      });
    }

    const subtotal = items.reduce((n, it) => n + it.total, 0);
    const totalCost = items.reduce((n, it) => n + it.total_cost, 0);
    const shippingFee = subtotal >= db.settings.free_shipping_threshold ? 0 : db.settings.shipping_fee_flat;
    const method = METHODS[i % METHODS.length];
    const isCod = method === 'COD';
    // Most are delivered/paid; a couple remain pending.
    const roll = i % 6;
    let status: OrderStatus = 'DELIVERED';
    if (roll === 5) status = 'PENDING_PAYMENT';
    else if (roll === 4) status = 'SHIPPED';
    else if (roll === 3) status = 'PACKED';
    const payment_status: PaymentStatus = status === 'PENDING_PAYMENT' ? 'PENDING' : 'PAID';
    const loc = CITIES[i % CITIES.length];

    const history = [
      { status: 'PENDING_PAYMENT' as OrderStatus, timestamp: when.toISOString(), note: 'Order created' },
    ];
    if (payment_status === 'PAID') {
      history.push({ status: 'PAID', timestamp: when.toISOString(), note: 'Payment confirmed' });
    }
    if (['PACKED', 'SHIPPED', 'DELIVERED'].includes(status)) {
      history.push({ status: 'PACKED', timestamp: when.toISOString(), note: 'Packed' });
    }
    if (['SHIPPED', 'DELIVERED'].includes(status)) {
      history.push({ status: 'SHIPPED', timestamp: when.toISOString(), note: 'Shipped' });
    }
    if (status === 'DELIVERED') {
      history.push({ status: 'DELIVERED', timestamp: when.toISOString(), note: 'Delivered' });
    }

    created.push({
      id: crypto.randomUUID(),
      order_number: orderNumber(existingCount + i + 1, when),
      customer_name: NAMES[i],
      customer_phone: phone,
      customer_email: `${NAMES[i].split(' ')[0].toLowerCase()}@example.com`,
      shipping_address: {
        line1: `${12 + i} Rose Avenue`,
        line2: 'Near City Mall',
        city: loc.city,
        state: loc.state,
        pincode: loc.pincode,
        country: 'India',
      },
      items,
      subtotal,
      discount_percent: 0,
      discount_amount: 0,
      shipping_fee: shippingFee,
      total_amount: subtotal + shippingFee,
      total_cost: totalCost,
      payment_method: method,
      payment_status,
      razorpay_payment_id: isCod ? undefined : `demo_pay_${i}${crypto.randomUUID().slice(0, 6)}`,
      status,
      tracking_number: ['SHIPPED', 'DELIVERED'].includes(status) ? `AWB${100000 + i}` : undefined,
      courier: ['SHIPPED', 'DELIVERED'].includes(status) ? 'Delhivery' : undefined,
      notes: undefined,
      admin_notes: DEMO_TAG,
      refund_status: 'NONE',
      refund_amount: 0,
      status_history: history,
      created_at: when.toISOString(),
      updated_at: when.toISOString(),
    });
  });

  db.orders.push(...created);
  await writeDatabase(db);
  created.forEach((o) => broadcast('ORDER_CREATED', { id: o.id, order_number: o.order_number }));
  return NextResponse.json({ created: created.length });
}

export async function DELETE() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  const before = db.orders.length;
  db.orders = db.orders.filter((o) => o.admin_notes !== DEMO_TAG);
  await writeDatabase(db);
  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ removed: before - db.orders.length });
}
