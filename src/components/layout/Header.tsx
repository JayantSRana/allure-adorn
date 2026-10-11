'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, Search, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="border-b border-brand-champagne bg-brand-ivory/95 backdrop-blur sticky top-0 z-50">
      <div className="bg-brand-burgundy text-white py-2 text-center text-xs">
        <p className="tracking-wide">✨ Worldwide Shipping Available | Free shipping above ₹3000 ✨</p>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Link href="/">
              <h1 className="text-2xl font-semibold tracking-[0.2em] text-brand-charcoal">ALLURE ADORN</h1>
            </Link>
          </div>
          <nav className="hidden md:flex space-x-10">
            <Link href="/" className="text-xs tracking-widest text-brand-charcoal hover:text-brand-burgundy transition-colors uppercase">Home</Link>
            <Link href="/shop" className="text-xs tracking-widest text-brand-charcoal hover:text-brand-burgundy transition-colors uppercase">Shop</Link>
            <Link href="/about" className="text-xs tracking-widest text-brand-charcoal hover:text-brand-burgundy transition-colors uppercase">About</Link>
            <Link href="/contact" className="text-xs tracking-widest text-brand-charcoal hover:text-brand-burgundy transition-colors uppercase">Contact</Link>
          </nav>
          <div className="flex items-center space-x-6">
            <Search className="w-5 h-5 text-brand-charcoal hover:text-brand-burgundy transition-colors cursor-pointer" />
            <Heart className="w-5 h-5 text-brand-charcoal hover:text-brand-burgundy transition-colors cursor-pointer" />
            <User className="w-5 h-5 text-brand-charcoal hover:text-brand-burgundy transition-colors cursor-pointer" />
            <ShoppingBag className="w-5 h-5 text-brand-charcoal hover:text-brand-burgundy transition-colors cursor-pointer" />
          </div>
        </div>
      </div>
    </header>
  );
}
