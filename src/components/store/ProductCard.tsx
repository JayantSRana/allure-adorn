'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, discountPercent, CATEGORY_LABELS } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { cn } from '@/lib/utils';

export default function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const { add, openCart } = useCart();
  const { has, toggle } = useWishlist();
  const [added, setAdded] = useState(false);

  const wished = has(product.id);
  const off = discountPercent(product.price, product.compare_at_price);
  const hover = product.hover_image || product.images[1] || product.images[0];
  const soldOut = product.stock <= 0;

  return (
    <div className={cn('group relative flex flex-col', className)}>
      <div className="relative aspect-[4/5] overflow-hidden border border-brand-champagne/60 bg-brand-champagne transition-colors duration-500 group-hover:border-brand-gold/70">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:opacity-0"
          />
          <Image
            src={hover}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        </Link>

        {/* Top Left Badges */}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {soldOut ? (
            <span className="bg-brand-charcoal px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white">
              Sold Out
            </span>
          ) : null}
          {!soldOut && product.is_new_arrival ? (
            <span className="bg-brand-burgundy px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white">
              New
            </span>
          ) : null}
          {!soldOut && off > 0 ? (
            <span className="bg-brand-gold px-2.5 py-0.5 text-[9px] uppercase tracking-[0.2em] text-white">
              {off}% Off
            </span>
          ) : null}
          {product.is_anti_tarnish ? (
            <span className="border border-brand-gold/80 bg-brand-ivory/95 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-brand-gold backdrop-blur-xs">
              Anti-Tarnish
            </span>
          ) : null}
        </div>

        {/* Wishlist Heart */}
        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 rounded-full border border-brand-champagne/80 bg-brand-ivory/90 p-2 text-brand-charcoal shadow-xs backdrop-blur-xs transition hover:border-brand-burgundy hover:text-brand-burgundy"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-transform active:scale-125',
              wished && 'fill-brand-burgundy text-brand-burgundy',
            )}
          />
        </button>

        {/* Quick Add To Cart Slide-Up Bar */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 ease-out group-hover:translate-y-0">
          <button
            type="button"
            disabled={soldOut}
            onClick={() => {
              if (soldOut) return;
              add({
                product_id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                price: product.price,
                anti_tarnish: product.is_anti_tarnish,
              });
              setAdded(true);
              setTimeout(() => setAdded(false), 1200);
              openCart();
            }}
            className={cn(
              'flex w-full items-center justify-center gap-2 py-2.5 text-[10px] uppercase tracking-[0.22em] text-white shadow-md transition',
              soldOut
                ? 'cursor-not-allowed bg-brand-charcoal/60'
                : added
                  ? 'bg-brand-charcoal'
                  : 'bg-brand-burgundy hover:bg-brand-charcoal',
            )}
          >
            {soldOut ? (
              'OUT OF STOCK'
            ) : added ? (
              <>
                <Check className="h-3.5 w-3.5 text-brand-gold" /> ADDED TO BAG
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" /> ADD TO CART
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-3.5 text-center">
        <p className="text-[9px] uppercase tracking-[0.28em] text-brand-gold">
          {product.sub_category ||
            CATEGORY_LABELS[product.category] ||
            product.category}
        </p>
        <Link href={`/product/${product.slug}`}>
          <h3 className="mt-1 font-serif text-lg leading-snug text-brand-charcoal transition hover:text-brand-burgundy">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1.5 flex items-center justify-center gap-2 text-sm">
          <span className="font-medium text-brand-charcoal">
            {formatINR(product.price)}
          </span>
          {product.compare_at_price &&
          product.compare_at_price > product.price ? (
            <span className="text-xs text-brand-charcoal/40 line-through">
              {formatINR(product.compare_at_price)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
