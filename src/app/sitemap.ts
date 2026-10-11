import type { MetadataRoute } from 'next';
import { ensureDatabase } from '@/lib/db';
import { collectionSlug } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const db = await ensureDatabase();

  const CMS = [
    '',
    '/shop',
    '/bangles',
    '/home-decor',
    '/about',
    '/care',
    '/contact',
    '/faqs',
    '/shipping',
    '/returns',
    '/privacy',
    '/terms',
  ];

  const staticRoutes: MetadataRoute.Sitemap = CMS.map((p) => ({
    url: `${base}${p}`,
    changeFrequency: 'weekly' as const,
    priority: p === '' ? 1 : 0.7,
  }));

  const productRoutes: MetadataRoute.Sitemap = db.products
    .filter((p) => p.is_active)
    .map((p) => ({
      url: `${base}/product/${p.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

  const collectionRoutes: MetadataRoute.Sitemap = db.collections.map((c) => ({
    url: `${base}/collections/${collectionSlug(c)}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...collectionRoutes];
}
