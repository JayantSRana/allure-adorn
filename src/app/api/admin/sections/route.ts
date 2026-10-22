import { NextResponse } from 'next/server';
import { ensureDatabase, mutateDatabase } from '@/lib/db';
import { adminGuard } from '@/lib/admin-auth';
import { broadcast } from '@/lib/realtime';
import { createDefaultSection, SEED_SECTIONS } from '@/lib/seed-sections';
import { HomepageSection, SectionType } from '@/types';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const guard = adminGuard();
  if (guard) return guard;
  const db = await ensureDatabase();
  const sections = [...db.sections].sort((a, b) => a.order - b.order);
  return NextResponse.json({ sections });
}

export async function POST(req: Request) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();
  const type = (body.type || 'PROMO_BANNER') as SectionType;

  const created = await mutateDatabase((db) => {
    const maxOrder = db.sections.reduce((max, s) => Math.max(max, s.order), -1);
    const id = `sec-${crypto.randomBytes(4).toString('hex')}`;
    const newSec = createDefaultSection(type, maxOrder + 1, id);
    if (body.title) newSec.title = body.title;
    if (body.subtitle !== undefined) newSec.subtitle = body.subtitle;
    db.sections.push(newSec);
    return newSec;
  });

  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ section: created });
}

export async function PUT(req: Request) {
  const guard = adminGuard();
  if (guard) return guard;
  const body = await req.json();

  const updated = await mutateDatabase((db) => {
    if (body.reset) {
      db.sections = JSON.parse(JSON.stringify(SEED_SECTIONS));
      return db.sections;
    }
    if (Array.isArray(body.sections)) {
      db.sections = (body.sections as HomepageSection[]).map((s, idx) => ({
        ...s,
        order: idx,
      }));
    }
    return db.sections;
  });

  broadcast('SETTINGS_UPDATED', {});
  return NextResponse.json({ sections: updated });
}
