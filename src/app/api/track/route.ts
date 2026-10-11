import { NextResponse } from 'next/server';
import { getOrdersByPhone } from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phone = searchParams.get('phone') || '';
  if (!/^[6-9]\d{9}$/.test(phone)) {
    return NextResponse.json({ orders: [] });
  }
  const orders = await getOrdersByPhone(phone);
  return NextResponse.json({ orders });
}
