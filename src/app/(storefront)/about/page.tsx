import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Sparkles, Gift } from 'lucide-react';
import { DiamondMotif, SectionHeading } from '@/components/store/DiamondMotif';

export const metadata = { title: 'Our Story | Allure Adorn' };

const PILLARS = [
  {
    icon: ShieldCheck,
    title: 'Anti-Tarnish Craftsmanship',
    text: 'Finished to resist fading and everyday moisture so your favourite pieces retain their warm lustre wear after wear.',
  },
  {
    icon: Sparkles,
    title: 'Restraint & Quiet Luxury',
    text: 'Curated in small batches — balancing modern minimal silhouettes with timeless heritage kundan, pearl and crystal work.',
  },
  {
    icon: Gift,
    title: 'Heirloom Presentation',
    text: 'Every order arrives in our signature protective packaging, ready to be gifted or treasured in your personal collection.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden border border-brand-champagne bg-brand-champagne">
          <Image
            src="/editorial/editorial-4.jpg"
            alt="Allure Adorn"
            fill
            sizes="(max-width:1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-lg">
          <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">
            Our Story
          </p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">
            The Story Behind Allure Adorn
          </h1>
          <div className="py-4">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="text-sm leading-relaxed text-brand-charcoal/80">
            Allure Adorn was created from a love for jewellery, styling and the
            little details that make an outfit — and a home — feel complete.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80">
            What began as an intimate curation shared with friends has grown
            into a dual-label boutique uniting <strong>Allure Adorn</strong>{' '}
            (fine fashion &amp; anti-tarnish jewellery) and{' '}
            <strong>Navira Home Decor</strong> (candles, sculptural vases, wall
            art and tablescapes).
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80">
            Every piece is chosen with intention: anti-tarnish finishes that
            last, materials that feel as good as they look, and a palette that
            sits quietly alongside you.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-brand-charcoal"
            >
              EXPLORE JEWELLERY
            </Link>
            <Link
              href="/home-decor"
              className="border border-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
            >
              EXPLORE HOME DECOR
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Pillars */}
      <section className="border-y border-brand-champagne bg-brand-champagne/30 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="The Allure Philosophy"
            subtitle="Three promises at the heart of every piece we curate."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {PILLARS.map((p) => (
              <div
                key={p.title}
                className="border border-brand-champagne bg-brand-ivory p-8 text-center"
              >
                <p.icon className="mx-auto h-7 w-7 text-brand-gold" />
                <h3 className="mt-4 font-serif text-2xl">{p.title}</h3>
                <div className="flex justify-center py-2">
                  <DiamondMotif count={3} className="text-xs" />
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
                  {p.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
