'use client';

import ProductGrid from './ProductGrid';
import { Product } from '@/types';
import { useWishlist } from '@/lib/wishlist-context';

export default function WishlistView({ products }: { products: Product[] }) {
  const { ids, hydrated, clear } = useWishlist();
  const saved = products.filter((p) => ids.includes(p.id));

  if (!hydrated) {
    return (
      <p className="py-20 text-center text-sm text-brand-charcoal/50">
        Loading your wishlist…
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-brand-charcoal/60">
          {saved.length} {saved.length === 1 ? 'piece' : 'pieces'} saved
        </p>
        {saved.length > 0 ? (
          <button
            onClick={clear}
            className="text-xs tracking-widest text-brand-burgundy underline"
          >
            CLEAR ALL
          </button>
        ) : null}
      </div>
      <ProductGrid
        products={saved}
        emptyMessage="Your wishlist is empty — tap the heart on any piece to save it."
      />
    </div>
  );
}
