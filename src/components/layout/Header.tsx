'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { DiamondMotif } from '@/components/store/DiamondMotif';

const MEGA = [
  {
    heading: 'Jewellery',
    links: [
      { label: 'All Jewellery', href: '/shop?category=JEWELLERY' },
      { label: 'Earrings', href: '/shop?category=EARRINGS' },
      { label: 'Necklaces', href: '/shop?category=NECKLACES' },
      { label: 'Rings', href: '/shop?category=RINGS' },
      { label: 'Anti-Tarnish Edit', href: '/shop?filter=anti-tarnish' },
    ],
  },
  {
    heading: 'Categories',
    links: [
      { label: 'Signature Bangles', href: '/bangles' },
      { label: 'Navira Home Decor', href: '/home-decor' },
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
    ],
  },
  {
    heading: 'Curated Edits',
    links: [
      { label: 'The Allure Edit', href: '/collections/the-allure-edit' },
      { label: 'The Wedding Edit', href: '/collections/the-wedding-edit' },
      { label: 'Festive Edit', href: '/collections/festive-edit' },
      { label: 'Everyday Allure', href: '/collections/everyday-allure' },
    ],
  },
];

const QUICK_SEARCH_TAGS = [
  'Anti-Tarnish',
  'Kundan',
  'Bangles',
  'Earrings',
  'Candles',
  'Vases',
];

