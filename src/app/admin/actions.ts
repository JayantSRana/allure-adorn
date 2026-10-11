'use server';

import { cookies } from 'next/headers';
import { ensureDatabase } from '@/lib/db';
import { ADMIN_COOKIE } from '@/lib/admin-auth';

export async function verifyAdminPin(
  pin: string,
): Promise<{ ok: boolean; error?: string }> {
  const clean = pin.trim();
  if (!/^\d{4,8}$/.test(clean)) {
    return { ok: false, error: 'Enter your PIN.' };
  }
  const db = await ensureDatabase();
  const valid = clean === db.settings.admin_pin || clean === db.settings.staff_pin;
  if (!valid) return { ok: false, error: 'Incorrect PIN.' };

  cookies().set(ADMIN_COOKIE, '1', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
  return { ok: true };
}

export async function logoutAdmin(): Promise<void> {
  cookies().delete(ADMIN_COOKIE);
}
