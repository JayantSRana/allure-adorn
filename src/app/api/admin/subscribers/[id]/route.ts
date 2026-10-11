import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;

  const found = await mutateDatabase((db) => {
    const idx = db.subscribers.findIndex((s) => s.id === params.id);
    if (idx < 0) return false;
    db.subscribers.splice(idx, 1);
    return true;
  });

  if (!found) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
