import { ensureDatabase } from './db';
import { Product, Collection, Review, Order, ProductCategory } from '@/types';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function collectionSlug(c: Collection): string {
  return slugify(c.name);
}

export async function getActiveProducts(): Promise<Product[]> {
  const db = await ensureDatabase();
  return db.products.filter((p) => p.is_active);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = await ensureDatabase();
  return db.products.find((p) => p.slug === slug && p.is_active) ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const db = await ensureDatabase();
  return db.products.find((p) => p.id === id) ?? null;
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.category === category);
}

export async function getProductsByCategories(
  categories: ProductCategory[],
): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => categories.includes(p.category));
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.is_new_arrival).slice(0, limit);
}

export async function getBestsellers(limit = 4): Promise<Product[]> {
  const products = await getActiveProducts();
  return products.filter((p) => p.is_bestseller).slice(0, limit);
}

export async function getAntiTarnish(limit?: number): Promise<Product[]> {
  const products = await getActiveProducts();
  const list = products.filter((p) => p.is_anti_tarnish);
  return typeof limit === 'number' ? list.slice(0, limit) : list;
}

export async function getCollections(): Promise<Collection[]> {
  const db = await ensureDatabase();
  return db.collections;
}

export async function getFeaturedCollection(): Promise<Collection | null> {
  const collections = await getCollections();
  return collections.find((c) => c.is_featured) ?? collections[0] ?? null;
}

export async function getCollectionBySlug(
  slug: string,
): Promise<Collection | null> {
  const collections = await getCollections();
  return collections.find((c) => collectionSlug(c) === slug) ?? null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = await getActiveProducts();
  return ids
    .map((id) => products.find((p) => p.id === id))
    .filter((p): p is Product => Boolean(p));
}

export async function getCollectionProducts(
  collection: Collection,
): Promise<Product[]> {
  if (collection.product_ids.length > 0) {
    return getProductsByIds(collection.product_ids);
  }
  const products = await getActiveProducts();
  return products.filter((p) => p.collection_ids.includes(collection.id));
}

export async function getRelatedProducts(
  product: Product,
  limit = 4,
): Promise<Product[]> {
  const products = await getActiveProducts();
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => {
      let score = 0;
      if (p.category === product.category) score += 3;
      if (
        p.collection_ids.some((c) => product.collection_ids.includes(c))
      )
        score += 2;
      score += p.tags.filter((t) => product.tags.includes(t)).length;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.p);
}

/* ---------------------------- Search ---------------------------- */

export interface ScoredProduct {
  product: Product;
  score: number;
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const products = await getActiveProducts();
  const terms = q.split(/\s+/).filter(Boolean);

  const scored: ScoredProduct[] = products.map((product) => {
    const haystackName = product.name.toLowerCase();
    const haystackTags = product.tags.join(' ').toLowerCase();
    const haystackCat = [product.category, product.sub_category ?? '']
      .join(' ')
      .toLowerCase();
    const haystackDesc = product.description_short.toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (haystackName.includes(term)) score += 5;
      if (haystackTags.includes(term)) score += 4;
      if (haystackCat.includes(term)) score += 3;
      if (haystackDesc.includes(term)) score += 1;
      // fuzzy: term is a prefix of any tag word
      if (haystackTags.split(' ').some((w) => w.startsWith(term))) score += 2;
    }
    return { product, score };
  });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.product);
}

/* ---------------------------- Reviews ---------------------------- */

export async function getApprovedReviewsForProduct(
  productId: string,
): Promise<Review[]> {
  const db = await ensureDatabase();
  return db.reviews.filter(
    (r) => r.product_id === productId && r.is_approved && r.is_verified_purchase,
  );
}

export async function getHomepageReviews(limit = 4): Promise<Review[]> {
  const db = await ensureDatabase();
  return db.reviews
    .filter((r) => r.is_approved && r.is_verified_purchase)
    .slice(0, limit);
}

/* ---------------------------- Orders ---------------------------- */

export async function getOrderByNumberOrId(
  key: string,
): Promise<Order | null> {
  const db = await ensureDatabase();
  const k = key.trim();
  return (
    db.orders.find(
      (o) => o.id === k || o.order_number === k || o.order_number === `#${k}`,
    ) ?? null
  );
}

export async function getOrdersByPhone(phone: string): Promise<Order[]> {
  const db = await ensureDatabase();
  return db.orders.filter((o) => o.customer_phone === phone.trim());
}

/* ------------------------- Ratings hydrate ------------------------- */

export async function getProductRatingSummary(): Promise<
  Record<string, { avg: number; count: number }>
> {
  const db = await ensureDatabase();
  const summary: Record<string, { avg: number; count: number }> = {};
  for (const r of db.reviews) {
    if (!r.is_approved || !r.is_verified_purchase) continue;
    const cur = summary[r.product_id] ?? { avg: 0, count: 0 };
    const total = cur.avg * cur.count + r.rating;
    cur.count += 1;
    cur.avg = total / cur.count;
    summary[r.product_id] = cur;
  }
  return summary;
}
