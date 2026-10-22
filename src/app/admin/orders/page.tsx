import Link from 'next/link';
import { FileSpreadsheet } from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/ui';
import OrdersTable from '@/components/admin/OrdersTable';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const db = await ensureDatabase();

  return (
    <div>
      <AdminPageHeader
        title="Orders Ledger"
        subtitle="Search, fulfil and refund every order. New orders appear here live."
        action={
          <Link
            href="/admin/sheets"
            className="inline-flex items-center gap-2 border border-brand-champagne bg-white px-3.5 py-2 text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-burgundy hover:text-brand-burgundy"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-700" />
            Google Sheets Sync
          </Link>
        }
      />
      <OrdersTable orders={db.orders} />
    </div>
  );
}
