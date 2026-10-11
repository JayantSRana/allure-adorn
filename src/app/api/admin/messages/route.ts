import { NextResponse } from 'next/server';
import { ensureDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  return NextResponse.json({ messages: db.messages });
}