export default function Header({
  announcement,
}: {
  announcement?: string;
}) {
  const { count, openCart, hydrated } = useCart();
  const { count: wishCount, hydrated: wishHydrated } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const router = useRouter();

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    router.push(`/shop?q=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
  };

  return (
    <>
      {announcement ? (
        <div className="border-b border-white/10 bg-brand-burgundy px-4 py-2 text-center text-[10px] uppercase tracking-[0.25em] text-brand-ivory sm:text-[11px]">
          <span>{announcement}</span>
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-brand-champagne/90 bg-brand-ivory/95 shadow-[0_4px_24px_-12px_rgba(23,23,23,0.06)] backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left (Mobile Hamburger) */}
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
                className="p-1 text-brand-charcoal transition hover:text-brand-burgundy"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>

            {/* Brand Logo */}
            <Link href="/" className="group flex shrink-0 flex-col items-center lg:items-start">
              <span className="font-serif text-xl tracking-[0.28em] text-brand-charcoal transition-colors group-hover:text-brand-burgundy sm:text-2xl">
                ALLURE ADORN
              </span>
              <span className="hidden items-center gap-1.5 text-[8px] uppercase tracking-[0.38em] text-brand-gold sm:flex">
                <span>◆</span> Jewellery &amp; Home <span>◆</span>
              </span>
            </Link>

            {/* Centre Nav */}
            <nav className="hidden items-center gap-8 lg:flex">
              <Link href="/" className="nav-link-luxury">
                Home
              </Link>
              <div
                className="relative py-6"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  href="/shop"
                  className="nav-link-luxury flex items-center gap-1"
                >
                  Boutique{' '}
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-300 ${
                      megaOpen ? 'rotate-180 text-brand-gold' : ''
                    }`}
                  />
                </Link>
                {megaOpen ? (
                  <div className="absolute left-1/2 top-full w-[780px] -translate-x-1/2 border border-brand-champagne bg-brand-ivory p-8 shadow-2xl">
                    <div className="grid grid-cols-4 gap-8">
                      {MEGA.map((col) => (
                        <div key={col.heading}>
                          <h4 className="mb-3 border-b border-brand-champagne pb-2 text-[10px] uppercase tracking-[0.28em] text-brand-gold">
                            {col.heading}
                          </h4>
                          <ul className="space-y-2.5">
                            {col.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="block text-sm text-brand-charcoal/80 transition hover:translate-x-0.5 hover:text-brand-burgundy"
                                >
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      {/* Editorial Spotlight inside Mega Menu */}
                      <Link
                        href="/collections/the-allure-edit"
                        onClick={() => setMegaOpen(false)}
                        className="group relative aspect-[4/5] overflow-hidden bg-brand-champagne"
                      >
                        <Image
                          src="/editorial/editorial-2.jpg"
                          alt="The Allure Edit"
                          fill
                          sizes="200px"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/75 via-brand-charcoal/20 to-transparent" />
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          <p className="text-[9px] uppercase tracking-[0.3em] text-brand-gold">
                            Featured
                          </p>
                          <p className="mt-0.5 font-serif text-base">
                            The Allure Edit
                          </p>
                          <span className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-white/85 group-hover:text-brand-gold">
                            Explore <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </div>
                ) : null}
              </div>
              <Link href="/bangles" className="nav-link-luxury">
                Bangles
              </Link>
              <Link href="/home-decor" className="nav-link-luxury">
                Home Decor
              </Link>
              <Link href="/about" className="nav-link-luxury">
                Our Story
              </Link>
              <Link href="/contact" className="nav-link-luxury">
                Contact
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button
                aria-label="Search"
                onClick={() => setSearchOpen((s) => !s)}
                className="p-1 text-brand-charcoal transition hover:text-brand-burgundy"
              >
                <Search className="h-5 w-5" />
              </button>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative hidden p-1 text-brand-charcoal transition hover:text-brand-burgundy sm:block"
              >
                <Heart className="h-5 w-5" />
                {wishHydrated && wishCount > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-burgundy text-[10px] font-medium text-white">
                    {wishCount}
                  </span>
                ) : null}
              </Link>
              <Link
                href="/track"
                aria-label="Track orders"
                title="Track Order"
                className="hidden p-1 text-brand-charcoal transition hover:text-brand-burgundy sm:block"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                aria-label="Open cart"
                className="relative p-1 text-brand-charcoal transition hover:text-brand-burgundy"
              >
                <ShoppingBag className="h-5 w-5" />
                {hydrated && count > 0 ? (
                  <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-burgundy text-[10px] font-medium text-white">
                    {count}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {/* Expandable Search Bar with Quick Suggestions */}
          {searchOpen ? (
            <div className="border-t border-brand-champagne py-4">
              <form onSubmit={submitSearch} className="relative">
                <input
                  autoFocus
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Search kundan earrings, glass bangles, scented candles…"
                  aria-label="Search products"
                  className="w-full border border-brand-champagne bg-white py-3 pl-4 pr-24 text-sm outline-none transition focus:border-brand-burgundy"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bg-brand-burgundy px-4 py-2 text-[10px] uppercase tracking-widest text-white transition hover:bg-brand-charcoal"
                >
                  Search
                </button>
              </form>
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                <span className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-brand-gold">
                  <Sparkles className="h-3 w-3" /> Popular:
                </span>
                {QUICK_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      router.push(`/shop?q=${encodeURIComponent(tag)}`);
                      setSearchOpen(false);
                    }}
                    className="border border-brand-champagne bg-white/70 px-2.5 py-0.5 text-[11px] text-brand-charcoal/70 transition hover:border-brand-gold hover:text-brand-burgundy"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden ${
          mobileOpen ? '' : 'pointer-events-none'
        }`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs transition-opacity ${
            mobileOpen ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col justify-between overflow-y-auto bg-brand-ivory p-6 shadow-2xl transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <span className="font-serif text-lg tracking-[0.22em]">
                  ALLURE ADORN
                </span>
                <div className="mt-0.5">
                  <DiamondMotif className="text-[10px]" />
                </div>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="p-1 text-brand-charcoal/70 hover:text-brand-burgundy"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="mt-6 space-y-4">
              {[
                { href: '/', label: 'Home' },
                { href: '/shop', label: 'Shop All' },
                { href: '/shop?filter=new', label: 'New Arrivals' },
                { href: '/bangles', label: 'Signature Bangles' },
                { href: '/home-decor', label: 'Navira Home Decor' },
                {
                  href: '/wishlist',
                  label: `Wishlist${wishHydrated && wishCount > 0 ? ` (${wishCount})` : ''}`,
                },
                { href: '/track', label: 'Track Order' },
                { href: '/about', label: 'Our Story' },
                { href: '/contact', label: 'Contact Us' },
                { href: '/faqs', label: 'FAQs' },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-between border-b border-brand-champagne pb-3 text-xs uppercase tracking-[0.2em] text-brand-charcoal hover:text-brand-burgundy"
                >
                  <span>{l.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-brand-gold" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-8 border-t border-brand-champagne pt-4 text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-brand-gold">
              Quiet Luxury · Handpicked
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
