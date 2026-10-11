import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json().catch(() => ({}));

  const found = await mutateDatabase((db) => {
    const msg = db.messages.find((m) => m.id === params.id);
    if (!msg) return false;
    if (typeof body.is_handled === 'boolean') msg.is_handled = body.is_handled;
    return true;
  });

  if (!found) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;

  const found = await mutateDatabase((db) => {
    const idx = db.messages.findIndex((m) => m.id === params.id);
    if (idx < 0) return false;
    db.messages.splice(idx, 1);
    return true;
  });

  if (!found) return NextResponse.json({ error: 'Message not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
