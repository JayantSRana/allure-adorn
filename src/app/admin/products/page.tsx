import { AdminPageHeader } from '@/components/admin/ui';
import ProductsManager from '@/components/admin/ProductsManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Products & Inventory"
        subtitle="Manage the full catalogue, pricing, stock and merchandising flags."
      />
      <ProductsManager products={db.products} collections={db.collections} />
    </div>
  );
}
