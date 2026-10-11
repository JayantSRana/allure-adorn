'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  Search,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

const MEGA = [
  {
    heading: 'Jewellery',
    links: [
      { label: 'All Jewellery', href: '/shop?category=JEWELLERY' },
      { label: 'Earrings', href: '/shop?category=EARRINGS' },
      { label: 'Necklaces', href: '/shop?category=NECKLACES' },
      { label: 'Rings', href: '/shop?category=RINGS' },
    ],
  },
  {
    heading: 'Shop',
    links: [
      { label: 'Bangles', href: '/bangles' },
      { label: 'Home Decor', href: '/home-decor' },
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Best Sellers', href: '/shop?filter=bestsellers' },
    ],
  },
  {
    heading: 'Collections',
    links: [
      { label: 'The Allure Edit', href: '/collections/the-allure-edit' },
      { label: 'The Wedding Edit', href: '/collections/the-wedding-edit' },
      { label: 'Festive Edit', href: '/collections/festive-edit' },
      { label: 'Everyday Allure', href: '/collections/everyday-allure' },
    ],
  },
];

export default function Header({
  announcement,
}: {
  announcement?: string;
}) {
  const { count, openCart, hydrated } = useCart();
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
        <div className="bg-brand-burgundy py-2 text-center text-[11px] tracking-widest text-white sm:text-xs">
          {announcement}
        </div>
      ) : null}

      <header className="sticky top-0 z-50 border-b border-brand-champagne bg-brand-ivory/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3 lg:hidden">
              <button onClick={() => setMobileOpen(true)} aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>

            <Link href="/" className="shrink-0">
              <span className="font-serif text-xl tracking-[0.25em] text-brand-charcoal sm:text-2xl">
                ALLURE ADORN
              </span>
            </Link>

            {/* Centre nav */}
            <nav className="hidden items-center gap-9 lg:flex">
              <Link href="/" className="text-xs uppercase tracking-widest hover:text-brand-burgundy">
                Home
              </Link>
              <div
                className="relative"
                onMouseEnter={() => setMegaOpen(true)}
                onMouseLeave={() => setMegaOpen(false)}
              >
                <Link
                  href="/shop"
                  className="flex items-center gap-1 text-xs uppercase tracking-widest hover:text-brand-burgundy"
                >
                  Shop <ChevronDown className="h-3 w-3" />
                </Link>
                {megaOpen ? (
                  <div className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 border border-brand-champagne bg-brand-ivory p-8 shadow-xl">
                    <div className="grid grid-cols-3 gap-8">
                      {MEGA.map((col) => (
                        <div key={col.heading}>
                          <h4 className="mb-3 text-[11px] uppercase tracking-widest text-brand-gold">
                            {col.heading}
                          </h4>
                          <ul className="space-y-2">
                            {col.links.map((l) => (
                              <li key={l.href}>
                                <Link
                                  href={l.href}
                                  onClick={() => setMegaOpen(false)}
                                  className="text-sm text-brand-charcoal/80 hover:text-brand-burgundy"
                                >
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <Link href="/about" className="text-xs uppercase tracking-widest hover:text-brand-burgundy">
                About
              </Link>
              <Link href="/contact" className="text-xs uppercase tracking-widest hover:text-brand-burgundy">
                Contact
              </Link>
            </nav>

            {/* Right */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button aria-label="Search" onClick={() => setSearchOpen((s) => !s)} className="hover:text-brand-burgundy">
                <Search className="h-5 w-5" />
              </button>
              <Link href="/shop?filter=bestsellers" aria-label="Wishlist" className="hidden hover:text-brand-burgundy sm:block">
                <Heart className="h-5 w-5" />
              </Link>
              <Link href="/track" aria-label="Account & orders" className="hidden hover:text-brand-burgundy sm:block">
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={openCart}
                aria-label="Open cart"
                className="relative hover:text-brand-burgundy"
              >
                <ShoppingBag className="h-5 w-5" />
                {hydrated && count > 0 ? (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-burgundy text-[10px] text-white">
                    {count}
                  </span>
                ) : null}
              </button>
            </div>
          </div>

          {searchOpen ? (
            <form onSubmit={submitSearch} className="border-t border-brand-champagne py-3">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search gold earrings, bangles for wedding, kundan…"
                className="w-full border border-brand-champagne bg-white px-4 py-2.5 text-sm outline-none focus:border-brand-burgundy"
              />
            </form>
          ) : null}
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-[80] lg:hidden ${mobileOpen ? '' : 'pointer-events-none'}`}
        aria-hidden={!mobileOpen}
      >
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-brand-charcoal/40 transition-opacity ${mobileOpen ? 'opacity-100' : 'opacity-0'}`}
        />
        <div
          className={`absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-brand-ivory p-6 shadow-2xl transition-transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <span className="font-serif text-lg tracking-[0.2em]">ALLURE ADORN</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <nav className="space-y-5">
            {[
              { href: '/', label: 'Home' },
              { href: '/shop', label: 'Shop' },
              { href: '/bangles', label: 'Bangles' },
              { href: '/home-decor', label: 'Home Decor' },
              { href: '/track', label: 'Track Order' },
              { href: '/about', label: 'About' },
              { href: '/contact', label: 'Contact' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block border-b border-brand-champagne pb-3 text-sm uppercase tracking-widest"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
