import WishlistView from '@/components/store/WishlistView';
import { SectionHeading } from '@/components/store/DiamondMotif';
import { getActiveProducts } from '@/lib/store';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Wishlist | Allure Adorn',
  robots: { index: false, follow: true },
};

export default async function WishlistPage() {
  const products = await getActiveProducts();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionHeading title="Your Wishlist" subtitle="Pieces you are admiring." />
      <div className="mt-10">
        <WishlistView products={products} />
      </div>
    </div>
  );
}
