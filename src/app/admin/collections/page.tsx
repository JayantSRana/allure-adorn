import { AdminPageHeader } from '@/components/admin/ui';
import CollectionsManager from '@/components/admin/CollectionsManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminCollectionsPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Collections Manager"
        subtitle="Curate seasonal edits, assign products and choose what leads the homepage."
      />
      <CollectionsManager collections={db.collections} products={db.products} />
    </div>
  );
}
