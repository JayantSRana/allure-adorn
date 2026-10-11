import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import { ContactMessage } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_LEN = 4000;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const name = String(body.name ?? '').trim();
  const email = String(body.email ?? '').trim();
  const phone = String(body.phone ?? '').trim();
  const message = String(body.message ?? '').trim();

  if (!name) {
    return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 });
  }
  if (!email && !phone) {
    return NextResponse.json(
      { error: 'Please add an email address or phone number so we can reply.' },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }
  if (message.length < 5) {
    return NextResponse.json({ error: 'Please tell us a little more.' }, { status: 400 });
  }
  if (message.length > MAX_LEN) {
    return NextResponse.json({ error: 'Message is too long.' }, { status: 400 });
  }

  const entry: ContactMessage = {
    id: crypto.randomUUID(),
    name,
    email: email || undefined,
    phone: phone || undefined,
    message,
    is_handled: false,
    created_at: new Date().toISOString(),
  };

  await mutateDatabase((db) => {
    db.messages.unshift(entry);
  });

  return NextResponse.json({ success: true, id: entry.id });
}
