import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ProductGrid from '@/components/store/ProductGrid';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import {
  getCollectionBySlug,
  getCollectionProducts,
  getCollections,
  collectionSlug,
} from '@/lib/store';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) return { title: 'Collection | Allure Adorn' };
  return {
    title: `${collection.name} | Allure Adorn`,
    description:
      collection.description ||
      `Explore the ${collection.name} collection from Allure Adorn.`,
    openGraph: {
      title: `${collection.name} | Allure Adorn`,
      description:
        collection.description ||
        `Explore the ${collection.name} collection from Allure Adorn.`,
      images: [collection.hero_image],
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: { slug: string };
}) {
  const collection = await getCollectionBySlug(params.slug);
  if (!collection) notFound();

  const [products, all] = await Promise.all([
    getCollectionProducts(collection),
    getCollections(),
  ]);

  return (
    <div className="bg-brand-ivory">
      <section className="relative h-[320px] w-full overflow-hidden sm:h-[440px]">
        <Image
          src={collection.hero_image}
          alt={collection.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-charcoal/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-brand-gold">
            Collection
          </p>
          <h1 className="font-serif text-4xl font-light tracking-wide text-white sm:text-5xl">
            {collection.name}
          </h1>
          <div className="flex justify-center py-4">
            <DiamondMotif className="text-sm text-white" />
          </div>
          <p className="mx-auto max-w-xl px-4 text-sm text-white/85">
            {collection.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 border-b border-brand-champagne pb-6">
          {all.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${collectionSlug(c)}`}
              className={`border px-4 py-2 text-xs tracking-widest transition ${
                c.id === collection.id
                  ? 'border-brand-burgundy bg-brand-burgundy text-white'
                  : 'border-brand-champagne hover:border-brand-gold'
              }`}
            >
              {c.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <ProductGrid
          products={products}
          emptyMessage="This collection is being curated. Check back soon."
        />
      </section>
    </div>
  );
}
