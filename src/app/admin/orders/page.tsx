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
      />
      <OrdersTable orders={db.orders} />
    </div>
  );
}
