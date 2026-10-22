'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { HeroSlideItem } from '@/types';
import { DiamondMotif } from '@/components/store/DiamondMotif';

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

  const prev = () =>
    setI((n) => (n - 1 + activeSlides.length) % activeSlides.length);
  const next = () => setI((n) => (n + 1) % activeSlides.length);

  return (
    <section className="group relative h-[82vh] min-h-[540px] w-full overflow-hidden bg-brand-charcoal">
      {activeSlides.map((s, idx) => {
        const isCurrent = idx === safeIndex;
        return (
          <div
            key={(s.id || s.image) + idx}
            className={`absolute inset-0 transition-opacity duration-[1400ms] ease-in-out ${
              isCurrent ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!isCurrent}
          >
            <Image
              src={s.image}
              alt={s.headline}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover transition-transform duration-[7000ms] ease-out ${
                isCurrent ? 'scale-105' : 'scale-100'
              }`}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-charcoal/70 via-brand-charcoal/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/50 via-transparent to-transparent" />
          </div>
        );
      })}

      {/* Prev / Next Navigation Arrows */}
      {activeSlides.length > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 border border-white/25 bg-brand-charcoal/30 p-3 text-white/80 backdrop-blur-xs transition hover:border-brand-gold hover:bg-brand-burgundy hover:text-white md:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="absolute right-4 top-1/2 z-20 hidden -translate-y-1/2 border border-white/25 bg-brand-charcoal/30 p-3 text-white/80 backdrop-blur-xs transition hover:border-brand-gold hover:bg-brand-burgundy hover:text-white md:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      ) : null}

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl text-white">
          <div className="mb-3 flex items-center gap-3">
            <DiamondMotif count={3} className="text-xs" />
            {slide.eyebrow ? (
              <p className="text-[11px] uppercase tracking-[0.42em] text-brand-gold">
                {slide.eyebrow}
              </p>
            ) : null}
          </div>

          <h1 className="font-serif text-4xl font-light leading-[1.12] tracking-wide sm:text-6xl lg:text-[64px]">
            {slide.headline}
          </h1>

          {slide.sub ? (
            <p className="mt-5 max-w-lg text-sm leading-relaxed text-white/85 sm:text-base">
              {slide.sub}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap gap-4">
            {primaryText ? (
              <Link
                href={primaryHref}
                className="border border-brand-burgundy bg-brand-burgundy px-9 py-4 text-xs tracking-[0.22em] text-white shadow-lg transition duration-300 hover:border-brand-gold hover:bg-brand-charcoal"
              >
                {primaryText}
              </Link>
            ) : null}
            {secondaryText ? (
              <Link
                href={secondaryHref}
                className="border border-white/75 bg-white/5 px-9 py-4 text-xs tracking-[0.22em] text-white backdrop-blur-xs transition duration-300 hover:border-white hover:bg-white hover:text-brand-charcoal"
              >
                {secondaryText}
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      {activeSlides.length > 1 ? (
        <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setI(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`h-1.5 transition-all duration-500 ${
                idx === safeIndex
                  ? 'w-10 bg-brand-gold'
                  : 'w-4 bg-white/45 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
