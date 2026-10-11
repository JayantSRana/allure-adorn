import Link from 'next/link';
import Image from 'next/image';
import {
  Globe,
  Package,
  MousePointerClick,
  Headphones,
  Star,
  ArrowRight,
} from 'lucide-react';
import HeroSlideshow from '@/components/store/HeroSlideshow';
import ProductGrid from '@/components/store/ProductGrid';
import { SectionHeading, DiamondMotif } from '@/components/store/DiamondMotif';
import {
  getNewArrivals,
  getBestsellers,
  getAntiTarnish,
  getFeaturedCollection,
  getCollectionProducts,
  getProductsByCategories,
  getHomepageReviews,
} from '@/lib/store';

export const dynamic = 'force-dynamic';

const CATEGORY_CARDS = [
  { label: 'Jewellery', href: '/shop?category=JEWELLERY', tagline: 'Everyday to heirloom', img: '/editorial/editorial-3.jpg' },
  { label: 'Bangles', href: '/bangles', tagline: 'Stack your story', img: '/editorial/editorial-8.jpg' },
  { label: 'Earrings', href: '/shop?category=EARRINGS', tagline: 'Light-catching', img: '/editorial/editorial-12.jpg' },
  { label: 'Necklaces', href: '/shop?category=NECKLACES', tagline: 'Layer or lead', img: '/editorial/editorial-18.jpg' },
  { label: 'Rings', href: '/shop?category=RINGS', tagline: 'Quietly present', img: '/editorial/editorial-25.jpg' },
  { label: 'Home Decor', href: '/home-decor', tagline: 'Adorn your space', img: '/editorial/editorial-38.jpg' },
];

const SERVICE = [
  { icon: Globe, title: 'Worldwide Shipping', text: 'India · Canada · Australia · UK · Russia & more' },
  { icon: Package, title: 'Secure Packaging', text: 'Every piece arrives gift-ready and protected' },
  { icon: MousePointerClick, title: 'Easy Online Ordering', text: 'Simple checkout, COD and online payments' },
  { icon: Headphones, title: 'Customer Support', text: 'Real people, happy to help — on WhatsApp too' },
];

