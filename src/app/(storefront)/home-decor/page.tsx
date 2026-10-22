import Link from 'next/link';
import ProductGrid from '@/components/store/ProductGrid';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { getProductsByCategories } from '@/lib/store';
import { ProductCategory } from '@/types';

export const metadata = {
  title: 'Navira Home Decor | Allure Adorn',
  description:
    'Candles, vases, wall art and tablescape pieces to style your home with quiet luxury.',
};

export const dynamic = 'force-dynamic';

const DECOR_TABS: { label: string; category?: ProductCategory }[] = [
  { label: 'All Decor' },
  { label: 'Candles', category: 'CANDLES' },
  { label: 'Vases', category: 'VASES' },
  { label: 'Wall Art', category: 'WALL_ART' },
  { label: 'Tablescape', category: 'TABLESCAPE' },
  { label: 'Accents', category: 'HOME_DECOR' },
];

export default async function HomeDecorPage({
  searchParams,
}: {
  searchParams?: { category?: string };
}) {
  const allDecor = await getProductsByCategories([
    'HOME_DECOR',
    'CANDLES',
    'VASES',
    'WALL_ART',
    'TABLESCAPE',
  ]);

  const activeCategory = searchParams?.category;
  const filtered = activeCategory
    ? allDecor.filter((p) => p.category === activeCategory)
    : allDecor;

  return (
    <div className="bg-brand-ivory">
      <section className="border-b border-brand-champagne bg-brand-champagne/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-brand-gold">
            Navira Home Decor · By Allure Adorn
          </p>
          <h1 className="font-serif text-4xl font-light tracking-wide sm:text-6xl">
            Adorn Your Space
          </h1>
          <div className="flex justify-center py-4">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-brand-charcoal/70">
            Candles, sculptural vases, wall art and tablescapes — considered
            objects that bring warmth and quiet luxury to every room.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {DECOR_TABS.map((t) => {
            const isSelected = t.category
              ? activeCategory === t.category
              : !activeCategory;
            const href = t.category
              ? `/home-decor?category=${t.category}`
              : '/home-decor';
            return (
              <Link
                key={t.label}
                href={href}
                className={`border px-4 py-2 text-xs uppercase tracking-widest transition ${
                  isSelected
                    ? 'border-brand-burgundy bg-brand-burgundy text-white'
                    : 'border-brand-champagne bg-white/60 text-brand-charcoal/75 hover:border-brand-gold hover:text-brand-burgundy'
                }`}
              >
                {t.label}
              </Link>
            );
          })}
        </div>

        <ProductGrid
          products={filtered}
          emptyMessage="No home decor pieces in this category yet."
        />
      </section>
    </div>
  );
}
