import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email = String(body.email ?? '').trim().toLowerCase();
  const source = String(body.source ?? 'newsletter').trim().slice(0, 60) || 'newsletter';

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  const result = await mutateDatabase((db) => {
    if (db.subscribers.some((s) => s.email === email)) {
      return { alreadySubscribed: true as const };
    }
    db.subscribers.unshift({
      id: crypto.randomUUID(),
      email,
      source,
      created_at: new Date().toISOString(),
    });
    return { alreadySubscribed: false as const };
  });

  if (result.alreadySubscribed) {
    return NextResponse.json({ success: true, alreadySubscribed: true });
  }
  return NextResponse.json({ success: true, alreadySubscribed: false });
}
