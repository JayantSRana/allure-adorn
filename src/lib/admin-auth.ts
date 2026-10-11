import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const ADMIN_COOKIE = 'allure_admin_auth';

export function isAdminAuthed(): boolean {
  try {
    return cookies().get(ADMIN_COOKIE)?.value === '1';
  } catch {
    return false;
  }
}

/** Returns a 401 response when the caller is not an authenticated admin. */
export function adminGuard(): NextResponse | null {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null;
}
