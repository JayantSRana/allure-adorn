import Image from 'next/image';
import Link from 'next/link';
import { DiamondMotif } from '@/components/store/DiamondMotif';

export const metadata = { title: 'Our Story | Allure Adorn' };

export default function AboutPage() {
  return (
    <div className="bg-brand-ivory">
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative aspect-[4/5] overflow-hidden bg-brand-champagne">
          <Image src="/editorial/editorial-4.jpg" alt="Allure Adorn" fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div className="max-w-lg">
          <p className="text-[11px] uppercase tracking-[0.35em] text-brand-gold">Our Story</p>
          <h1 className="mt-3 font-serif text-4xl font-light sm:text-5xl">The Story Behind Allure Adorn</h1>
          <div className="py-4"><DiamondMotif className="text-sm" /></div>
          <p className="text-sm leading-relaxed text-brand-charcoal/80">
            Allure Adorn was created from a love for jewellery, styling and the little
            details that make an outfit feel complete.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80">
            What began as a small collection shared with friends has grown into a boutique
            of considered pieces — jewellery that layers beautifully and home decor that
            makes a space feel finished. We believe in restraint over noise, quality over
            quantity, and pieces you will reach for again and again.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-brand-charcoal/80">
            Every piece is chosen with intention: anti-tarnish finishes that last, materials
            that feel as good as they look, and a palette that sits quietly alongside you.
          </p>
          <Link href="/shop" className="mt-8 inline-block bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal">
            EXPLORE THE BOUTIQUE
          </Link>
        </div>
      </section>
    </div>
  );
}
