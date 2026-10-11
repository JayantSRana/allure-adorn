import { AdminPageHeader } from '@/components/admin/ui';
import ReviewsManager from '@/components/admin/ReviewsManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Reviews Moderation"
        subtitle="Approve genuine reviews, auto-verify against paid orders, and remove spam."
      />
      <ReviewsManager reviews={db.reviews} products={db.products} />
    </div>
  );
}
