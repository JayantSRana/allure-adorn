'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { HeroSlideItem } from '@/types';

type Slide = Omit<HeroSlideItem, 'id'> & { id?: string };

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const activeSlides = slides.filter((s) => s.is_active !== false);
  const [i, setI] = useState(0);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const t = setInterval(
      () => setI((n) => (n + 1) % activeSlides.length),
      6000,
    );
    return () => clearInterval(t);
  }, [activeSlides.length]);

  if (activeSlides.length === 0) return null;
  const safeIndex = i % activeSlides.length;
  const slide = activeSlides[safeIndex];

  const primaryText = slide.primary_cta_text || 'SHOP JEWELLERY';
  const primaryHref = slide.primary_cta_href || '/shop?category=JEWELLERY';
  const secondaryText = slide.secondary_cta_text ?? 'EXPLORE BANGLES';
  const secondaryHref = slide.secondary_cta_href || '/bangles';

  return (
    <section className="relative h-[78vh] min-h-[520px] w-full overflow-hidden bg-brand-champagne">
      {activeSlides.map((s, idx) => (
        <div
          key={(s.id || s.image) + idx}
          className={`absolute inset-0 transition-opacity duration-[1500ms] ease-in-out ${
            idx === safeIndex ? 'opacity-100' : 'opacity-0'
          }`}
          aria-hidden={idx !== safeIndex}
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
          {slide.eyebrow ? (
            <p className="mb-4 text-[11px] uppercase tracking-[0.4em] text-brand-gold">
              {slide.eyebrow}
            </p>
          ) : null}
          <h1 className="font-serif text-4xl font-light leading-tight sm:text-6xl">
            {slide.headline}
          </h1>
          {slide.sub ? (
            <p className="mt-5 max-w-md text-sm text-white/85 sm:text-base">
              {slide.sub}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryText ? (
              <Link
                href={primaryHref}
                className="bg-brand-burgundy px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-brand-charcoal"
              >
                {primaryText}
              </Link>
            ) : null}
            {secondaryText ? (
              <Link
                href={secondaryHref}
                className="border border-white/70 px-8 py-3.5 text-xs tracking-widest text-white transition hover:bg-white hover:text-brand-charcoal"
              >
                {secondaryText}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {activeSlides.length > 1 ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all ${
                idx === safeIndex ? 'w-8 bg-brand-gold' : 'w-4 bg-white/50'
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}

