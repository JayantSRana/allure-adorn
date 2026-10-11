import { AdminPageHeader } from '@/components/admin/ui';
import ProductsManager from '@/components/admin/ProductsManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminHomeDecorPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Home Decor Manager"
        subtitle="Candles, vases, wall art and tablescape pieces, with room and fragility details."
      />
      <ProductsManager
        products={db.products}
        collections={db.collections}
        scope="home-decor"
      />
    </div>
  );
}
