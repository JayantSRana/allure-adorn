import Link from 'next/link';
import ProductGrid from '@/components/store/ProductGrid';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { getProductsByCategory } from '@/lib/store';

export const metadata = {
  title: 'Bangles | Allure Adorn',
  description:
    'Glass, American diamond, crystal and velvet bangles in sizes 2.4, 2.6 and 2.8.',
};

export const dynamic = 'force-dynamic';

const SUB = [
  'Glass',
  'American Diamond',
  'Crystal',
  'Velvet',
  'Metal',
  'Resin',
  'Festive Sets',
];

export default async function BanglesPage() {
  const products = await getProductsByCategory('BANGLES');

  return (
    <div className="bg-brand-ivory">
      <section className="relative overflow-hidden bg-brand-champagne/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-brand-gold">Bangles</p>
          <h1 className="font-serif text-4xl font-light tracking-wide sm:text-6xl">
            Stack Your Story
          </h1>
          <div className="flex justify-center py-4">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="mx-auto max-w-xl text-sm text-brand-charcoal/70">
            From subtle everyday stacks to festive statement combinations.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap justify-center gap-3">
          {SUB.map((s) => (
            <span
              key={s}
              className="border border-brand-champagne px-4 py-2 text-xs tracking-widest text-brand-charcoal/70"
            >
              {s}
            </span>
          ))}
        </div>
        <ProductGrid products={products} />
        <div className="mt-12 text-center">
          <Link
            href="/shop?category=BANGLES"
            className="border border-brand-burgundy px-8 py-3 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
          >
            VIEW ALL BANGLES
          </Link>
        </div>
      </section>
    </div>
  );
}
