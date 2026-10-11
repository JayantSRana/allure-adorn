'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/format';
import { DiamondMotif } from '@/components/store/DiamondMotif';

export default function CartPage() {
  const { lines, subtotal, setQty, remove, hydrated } = useCart();

  return (
    <div className="bg-brand-ivory py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">Your Cart</h1>
          <div className="flex justify-center py-3">
            <DiamondMotif className="text-sm" />
          </div>
        </div>

        {!hydrated ? (
          <div className="py-20 text-center text-brand-charcoal/50">Loading…</div>
        ) : lines.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-20 text-center">
            <ShoppingBag className="h-12 w-12 text-brand-gold" />
            <p className="font-serif text-2xl">Your cart is empty</p>
            <Link href="/shop" className="mt-2 bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white">
              START SHOPPING
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <ul className="divide-y divide-brand-champagne border-y border-brand-champagne">
                {lines.map((l) => (
                  <li key={`${l.product_id}-${l.size ?? ''}`} className="flex gap-4 py-5">
                    <Link href={`/product/${l.slug}`} className="relative h-32 w-24 shrink-0 overflow-hidden bg-brand-champagne">
                      <Image src={l.image} alt={l.name} fill sizes="96px" className="object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <Link href={`/product/${l.slug}`} className="font-serif text-lg hover:text-brand-burgundy">
                          {l.name}
                        </Link>
                        <button onClick={() => remove(l.product_id, l.size)} aria-label="Remove" className="text-brand-charcoal/40 hover:text-brand-burgundy">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {l.size ? <span className="text-xs text-brand-charcoal/50">Size {l.size}</span> : null}
                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex items-center border border-brand-champagne">
                          <button onClick={() => setQty(l.product_id, l.size, l.qty - 1)} className="px-3 py-2 hover:text-brand-burgundy" aria-label="Decrease">
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm">{l.qty}</span>
                          <button onClick={() => setQty(l.product_id, l.size, l.qty + 1)} className="px-3 py-2 hover:text-brand-burgundy" aria-label="Increase">
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-base">{formatINR(l.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-fit border border-brand-champagne bg-brand-champagne/20 p-6">
              <h2 className="font-serif text-xl">Order Summary</h2>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex justify-between text-brand-charcoal/60">
                  <span>Shipping</span>
                  <span>{subtotal >= 3000 ? 'Free' : formatINR(150)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t border-brand-champagne pt-4 text-base font-medium">
                <span>Total</span>
                <span>{formatINR(subtotal >= 3000 ? subtotal : subtotal + 150)}</span>
              </div>
              <Link href="/checkout" className="mt-6 block w-full bg-brand-burgundy py-3.5 text-center text-xs tracking-widest text-white hover:bg-brand-charcoal">
                PROCEED TO CHECKOUT
              </Link>
              <Link href="/shop" className="mt-2 block w-full border border-brand-burgundy py-3 text-center text-xs tracking-widest text-brand-burgundy hover:bg-brand-burgundy hover:text-white">
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
