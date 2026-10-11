import Link from 'next/link';
import ProductGrid from '@/components/store/ProductGrid';
import { SectionHeading } from '@/components/store/DiamondMotif';
import {
  getActiveProducts,
  searchProducts,
} from '@/lib/store';
import { CATEGORY_LABELS } from '@/lib/format';
import { Product, ProductCategory } from '@/types';

export const dynamic = 'force-dynamic';

const CATEGORY_TABS: { label: string; href: string }[] = [
  { label: 'All', href: '/shop' },
  { label: 'Earrings', href: '/shop?category=EARRINGS' },
  { label: 'Necklaces', href: '/shop?category=NECKLACES' },
  { label: 'Rings', href: '/shop?category=RINGS' },
  { label: 'Bangles', href: '/bangles' },
  { label: 'Home Decor', href: '/home-decor' },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { category?: string; q?: string; filter?: string; sort?: string };
}) {
  const { category, q, filter, sort } = searchParams;
  let products: Product[] = [];
  let title = 'The Boutique';

  if (q) {
    products = await searchProducts(q);
    title = `Search: “${q}”`;
  } else {
    products = await getActiveProducts();
    if (filter === 'new') {
      products = products.filter((p) => p.is_new_arrival);
      title = 'New Arrivals';
    } else if (filter === 'bestsellers') {
      products = products.filter((p) => p.is_bestseller);
      title = 'Best Sellers';
    } else if (filter === 'anti-tarnish') {
      products = products.filter((p) => p.is_anti_tarnish);
      title = 'Anti-Tarnish';
    } else if (category && category in CATEGORY_LABELS) {
      products = products.filter((p) => p.category === (category as ProductCategory));
      title = CATEGORY_LABELS[category];
    }
  }

  if (sort === 'price-asc') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'price-desc') products = [...products].sort((a, b) => b.price - a.price);
  else if (sort === 'new') products = [...products].filter((p) => p.is_new_arrival).concat(products.filter((p) => !p.is_new_arrival));

  const sortLink = (s: string) => {
    const params = new URLSearchParams();
    if (category) params.set('category', category);
    if (q) params.set('q', q);
    if (filter) params.set('filter', filter);
    params.set('sort', s);
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="bg-brand-ivory">
      <div className="border-b border-brand-champagne bg-brand-champagne/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title={title} subtitle={`${products.length} pieces`} />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORY_TABS.map((tab) => {
              const active =
                tab.href === '/shop'
                  ? !category && !filter && !q
                  : category
                    ? tab.href.includes(`category=${category}`)
                    : filter
                      ? tab.href.includes(filter)
                      : false;
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`border px-4 py-2 text-xs tracking-widest transition ${
                    active
                      ? 'border-brand-burgundy bg-brand-burgundy text-white'
                      : 'border-brand-champagne hover:border-brand-gold'
                  }`}
                >
                  {tab.label.toUpperCase()}
                </Link>
              );
            })}
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-brand-charcoal/50">Sort</span>
            <Link href={sortLink('new')} className="hover:text-brand-burgundy">
              New
            </Link>
            <Link href={sortLink('price-asc')} className="hover:text-brand-burgundy">
              Price ↑
            </Link>
            <Link href={sortLink('price-desc')} className="hover:text-brand-burgundy">
              Price ↓
            </Link>
          </div>
        </div>

        <ProductGrid products={products} emptyMessage="No pieces match your search." />
      </div>
    </div>
  );
}
