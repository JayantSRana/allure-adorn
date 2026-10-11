import ProductGrid from '@/components/store/ProductGrid';
import { SectionHeading } from '@/components/store/DiamondMotif';
import { getProductsByCategories } from '@/lib/store';

export const metadata = {
  title: 'Home Decor | Allure Adorn',
  description:
    'Candles, vases, wall art and tablescape pieces to style your home with quiet luxury.',
};

export const dynamic = 'force-dynamic';

export default async function HomeDecorPage() {
  const products = await getProductsByCategories([
    'HOME_DECOR',
    'CANDLES',
    'VASES',
    'WALL_ART',
    'TABLESCAPE',
  ]);

  return (
    <div className="bg-brand-ivory">
      <section className="bg-brand-champagne/40 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Adorn Your Space"
            subtitle="Candles, vases, wall art and tablescapes — considered pieces that make a house feel like a home."
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <ProductGrid products={products} />
      </section>
    </div>
  );
}
