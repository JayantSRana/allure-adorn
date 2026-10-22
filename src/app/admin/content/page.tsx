import { AdminPageHeader } from '@/components/admin/ui';
import ContentManager from '@/components/admin/ContentManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminContentPage() {
  const db = await ensureDatabase();
  const sortedSections = [...db.sections].sort((a, b) => a.order - b.order);

  return (
    <div>
      <AdminPageHeader
        title="Website & Sections"
        subtitle="Add, remove, reorder, and customize homepage sections, hero slides, category cards, banners & badges."
      />
      <ContentManager
        initialSections={sortedSections}
        collections={db.collections}
        products={db.products}
      />
    </div>
  );
}
