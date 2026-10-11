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

      <div className="mt-10 max-w-2xl border border-brand-champagne bg-white/50 p-5 text-sm text-brand-charcoal/70">
        <h3 className="font-serif text-lg text-brand-charcoal">Integration Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
          <li><strong>Razorpay keys</strong> — add <code>RAZORPAY_KEY_ID</code> and <code>RAZORPAY_KEY_SECRET</code> in your environment to enable live payments; online checkout currently runs in demo mode.</li>
          <li><strong>Upstash / Vercel KV</strong> — set <code>UPSTASH_REDIS_REST_URL</code> and <code>UPSTASH_REDIS_REST_TOKEN</code> to sync this database to the cloud automatically.</li>
          <li><strong>Google Sheets webhook</strong> — paste your Apps Script URL above to mirror new orders to a spreadsheet.</li>
          <li><strong>Web Push (VAPID)</strong> — set <code>NEXT_PUBLIC_VAPID_PUBLIC_KEY</code> and <code>VAPID_PRIVATE_KEY</code> to enable new-order alerts on staff devices.</li>
        </ul>
      </div>
    </div>
  );
}
