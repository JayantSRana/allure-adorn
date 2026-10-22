import { AdminPageHeader } from '@/components/admin/ui';
import SettingsForm from '@/components/admin/SettingsForm';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

const FIELDS = [
  'announcement_bar_enabled',
  'announcement_bar_text',
  'whatsapp_number',
  'instagram_handle',
  'google_sheets_webhook_url',
  'admin_pin',
  'staff_pin',
] as const;

export default async function AdminSettingsPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Settings"
        subtitle="Store identity, contact channels, access PINs and integrations."
      />
      <SettingsForm initial={db.settings} fields={[...FIELDS]} title="Store Settings" />

      <div className="mt-8 max-w-2xl border border-brand-champagne bg-white/70 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-lg text-brand-charcoal">Google Sheets Sync</h3>
            <p className="mt-1 text-xs text-brand-charcoal/65">
              Sync orders, inventory counts, and customer inquiries directly to a Google Drive spreadsheet via Google OAuth.
            </p>
          </div>
          <a
            href="/admin/sheets"
            className="inline-flex items-center gap-1.5 bg-brand-burgundy px-3.5 py-2 text-xs uppercase tracking-widest text-white hover:bg-brand-charcoal"
          >
            Manage Sheets
          </a>
        </div>
      </div>

      <div className="mt-6 max-w-2xl border border-brand-champagne bg-white/50 p-5 text-sm text-brand-charcoal/70">
        <h3 className="font-serif text-lg text-brand-charcoal">Integration Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
          <li><strong>Google Sheets OAuth Sync</strong> — connect your Google account in <a href="/admin/sheets" className="underline hover:text-brand-burgundy">Google Sheets</a> to create or mirror orders, catalogue inventory, and customer leads.</li>
          <li><strong>Razorpay keys</strong> — add <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in your environment to enable live payments; online checkout currently runs in demo mode.</li>
          <li><strong>Upstash / Vercel KV</strong> — set <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> to sync this database to the cloud automatically.</li>
          <li><strong>Google Sheets webhook</strong> — optional Apps Script URL fallback above to mirror new orders to a legacy spreadsheet webhook.</li>
          <li><strong>Web Push (VAPID)</strong> — set <code>NEXT_PUBLIC_VAPID_PUBLIC_KEY</code> and <code>VAPID_PRIVATE_KEY</code> to enable new-order alerts on staff devices.</li>
        </ul>
      </div>
    </div>
  );
}
