'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, discountPercent } from '@/lib/format';
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
  const wished = has(product.id);
  const off = discountPercent(product.price, product.compare_at_price);
  const hover = product.hover_image || product.images[0];

  return (
    <div className={cn('group relative', className)}>
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-champagne">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          <Image
            src={hover}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 768px) 50vw, 25vw"
            className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1">
          {product.is_new_arrival ? (
            <span className="bg-brand-burgundy px-2 py-0.5 text-[10px] tracking-widest text-white">
              NEW
            </span>
          ) : null}
          {off > 0 ? (
            <span className="bg-brand-gold px-2 py-0.5 text-[10px] tracking-widest text-white">
              {off}% OFF
            </span>
          ) : null}
          {product.is_anti_tarnish ? (
            <span className="border border-brand-gold bg-brand-ivory/90 px-2 py-0.5 text-[10px] tracking-widest text-brand-gold">
              ANTI-TARNISH
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => toggle(product.id)}
          aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          aria-pressed={wished}
          className="absolute right-3 top-3 rounded-full bg-brand-ivory/90 p-2 text-brand-charcoal transition hover:text-brand-burgundy"
        >
          <Heart className={cn('h-4 w-4', wished && 'fill-brand-burgundy text-brand-burgundy')} />
        </button>

        <div className="absolute inset-x-0 bottom-0 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <button
            type="button"
            onClick={() => {
              add({
                product_id: product.id,
                slug: product.slug,
                name: product.name,
                image: product.images[0],
                price: product.price,
                anti_tarnish: product.is_anti_tarnish,
              });
              openCart();
            }}
            className="flex w-full items-center justify-center gap-2 bg-brand-burgundy py-2.5 text-[11px] tracking-widest text-white transition hover:bg-brand-charcoal"
          >
            <ShoppingBag className="h-4 w-4" /> ADD TO CART
          </button>
        </div>
      </div>

      <div className="pt-3 text-center">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-serif text-base text-brand-charcoal transition hover:text-brand-burgundy">
            {product.name}
          </h3>
        </Link>
        <div className="mt-1 flex items-center justify-center gap-2 text-sm">
          <span className="text-brand-charcoal">{formatINR(product.price)}</span>
          {product.compare_at_price && product.compare_at_price > product.price ? (
            <span className="text-brand-charcoal/40 line-through">
              {formatINR(product.compare_at_price)}
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
