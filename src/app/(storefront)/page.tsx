import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Package,
  MousePointerClick,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  Heart,
  Award,
  Star,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import HeroSlideshow from '@/components/store/HeroSlideshow';
import ProductGrid from '@/components/store/ProductGrid';
import NewsletterForm from '@/components/store/NewsletterForm';
import { SectionHeading, DiamondMotif } from '@/components/store/DiamondMotif';
import {
  getNewArrivals,
  getBestsellers,
  getAntiTarnish,
  getFeaturedCollection,
  getCollectionById,
  getProductsByCategories,
  getProductsByCategory,
  getProductsByIds,
  getHomepageReviews,
  getActiveHomepageSections,
  collectionSlug,
} from '@/lib/store';
import { HomepageSection, ServiceIconName } from '@/types';

export const dynamic = 'force-dynamic';

const ICON_MAP: Record<ServiceIconName, LucideIcon> = {
  Globe,
  Package,
  MousePointerClick,
  Headphones,
  ShieldCheck,
  Sparkles,
  Truck,
  Heart,
  Award,
};

function themeClasses(theme?: HomepageSection['config']['theme']) {
  switch (theme) {
    case 'burgundy':
      return 'bg-brand-burgundy text-white';
    case 'charcoal':
      return 'bg-brand-charcoal text-white';
    case 'champagne':
      return 'bg-brand-champagne/30 text-brand-charcoal';
    default:
      return 'bg-brand-ivory text-brand-charcoal';
  }
}

