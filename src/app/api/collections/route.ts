import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db';

export async function GET() {
  const db = await ensureDatabase();
  return NextResponse.json({ collections: db.collections });
}
