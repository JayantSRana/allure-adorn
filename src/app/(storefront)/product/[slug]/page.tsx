import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Star } from 'lucide-react';
import ProductDetail from '@/components/store/ProductDetail';
import ProductGrid from '@/components/store/ProductGrid';
import { SectionHeading, DiamondMotif } from '@/components/store/DiamondMotif';
import {
  getProductBySlug,
  getRelatedProducts,
  getApprovedReviewsForProduct,
  getActiveProducts,
} from '@/lib/store';
import { formatDate } from '@/lib/format';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  return { title: product ? `${product.name} | Allure Adorn` : 'Product | Allure Adorn' };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const [related, reviews, allProducts] = await Promise.all([
    getRelatedProducts(product, 4),
    getApprovedReviewsForProduct(product.id),
    getActiveProducts(),
  ]);

  const ratingCount = reviews.length;
  const ratingAvg =
    ratingCount > 0 ? reviews.reduce((n, r) => n + r.rating, 0) / ratingCount : 0;

  // attach live ratings to related cards
  const relatedWithRating = related.map((p) => ({ ...p }));
  void allProducts;

  return (
    <div className="bg-brand-ivory">
      <div className="mx-auto max-w-7xl px-4 pt-6 text-xs text-brand-charcoal/50 sm:px-6 lg:px-8">
        <Link href="/" className="hover:text-brand-burgundy">Home</Link>
        <span className="px-2">/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-brand-burgundy">
          {product.category.replace('_', ' ')}
        </Link>
        <span className="px-2">/</span>
        <span className="text-brand-charcoal/80">{product.name}</span>
      </div>

      <ProductDetail
        product={{ ...product, rating_avg: ratingAvg, rating_count: ratingCount }}
      />

      {/* Reviews — only render when verified reviews exist */}
      {reviews.length > 0 ? (
        <section className="border-t border-brand-champagne bg-brand-champagne/20 py-16">
          <div className="mx-auto max-w-4xl px-4">
            <SectionHeading title="Loved & Adorned" />
            <div className="mt-8 space-y-6">
              {reviews.map((r) => (
                <div key={r.id} className="border border-brand-champagne bg-brand-ivory p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3.5 w-3.5 ${
                              i < r.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-champagne'
                            }`}
                          />
                        ))}
                      </span>
                      <span className="text-sm font-medium">{r.title}</span>
                    </div>
                    <span className="text-[11px] uppercase tracking-widest text-brand-gold">
                      Verified Customer
                    </span>
                  </div>
                  <p className="mt-3 text-sm text-brand-charcoal/75">{r.body}</p>
                  <p className="mt-3 text-xs text-brand-charcoal/50">
                    {r.customer_name} · {formatDate(r.created_at)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {related.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-light">You May Also Like</h2>
            <div className="flex justify-center py-3">
              <DiamondMotif className="text-sm" />
            </div>
          </div>
          <ProductGrid products={relatedWithRating} />
        </section>
      ) : null}
    </div>
  );
}
