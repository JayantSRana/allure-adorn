import { NextRequest, NextResponse } from 'next/server';
import { ensureDatabase, mutateDatabase } from '@/lib/db';
import { isAdminAuthed } from '@/lib/admin-auth';
import {
  createStoreSpreadsheet,
  verifySpreadsheet,
  syncOrdersToSheet,
  syncInventoryToSheet,
  syncInquiriesToSheet,
  extractSpreadsheetId,
} from '@/lib/google-sheets';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = await ensureDatabase();
  return NextResponse.json({
    spreadsheet_id: db.settings.google_sheets_spreadsheet_id || null,
    spreadsheet_name: db.settings.google_sheets_spreadsheet_name || null,
    last_synced: db.settings.google_sheets_last_synced || null,
    orders_count: db.orders.length,
    products_count: db.products.length,
    messages_count: db.messages.length,
    subscribers_count: db.subscribers.length,
    webhook_url: db.settings.google_sheets_webhook_url || null,
  });
}

export async function POST(req: NextRequest) {
  if (!isAdminAuthed()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7)
    : null;

  const body = await req.json();
  const { action } = body;

  if (action === 'unlink') {
    await mutateDatabase((db) => {
      db.settings.google_sheets_spreadsheet_id = undefined;
      db.settings.google_sheets_spreadsheet_name = undefined;
    });
    return NextResponse.json({ success: true, message: 'Google Sheet disconnected' });
  }

  if (!token) {
    return NextResponse.json(
      { error: 'Missing Google authorization token. Please sign in with Google.' },
      { status: 401 },
    );
  }

  const db = await ensureDatabase();

  if (action === 'create') {
    try {
      const title = body.title || 'Allure Adorn — Orders & Boutique Ledger';
      const created = await createStoreSpreadsheet(token, title);

      // Immediately populate initial data
      await syncOrdersToSheet(token, created.spreadsheetId, db.orders);
      await syncInventoryToSheet(token, created.spreadsheetId, db.products);
      await syncInquiriesToSheet(
        token,
        created.spreadsheetId,
        db.messages,
        db.subscribers,
      );

      const now = new Date().toISOString();
      await mutateDatabase((database) => {
        database.settings.google_sheets_spreadsheet_id = created.spreadsheetId;
        database.settings.google_sheets_spreadsheet_name = created.title;
        database.settings.google_sheets_last_synced = now;
      });

      return NextResponse.json({
        success: true,
        spreadsheet_id: created.spreadsheetId,
        spreadsheet_url: created.spreadsheetUrl,
        spreadsheet_name: created.title,
        last_synced: now,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  if (action === 'link') {
    try {
      const rawId = body.spreadsheet_id;
      if (!rawId) {
        return NextResponse.json({ error: 'Spreadsheet ID is required' }, { status: 400 });
      }
      const cleanId = extractSpreadsheetId(rawId);
      const verified = await verifySpreadsheet(token, cleanId);

      await mutateDatabase((database) => {
        database.settings.google_sheets_spreadsheet_id = cleanId;
        database.settings.google_sheets_spreadsheet_name = verified.title;
      });

      return NextResponse.json({
        success: true,
        spreadsheet_id: cleanId,
        spreadsheet_name: verified.title,
        sheets: verified.sheets,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (action === 'sync') {
    const rawId = body.spreadsheet_id || db.settings.google_sheets_spreadsheet_id;
    if (!rawId) {
      return NextResponse.json(
        { error: 'No spreadsheet linked. Create or link one first.' },
        { status: 400 },
      );
    }
    const cleanId = extractSpreadsheetId(rawId);
    const scope = body.scope || 'all'; // 'orders' | 'inventory' | 'inquiries' | 'all'

    try {
      const results: Record<string, number> = {};

      if (scope === 'all' || scope === 'orders') {
        const r = await syncOrdersToSheet(token, cleanId, db.orders);
        results.orders = r.rowsUpdated;
      }
      if (scope === 'all' || scope === 'inventory') {
        const r = await syncInventoryToSheet(token, cleanId, db.products);
        results.inventory = r.rowsUpdated;
      }
      if (scope === 'all' || scope === 'inquiries') {
        const r = await syncInquiriesToSheet(
          token,
          cleanId,
          db.messages,
          db.subscribers,
        );
        results.inquiries = r.rowsUpdated;
      }

      const now = new Date().toISOString();
      await mutateDatabase((database) => {
        database.settings.google_sheets_last_synced = now;
      });

      return NextResponse.json({
        success: true,
        last_synced: now,
        results,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
}
