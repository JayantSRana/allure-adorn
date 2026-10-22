import Link from 'next/link';
import ProductGrid from '@/components/store/ProductGrid';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { getProductsByCategory } from '@/lib/store';

export const metadata = {
  title: 'Signature Bangles | Allure Adorn',
  description:
    'Glass, American diamond, crystal, kundan and velvet bangles in sizes 2.4, 2.6 and 2.8.',
};

export const dynamic = 'force-dynamic';

const SUB = [
  'All',
  'Glass',
  'American Diamond',
  'Crystal',
  'Velvet',
  'Metal',
  'Kundan',
  'Festive Sets',
];

const SIZE_GUIDE = [
  { size: '2.4', diameter: '2.25 in (57 mm)', fit: 'Petite / Slender Wrist' },
  { size: '2.6', diameter: '2.37 in (60 mm)', fit: 'Standard / Medium Wrist' },
  { size: '2.8', diameter: '2.50 in (63.5 mm)', fit: 'Comfort / Broad Wrist' },
];

export default async function BanglesPage({
  searchParams,
}: {
  searchParams?: { type?: string };
}) {
  const allBangles = await getProductsByCategory('BANGLES');
  const activeType = searchParams?.type || 'All';

  const filtered =
    activeType === 'All'
      ? allBangles
      : allBangles.filter((p) => {
          const hay = [
            p.name,
            p.sub_category || '',
            p.material || '',
            p.description_short,
            ...p.tags,
          ]
            .join(' ')
            .toLowerCase();
          return hay.includes(activeType.toLowerCase());
        });

  return (
    <div className="bg-brand-ivory">
      <section className="relative overflow-hidden border-b border-brand-champagne bg-brand-champagne/40 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-brand-gold">
            Signature Bangles
          </p>
          <h1 className="font-serif text-4xl font-light tracking-wide sm:text-6xl">
            Stack Your Story
          </h1>
          <div className="flex justify-center py-4">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-brand-charcoal/70">
            From delicate everyday stacks to heirloom bridal choodas and crystal
            statement sets — crafted for comfort and lasting brilliance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Interactive Filter Tabs */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          {SUB.map((s) => {
            const isSelected = activeType.toLowerCase() === s.toLowerCase();
            const href =
              s === 'All'
                ? '/bangles'
                : `/bangles?type=${encodeURIComponent(s)}`;
            return (
              <Link
                key={s}
                href={href}
                className={`border px-4 py-2 text-xs uppercase tracking-widest transition ${
                  isSelected
                    ? 'border-brand-burgundy bg-brand-burgundy text-white'
                    : 'border-brand-champagne bg-white/60 text-brand-charcoal/75 hover:border-brand-gold hover:text-brand-burgundy'
                }`}
              >
                {s}
              </Link>
            );
          })}
        </div>

        <ProductGrid
          products={filtered.length > 0 ? filtered : allBangles}
          emptyMessage="No bangles found in this style."
        />

        {/* Bangle Size Guide */}
        <div className="mt-20 border border-brand-champagne bg-white/80 p-8 sm:p-10">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.35em] text-brand-gold">
              Find Your Perfect Fit
            </p>
            <h2 className="mt-2 font-serif text-2xl font-light sm:text-3xl">
              Bangle Size Guide
            </h2>
            <div className="flex justify-center py-3">
              <DiamondMotif className="text-xs" />
            </div>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {SIZE_GUIDE.map((g) => (
              <div
                key={g.size}
                className="border border-brand-champagne/80 bg-brand-ivory/50 p-5 text-center"
              >
                <p className="font-serif text-3xl text-brand-burgundy">
                  Size {g.size}
                </p>
                <p className="mt-1 text-xs font-medium uppercase tracking-widest text-brand-gold">
                  Inner Diameter: {g.diameter}
                </p>
                <p className="mt-2 text-xs text-brand-charcoal/65">{g.fit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
