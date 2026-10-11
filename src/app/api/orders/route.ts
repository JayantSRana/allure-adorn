import { NextResponse } from 'next/server';
import { ensureDatabase, writeDatabase } from '@/lib/db';
import { Order, OrderItem } from '@/types';
import crypto from 'crypto';

export async function POST(req: Request) {
  const body = await req.json();
  const db = await ensureDatabase();
  
  const items = body.items || [];
  const subtotal = items.reduce((sum: number, item: OrderItem) => sum + (item.price * item.qty), 0);
  const shipping_fee = subtotal >= (db.settings.free_shipping_threshold || 3000) ? 0 : (db.settings.shipping_fee_flat || 150);
  const total_amount = subtotal + shipping_fee;
  
  const order: Order = {
    id: crypto.randomUUID(),
    order_number: `#AA-${new Date().toISOString().slice(2,10).replace(/-/g,'')}-${String(db.orders.length + 1).padStart(4,'0')}`,
    customer_name: body.customer_name,
    customer_phone: body.customer_phone,
    customer_email: body.customer_email,
    shipping_address: body.shipping_address,
    billing_address: body.billing_address,
    items: items as OrderItem[],
    subtotal,
    discount_percent: 0,
    discount_amount: 0,
    shipping_fee,
    total_amount,
    total_cost: subtotal,
    payment_method: body.payment_method || 'COD',
    payment_status: 'PENDING',
    status: 'PENDING_PAYMENT',
    refund_status: 'NONE',
    refund_amount: 0,
    status_history: [{
      status: 'PENDING_PAYMENT',
      timestamp: new Date().toISOString(),
      note: 'Order created'
    }],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  
  db.orders.push(order);
  await writeDatabase(db);
  
  return NextResponse.json({ order });
}
