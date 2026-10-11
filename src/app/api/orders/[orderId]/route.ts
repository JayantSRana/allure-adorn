import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { orderId: string } }
) {
  const db = await ensureDatabase();
  const order = db.orders.find(o => o.id === params.orderId || o.order_number === params.orderId);
  if (!order) {
    return NextResponse.json({ error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ order });
}
