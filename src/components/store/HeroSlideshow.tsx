'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Slide {
  image: string;
  eyebrow: string;
  headline: string;
  sub: string;
}

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => setI((n) => (n + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[i];

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-brand-champagne">
      {slides.map((s, idx) => (
        <div
          key={s.image + idx}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            idx === i ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={idx !== i}
        >
          <Image
            src={s.image}
            alt={s.headline}
            fill
            priority={idx === 0}
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/55 via-brand-charcoal/20 to-transparent" />
        </div>
      ))}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl text-white">
          <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-gold">
            {slide.eyebrow}
          </p>
          <h1 className="font-serif text-4xl font-light leading-tight sm:text-6xl">
            {slide.headline}
          </h1>
          <p className="mt-5 max-w-md text-sm text-white/85 sm:text-base">{slide.sub}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop?category=JEWELLERY"
              className="bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-brand-charcoal"
            >
              SHOP JEWELLERY
            </Link>
            <Link
              href="/bangles"
              className="border border-white/70 px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-white hover:text-brand-charcoal"
            >
              EXPLORE BANGLES
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-1.5 transition-all ${
              idx === i ? 'w-8 bg-brand-gold' : 'w-4 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