export default async function Home() {
  const [
    sections,
    newArrivals,
    bestsellers,
    antiTarnish,
    defaultFeatured,
    homeDecor,
    reviews,
  ] = await Promise.all([
    getActiveHomepageSections(),
    getNewArrivals(24),
    getBestsellers(24),
    getAntiTarnish(12),
    getFeaturedCollection(),
    getProductsByCategories([
      'CANDLES',
      'VASES',
      'WALL_ART',
      'TABLESCAPE',
      'HOME_DECOR',
    ]),
    getHomepageReviews(12),
  ]);

  const renderedSections = await Promise.all(
    sections.map(async (sec) => {
      switch (sec.type) {
        case 'HERO_SLIDESHOW': {
          const slides = sec.config.slides || [];
          return <HeroSlideshow key={sec.id} slides={slides} />;
        }

        case 'CATEGORY_SHOWCASE': {
          const cards = (sec.config.category_cards || []).filter(
            (c) => c.is_active !== false,
          );
          if (cards.length === 0) return null;
          return (
            <section
              key={sec.id}
              className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
            >
              <SectionHeading title={sec.title} subtitle={sec.subtitle} />
              <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
                {cards.map((c) => (
                  <Link key={c.id || c.href} href={c.href} className="group">
                    <div className="relative aspect-[3/4] overflow-hidden bg-brand-champagne">
                      <Image
                        src={c.img}
                        alt={c.label}
                        fill
                        sizes="(max-width:768px) 50vw, 16vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                        <p className="font-serif text-lg">{c.label}</p>
                        <p className="text-[10px] uppercase tracking-widest text-white/70">
                          {c.tagline}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        }

        case 'NEW_ARRIVALS': {
          const limit = sec.config.limit || 4;
          const items = newArrivals.slice(0, limit);
          if (items.length === 0) return null;
          return (
            <section
              key={sec.id}
              className={`${themeClasses(sec.config.theme || 'champagne')} py-20`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-light sm:text-4xl">
                      {sec.title}
                    </h2>
                    {sec.subtitle ? (
                      <p className="mt-1 text-xs text-brand-charcoal/65">
                        {sec.subtitle}
                      </p>
                    ) : null}
                    <div className="py-2">
                      <DiamondMotif className="text-sm" />
                    </div>
                  </div>
                  {sec.config.cta_text ? (
                    <Link
                      href={sec.config.cta_href || '/shop?filter=new'}
                      className="hidden items-center gap-2 text-xs uppercase tracking-widest text-brand-burgundy hover:text-brand-gold sm:flex"
                    >
                      {sec.config.cta_text} <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
                <ProductGrid products={items} />
              </div>
            </section>
          );
        }

        case 'BESTSELLERS': {
          const limit = sec.config.limit || 4;
          const items = bestsellers.slice(0, limit);
          if (items.length === 0) return null;
          return (
            <section
              key={sec.id}
              className={`${themeClasses(sec.config.theme || 'ivory')} py-20`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-end justify-between">
                  <div>
                    <h2 className="font-serif text-3xl font-light sm:text-4xl">
                      {sec.title}
                    </h2>
                    {sec.subtitle ? (
                      <p className="mt-1 text-xs text-brand-charcoal/65">
                        {sec.subtitle}
                      </p>
                    ) : null}
                    <div className="py-2">
                      <DiamondMotif className="text-sm" />
                    </div>
                  </div>
                  {sec.config.cta_text ? (
                    <Link
                      href={sec.config.cta_href || '/shop?filter=bestsellers'}
                      className="hidden items-center gap-2 text-xs uppercase tracking-widest text-brand-burgundy hover:text-brand-gold sm:flex"
                    >
                      {sec.config.cta_text} <ArrowRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
                <ProductGrid products={items} />
              </div>
            </section>
          );
        }

        case 'FEATURED_COLLECTION': {
          const col = sec.config.collection_id
            ? await getCollectionById(sec.config.collection_id)
            : defaultFeatured;
          if (!col) return null;
          const heroImg = sec.config.image || col.hero_image;
          const desc = sec.config.body_text || col.description;
          const href =
            sec.config.cta_href || `/collections/${collectionSlug(col)}`;
          return (
            <section
              key={sec.id}
              className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-brand-champagne">
                <Image
                  src={heroImg}
                  alt={sec.title || col.name}
                  fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="max-w-md">
                <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">
                  {sec.eyebrow || 'Featured Collection'}
                </p>
                <h2 className="mt-3 font-serif text-4xl font-light">
                  {sec.title || col.name}
                </h2>
                <div className="py-4">
                  <DiamondMotif className="text-sm" />
                </div>
                <p className="text-sm leading-relaxed text-brand-charcoal/75">
                  {desc}
                </p>
                <Link
                  href={href}
                  className="mt-8 inline-block bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal"
                >
                  {sec.config.cta_text || 'EXPLORE THE COLLECTION'}
                </Link>
              </div>
            </section>
          );
        }

        case 'BRAND_PROMISE': {
          const limit = sec.config.limit || 3;
          const items = antiTarnish.slice(0, limit);
          const isDark =
            (sec.config.theme || 'burgundy') === 'burgundy' ||
            sec.config.theme === 'charcoal';
          return (
            <section
              key={sec.id}
              className={`${themeClasses(sec.config.theme || 'burgundy')} py-20`}
            >
              <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
                <div className="order-2 lg:order-1">
                  <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">
                    {sec.eyebrow || 'Our Promise'}
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-light">
                    {sec.title}
                  </h2>
                  <div className="py-4">
                    <DiamondMotif className="text-sm" />
                  </div>
                  <p
                    className={`max-w-md text-sm leading-relaxed ${
                      isDark ? 'text-white/80' : 'text-brand-charcoal/80'
                    }`}
                  >
                    {sec.config.body_text}
                  </p>
                  {sec.config.cta_text ? (
                    <Link
                      href={sec.config.cta_href || '/shop?filter=anti-tarnish'}
                      className={`mt-8 inline-block border px-8 py-3.5 text-xs tracking-widest transition ${
                        isDark
                          ? 'border-white/70 text-white hover:bg-white hover:text-brand-burgundy'
                          : 'border-brand-burgundy text-brand-burgundy hover:bg-brand-burgundy hover:text-white'
                      }`}
                    >
                      {sec.config.cta_text}
                    </Link>
                  ) : null}
                </div>
                <div className="order-1 grid grid-cols-3 gap-3 lg:order-2">
                  {items.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="relative aspect-[3/4] overflow-hidden bg-brand-champagne"
                    >
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="20vw"
                        className="object-cover"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          );
        }

        case 'PROMO_BANNER': {
          const isDark =
            (sec.config.theme || 'burgundy') === 'burgundy' ||
            sec.config.theme === 'charcoal';
          return (
            <section
              key={sec.id}
              className={`${themeClasses(sec.config.theme || 'burgundy')} py-16`}
            >
              <div
                className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${
                  sec.config.image
                    ? 'grid items-center gap-10 lg:grid-cols-2'
                    : 'text-center'
                }`}
              >
                <div>
                  {sec.config.badge_text ? (
                    <span className="mb-3 inline-block border border-brand-gold px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-brand-gold">
                      {sec.config.badge_text}
                    </span>
                  ) : null}
                  {sec.eyebrow ? (
                    <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">
                      {sec.eyebrow}
                    </p>
                  ) : null}
                  <h2 className="mt-2 font-serif text-3xl font-light sm:text-4xl">
                    {sec.title}
                  </h2>
                  {sec.subtitle ? (
                    <p
                      className={`mt-2 text-sm ${
                        isDark ? 'text-white/85' : 'text-brand-charcoal/75'
                      }`}
                    >
                      {sec.subtitle}
                    </p>
                  ) : null}
                  <div className="py-3">
                    <DiamondMotif className="text-sm" />
                  </div>
                  {sec.config.body_text ? (
                    <p
                      className={`mx-auto max-w-xl text-sm leading-relaxed ${
                        isDark ? 'text-white/80' : 'text-brand-charcoal/75'
                      }`}
                    >
                      {sec.config.body_text}
                    </p>
                  ) : null}
                  {sec.config.cta_text ? (
                    <Link
                      href={sec.config.cta_href || '/shop'}
                      className={`mt-6 inline-block px-8 py-3.5 text-xs tracking-widest transition ${
                        isDark
                          ? 'bg-white text-brand-burgundy hover:bg-brand-champagne'
                          : 'bg-brand-burgundy text-white hover:bg-brand-charcoal'
                      }`}
                    >
                      {sec.config.cta_text}
                    </Link>
                  ) : null}
                </div>
                {sec.config.image ? (
                  <div className="relative aspect-[16/10] overflow-hidden bg-brand-champagne">
                    <Image
                      src={sec.config.image}
                      alt={sec.title}
                      fill
                      sizes="(max-width:1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
              </div>
            </section>
          );
        }

        case 'CUSTOM_PRODUCT_GRID': {
          const limit = sec.config.limit || 4;
          const items =
            sec.config.product_ids && sec.config.product_ids.length > 0
              ? await getProductsByIds(sec.config.product_ids)
              : await getProductsByCategory(
                  sec.config.filter_category || 'JEWELLERY',
                );
          const sliced = items.slice(0, limit);
          if (sliced.length === 0) return null;
          return (
            <section
              key={sec.id}
              className={`${themeClasses(sec.config.theme || 'ivory')} py-20`}
            >
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading title={sec.title} subtitle={sec.subtitle} />
                <div className="mt-12">
                  <ProductGrid products={sliced} />
                </div>
                {sec.config.cta_text ? (
                  <div className="mt-10 text-center">
                    <Link
                      href={sec.config.cta_href || '/shop'}
                      className="border border-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
                    >
                      {sec.config.cta_text}
                    </Link>
                  </div>
                ) : null}
              </div>
            </section>
          );
        }

        case 'HOME_DECOR_SHOWCASE': {
          const limit = sec.config.limit || 4;
          const items = homeDecor.slice(0, limit);
          if (items.length === 0) return null;
          return (
            <section
              key={sec.id}
              className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
            >
              <SectionHeading title={sec.title} subtitle={sec.subtitle} />
              <div className="mt-12">
                <ProductGrid products={items} />
              </div>
              {sec.config.cta_text ? (
                <div className="mt-10 text-center">
                  <Link
                    href={sec.config.cta_href || '/home-decor'}
                    className="border border-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
                  >
                    {sec.config.cta_text}
                  </Link>
                </div>
              ) : null}
            </section>
          );
        }

        case 'INSTAGRAM_FEED': {
          const images = sec.config.instagram_images || [];
          const igUrl =
            sec.config.instagram_url || 'https://instagram.com/allureadorn';
          if (images.length === 0) return null;
          return (
            <section key={sec.id} className="bg-brand-champagne/30 py-20">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeading title={sec.title} subtitle={sec.subtitle} />
                <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {images.map((imgSrc, i) => (
                    <a
                      key={i}
                      href={igUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="relative aspect-square overflow-hidden bg-brand-champagne"
                    >
                      <Image
                        src={imgSrc}
                        alt="Instagram post"
                        fill
                        sizes="16vw"
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                    </a>
                  ))}
                </div>
                <div className="mt-10 text-center">
                  <a
                    href={igUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal"
                  >
                    {sec.config.cta_text || 'FOLLOW US'}
                  </a>
                </div>
              </div>
            </section>
          );
        }

        case 'REVIEWS_SHOWCASE': {
          const limit = sec.config.limit || 4;
          const items = reviews.slice(0, limit);
          if (items.length === 0) return null;
          return (
            <section
              key={sec.id}
              className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
            >
              <SectionHeading title={sec.title} subtitle={sec.subtitle} />
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {items.map((r) => (
                  <div key={r.id} className="border border-brand-champagne p-6">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < r.rating
                              ? 'fill-brand-gold text-brand-gold'
                              : 'text-brand-champagne'
                          }`}
                        />
                      ))}
                    </span>
                    <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">
                      {r.body}
                    </p>
                    <p className="mt-4 text-xs uppercase tracking-widest text-brand-gold">
                      Verified Customer
                    </p>
                    <p className="text-xs text-brand-charcoal/50">
                      {r.customer_name}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        }

        case 'SERVICE_STRIP': {
          const badges = (sec.config.service_badges || []).filter(
            (b) => b.is_active !== false,
          );
          if (badges.length === 0) return null;
          return (
            <section
              key={sec.id}
              className="border-y border-brand-champagne bg-brand-ivory py-14"
            >
              <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
                {badges.map((s) => {
                  const IconComp = ICON_MAP[s.icon] || Globe;
                  return (
                    <div key={s.id || s.title} className="text-center">
                      <IconComp className="mx-auto h-6 w-6 text-brand-gold" />
                      <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
                      <p className="mt-1 text-xs text-brand-charcoal/60">
                        {s.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        }

        case 'NEWSLETTER': {
          return (
            <section
              key={sec.id}
              className="mx-auto max-w-3xl px-4 py-20 text-center"
            >
              <SectionHeading title={sec.title} subtitle={sec.subtitle} />
              <NewsletterForm />
            </section>
          );
        }

        default:
          return null;
      }
    }),
  );

  return <div className="bg-brand-ivory">{renderedSections}</div>;
}