export default async function Home() {
  const [newArrivals, bestsellers, antiTarnish, featured, homeDecor, reviews] =
    await Promise.all([
      getNewArrivals(4),
      getBestsellers(4),
      getAntiTarnish(3),
      getFeaturedCollection(),
      getProductsByCategories(['CANDLES', 'VASES', 'WALL_ART', 'TABLESCAPE', 'HOME_DECOR']),
      getHomepageReviews(4),
    ]);

  const featuredProducts = featured ? await getCollectionProducts(featured) : [];
  void bestsellers;
  void featuredProducts;

  const slides = [
    { image: '/editorial/editorial-2.jpg', eyebrow: 'New Season', headline: 'Adornment, made to be remembered.', sub: 'Timeless jewellery crafted with quiet luxury — designed to be worn now and treasured for years.' },
    { image: '/editorial/editorial-13.jpg', eyebrow: 'The Wedding Edit', headline: 'For the moments you keep.', sub: 'Kundan, pearls and crystal — chosen for the aisle and everything after.' },
    { image: '/editorial/editorial-30.jpg', eyebrow: 'Everyday Allure', headline: 'Anti-tarnish. Made to stay beautiful.', sub: 'Featherweight pieces that keep their glow, day after day.' },
  ];

  return (
    <div className="bg-brand-ivory">
      <HeroSlideshow slides={slides} />

      {/* Shop by category */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title="Discover Your Adornment" subtitle="Six worlds of quiet luxury, curated for the way you live." />
        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORY_CARDS.map((c) => (
            <Link key={c.href} href={c.href} className="group">
              <div className="relative aspect-[3/4] overflow-hidden bg-brand-champagne">
                <Image src={c.img} alt={c.label} fill sizes="(max-width:768px) 50vw, 16vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/60 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3 text-white">
                  <p className="font-serif text-lg">{c.label}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/70">{c.tagline}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New arrivals */}
      <section className="bg-brand-champagne/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="font-serif text-3xl font-light sm:text-4xl">New Arrivals</h2>
              <div className="py-2"><DiamondMotif className="text-sm" /></div>
            </div>
            <Link href="/shop?filter=new" className="hidden items-center gap-2 text-xs uppercase tracking-widest text-brand-burgundy hover:text-brand-gold sm:flex">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* The Allure Edit */}
      {featured ? (
        <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/5] overflow-hidden bg-brand-champagne">
            <Image src={featured.hero_image} alt={featured.name} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="max-w-md">
            <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">Featured Collection</p>
            <h2 className="mt-3 font-serif text-4xl font-light">{featured.name}</h2>
            <div className="py-4"><DiamondMotif className="text-sm" /></div>
            <p className="text-sm leading-relaxed text-brand-charcoal/75">{featured.description}</p>
            <Link href="/collections/the-allure-edit" className="mt-8 inline-block bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal">
              EXPLORE THE COLLECTION
            </Link>
          </div>
        </section>
      ) : null}

      {/* Anti-tarnish */}
      <section className="bg-brand-burgundy py-20 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="order-2 lg:order-1">
            <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">Our Promise</p>
            <h2 className="mt-3 font-serif text-4xl font-light">Made To Stay Beautiful</h2>
            <div className="py-4"><DiamondMotif className="text-sm" /></div>
            <p className="max-w-md text-sm leading-relaxed text-white/80">
              Every anti-tarnish piece is finished to resist fading, so your jewellery looks
              as new on the hundredth wear as it did on the first.
            </p>
            <Link href="/shop?filter=anti-tarnish" className="mt-8 inline-block border border-white/70 px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-white hover:text-brand-burgundy">
              SHOP ANTI-TARNISH
            </Link>
          </div>
          <div className="order-1 grid grid-cols-3 gap-3 lg:order-2">
            {antiTarnish.map((p) => (
              <Link key={p.id} href={`/product/${p.slug}`} className="relative aspect-[3/4] overflow-hidden bg-brand-champagne">
                <Image src={p.images[0]} alt={p.name} fill sizes="20vw" className="object-cover" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Home decor */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading title="Adorn Your Space" subtitle="Candles, vases, wall art and tablescapes — for a home that feels considered." />
        <div className="mt-12">
          <ProductGrid products={homeDecor.slice(0, 4)} />
        </div>
        <div className="mt-10 text-center">
          <Link href="/home-decor" className="border border-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white">
            SHOP HOME DECOR
          </Link>
        </div>
      </section>

      {/* Instagram */}
      <section className="bg-brand-champagne/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading title="Follow the Allure" subtitle="@allureadorn" />
          <div className="mt-10 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <a key={i} href="https://instagram.com/allureadorn" target="_blank" rel="noreferrer" className="relative aspect-square overflow-hidden bg-brand-champagne">
                <Image src={`/editorial/editorial-${20 + i}.jpg`} alt="Instagram post" fill sizes="16vw" className="object-cover transition-transform duration-500 hover:scale-110" />
              </a>
            ))}
          </div>
          <div className="mt-10 text-center">
            <a href="https://instagram.com/allureadorn" target="_blank" rel="noreferrer" className="bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal">
              FOLLOW US
            </a>
          </div>
        </div>
      </section>

      {/* Reviews — only when verified reviews exist */}
      {reviews.length > 0 ? (
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading title="Loved & Adorned" />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {reviews.map((r) => (
              <div key={r.id} className="border border-brand-champagne p-6">
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-champagne'}`} />
                  ))}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">{r.body}</p>
                <p className="mt-4 text-xs uppercase tracking-widest text-brand-gold">Verified Customer</p>
                <p className="text-xs text-brand-charcoal/50">{r.customer_name}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* Service strip */}
      <section className="border-y border-brand-champagne bg-brand-ivory py-14">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
          {SERVICE.map((s) => (
            <div key={s.title} className="text-center">
              <s.icon className="mx-auto h-6 w-6 text-brand-gold" />
              <h3 className="mt-3 font-serif text-lg">{s.title}</h3>
              <p className="mt-1 text-xs text-brand-charcoal/60">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center">
        <SectionHeading title="A Little More Allure" subtitle="Occasional notes on new arrivals, styling and private offers. No noise." />
        <form className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
          <input type="email" placeholder="Your email address" className="flex-1 border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy" />
          <button type="submit" className="bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white hover:bg-brand-charcoal">
            JOIN THE ALLURE LIST
          </button>
        </form>
      </section>
    </div>
  );
}
