'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/format';
import { useEffect, useState } from 'react';

export default function CartDrawer({
  freeShippingThreshold = 3000,
}: {
  freeShippingThreshold?: number;
}) {
  const { lines, isOpen, closeCart, setQty, remove, subtotal, count } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!mounted) return null;

  const remaining = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <>
      <div
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-brand-charcoal/40 backdrop-blur-sm transition-opacity ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden="true"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-brand-ivory shadow-2xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-brand-champagne px-5 py-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-burgundy" />
            <h2 className="font-serif text-lg tracking-wide">
              Your Cart {count > 0 ? `(${count})` : ''}
            </h2>
          </div>
          <button onClick={closeCart} aria-label="Close cart" className="p-1 hover:text-brand-burgundy">
            <X className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-10 w-10 text-brand-gold" />
            <p className="font-serif text-xl">Your cart is empty</p>
            <p className="text-sm text-brand-charcoal/60">
              Discover pieces made to be remembered.
            </p>
            <Link
              href="/shop"
              onClick={closeCart}
              className="mt-2 bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white"
            >
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <>
            <div className="border-b border-brand-champagne bg-brand-champagne/40 px-5 py-3.5 text-center text-xs">
              {remaining > 0 ? (
                <p>
                  Add <strong className="text-brand-burgundy">{formatINR(remaining)}</strong> more for{' '}
                  <span className="uppercase tracking-wider text-brand-gold">Free Shipping</span>
                </p>
              ) : (
                <span className="font-medium tracking-wider text-brand-burgundy">
                  ✦ Complimentary Luxury Shipping Unlocked ✦
                </span>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden bg-brand-champagne">
                <div
                  className="h-full bg-brand-gold transition-all duration-500"
                  style={{
                    width: `${Math.min(100, Math.round((subtotal / Math.max(1, freeShippingThreshold)) * 100))}%`,
                  }}
                />
              </div>
            </div>


            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="space-y-4">
                {lines.map((l) => (
                  <li
                    key={`${l.product_id}-${l.size ?? ''}`}
                    className="flex gap-3 border-b border-brand-champagne pb-4"
                  >
                    <Link
                      href={`/product/${l.slug}`}
                      onClick={closeCart}
                      className="relative h-24 w-20 shrink-0 overflow-hidden bg-brand-champagne"
                    >
                      <Image src={l.image} alt={l.name} fill sizes="80px" className="object-cover" />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/product/${l.slug}`}
                          onClick={closeCart}
                          className="font-serif text-sm leading-snug hover:text-brand-burgundy"
                        >
                          {l.name}
                        </Link>
                        <button
                          onClick={() => remove(l.product_id, l.size)}
                          aria-label={`Remove ${l.name}`}
                          className="text-brand-charcoal/40 hover:text-brand-burgundy"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      {l.size ? (
                        <span className="mt-0.5 text-xs text-brand-charcoal/50">Size {l.size}</span>
                      ) : null}
                      <div className="mt-auto flex items-center justify-between pt-2">
                        <div className="flex items-center border border-brand-champagne">
                          <button
                            onClick={() => setQty(l.product_id, l.size, l.qty - 1)}
                            aria-label="Decrease quantity"
                            className="px-2 py-1 hover:text-brand-burgundy"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="min-w-[2rem] text-center text-sm">{l.qty}</span>
                          <button
                            onClick={() => setQty(l.product_id, l.size, l.qty + 1)}
                            aria-label="Increase quantity"
                            className="px-2 py-1 hover:text-brand-burgundy"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <span className="text-sm">{formatINR(l.price * l.qty)}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-brand-champagne px-5 py-4">
              <div className="flex justify-between text-sm">
                <span className="tracking-wide">Subtotal</span>
                <span className="font-medium">{formatINR(subtotal)}</span>
              </div>
              <p className="mt-1 text-xs text-brand-charcoal/50">
                Shipping & taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="mt-4 block w-full bg-brand-burgundy py-3.5 text-center text-xs tracking-widest text-white transition hover:bg-brand-charcoal"
              >
                PROCEED TO CHECKOUT
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-2 block w-full border border-brand-burgundy py-3 text-center text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
              >
                VIEW CART
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
