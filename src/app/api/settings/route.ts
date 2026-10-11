import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db';

export async function GET() {
  const db = await ensureDatabase();
  const { settings } = db;
  // Only expose non-secret settings to the storefront
  const {
    cod_enabled,
    discount_enabled,
    discount_percent,
    free_shipping_threshold,
    shipping_fee_flat,
    international_shipping_enabled,
    store_open,
  } = settings;
  return NextResponse.json({
    settings: {
      cod_enabled,
      discount_enabled,
      discount_percent,
      free_shipping_threshold,
      shipping_fee_flat,
      international_shipping_enabled,
      store_open,
    },
  });
}
