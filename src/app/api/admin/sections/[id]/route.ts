import { NextResponse } from 'next/server';
import { mutateDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();

  const updated = await mutateDatabase((db) => {
    const idx = db.sections.findIndex((s) => s.id === params.id);
    if (idx === -1) return null;
    const current = db.sections[idx];
    const next = {
      ...current,
      ...(body.title !== undefined ? { title: body.title } : {}),
      ...(body.subtitle !== undefined ? { subtitle: body.subtitle } : {}),
      ...(body.eyebrow !== undefined ? { eyebrow: body.eyebrow } : {}),
      ...(body.is_enabled !== undefined ? { is_enabled: Boolean(body.is_enabled) } : {}),
      ...(body.order !== undefined ? { order: Number(body.order) } : {}),
      ...(body.config !== undefined
        ? { config: { ...current.config, ...body.config } }
        : {}),
    };
    db.sections[idx] = next;
    return next;
  });

  if (!updated) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ section: updated });
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } },
) {
  const guard = adminGuard();
  if (guard) return guard;

  const ok = await mutateDatabase((db) => {
    const before = db.sections.length;
    db.sections = db.sections
      .filter((s) => s.id !== params.id)
      .sort((a, b) => a.order - b.order)
      .map((s, i) => ({ ...s, order: i }));
    return db.sections.length < before;
  });

  if (!ok) {
    return NextResponse.json({ error: 'Section not found' }, { status: 404 });
  }

  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ ok: true });
}
