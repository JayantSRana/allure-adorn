import { Product } from '@/types';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products,
  emptyMessage = 'No products found.',
}: {
  products: Product[];
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-xl text-brand-charcoal/60">{emptyMessage}</p>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
