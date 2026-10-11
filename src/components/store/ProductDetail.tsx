'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  Heart,
  Minus,
  Plus,
  ShoppingBag,
  MessageCircle,
  ChevronDown,
  Star,
  ShieldCheck,
  Truck,
} from 'lucide-react';
import { Product } from '@/types';
import { formatINR, discountPercent } from '@/lib/format';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';
import { cn } from '@/lib/utils';

function Collapsible({
  title,
  children,
  defaultOpen,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-brand-champagne">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between py-4 text-left text-xs uppercase tracking-widest"
      >
        {title}
        <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
      {open ? <div className="pb-5 text-sm leading-relaxed text-brand-charcoal/75">{children}</div> : null}
    </div>
  );
}

export default function ProductDetail({ product }: { product: Product }) {
  const { add, openCart } = useCart();
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [size, setSize] = useState(product.size_options[0] ?? '');
  const [qty, setQty] = useState(1);
  const { has: hasWished, toggle: toggleWished } = useWishlist();
  const wished = hasWished(product.id);

  const off = discountPercent(product.price, product.compare_at_price);
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const addLine = (goToCheckout = false) => {
    add({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      qty,
      size: size || undefined,
      anti_tarnish: product.is_anti_tarnish,
    });
    if (goToCheckout) router.push('/checkout');
    else openCart();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* Gallery */}
        <div className="flex flex-col-reverse gap-4 sm:flex-row">
          <div className="flex gap-3 sm:flex-col">
            {product.images.map((img, i) => (
              <button
                key={img + i}
                onClick={() => setActive(i)}
                className={cn(
                  'relative h-20 w-16 shrink-0 overflow-hidden border transition',
                  active === i ? 'border-brand-burgundy' : 'border-brand-champagne',
                )}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img} alt="" fill sizes="64px" className="object-cover" />
              </button>
            ))}
          </div>
          <div className="relative aspect-[4/5] flex-1 overflow-hidden bg-brand-champagne">
            <Image
              src={product.images[active]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {off > 0 ? (
              <span className="absolute left-4 top-4 bg-brand-gold px-3 py-1 text-[11px] tracking-widest text-white">
                {off}% OFF
              </span>
            ) : null}
          </div>
        </div>

        {/* Info */}
        <div>
          <p className="mb-2 text-[11px] uppercase tracking-[0.3em] text-brand-gold">
            {product.sub_category || product.category}
          </p>
          <h1 className="font-serif text-3xl font-light tracking-wide sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-brand-charcoal/60">
            <span className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    'h-3.5 w-3.5',
                    i < Math.round(product.rating_avg)
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-brand-champagne',
                  )}
                />
              ))}
            </span>
            <span>{product.rating_count > 0 ? `${product.rating_avg.toFixed(1)} (${product.rating_count})` : 'New'}</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-2xl text-brand-charcoal">{formatINR(product.price)}</span>
            {product.compare_at_price && product.compare_at_price > product.price ? (
              <span className="text-lg text-brand-charcoal/40 line-through">
                {formatINR(product.compare_at_price)}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-brand-charcoal/50">Inclusive of all taxes</p>

          <p className="mt-5 text-sm leading-relaxed text-brand-charcoal/80">
            {product.description_short}
          </p>

          {product.is_anti_tarnish ? (
            <div className="mt-4 inline-flex items-center gap-2 border border-brand-gold/40 bg-brand-champagne/40 px-3 py-1.5 text-xs text-brand-gold">
              <ShieldCheck className="h-4 w-4" /> Anti-Tarnish — made to stay beautiful
            </div>
          ) : null}

          {/* Size */}
          {product.size_options.length > 0 ? (
            <div className="mt-6">
              <p className="mb-2 text-xs uppercase tracking-widest text-brand-charcoal/60">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.size_options.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={cn(
                      'min-w-[3rem] border px-3 py-2 text-sm transition',
                      size === s
                        ? 'border-brand-burgundy bg-brand-burgundy text-white'
                        : 'border-brand-champagne hover:border-brand-gold',
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* Quantity + actions */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center border border-brand-champagne">
              <button onClick={() => setQty((n) => Math.max(1, n - 1))} aria-label="Decrease" className="px-3 py-3 hover:text-brand-burgundy">
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2.5rem] text-center">{qty}</span>
              <button onClick={() => setQty((n) => n + 1)} aria-label="Increase" className="px-3 py-3 hover:text-brand-burgundy">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <span className="text-sm text-brand-charcoal/60">
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <button
              onClick={() => addLine(false)}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-2 bg-brand-burgundy py-4 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-40"
            >
              <ShoppingBag className="h-4 w-4" /> ADD TO CART
            </button>
            <button
              onClick={() => addLine(true)}
              disabled={product.stock <= 0}
              className="border border-brand-burgundy py-4 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white disabled:opacity-40"
            >
              BUY IT NOW
            </button>
          </div>

          <div className="mt-4 flex items-center gap-4 text-xs">
            <button onClick={() => toggleWished(product.id)} className="flex items-center gap-2 text-brand-charcoal/70 hover:text-brand-burgundy">
              <Heart className={cn('h-4 w-4', wished && 'fill-brand-burgundy text-brand-burgundy')} />
              {wished ? 'Saved' : 'Add to Wishlist'}
            </button>
            <a
              href={
                whatsapp
                  ? `https://wa.me/${whatsapp}?text=${encodeURIComponent(`Hi! I'd like to enquire about ${product.name}`)}`
                  : '/contact'
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-brand-charcoal/70 hover:text-brand-burgundy"
            >
              <MessageCircle className="h-4 w-4" /> Enquire about this piece
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2 text-xs text-brand-charcoal/60">
            <Truck className="h-4 w-4 text-brand-gold" /> Worldwide shipping · Secure packaging · Easy returns
          </div>

          {/* Collapsibles */}
          <div className="mt-8">
            <Collapsible title="Description" defaultOpen>
              <p>{product.description_long}</p>
            </Collapsible>
            <Collapsible title="Material & Details">
              <ul className="space-y-2">
                {product.material ? <li><span className="text-brand-charcoal/50">Material:</span> {product.material}</li> : null}
                {product.finish ? <li><span className="text-brand-charcoal/50">Finish:</span> {product.finish}</li> : null}
                {product.colour ? <li><span className="text-brand-charcoal/50">Colour:</span> {product.colour}</li> : null}
                {product.dimensions ? <li><span className="text-brand-charcoal/50">Dimensions:</span> {product.dimensions}</li> : null}
                {product.weight ? <li><span className="text-brand-charcoal/50">Weight:</span> {product.weight} g</li> : null}
              </ul>
            </Collapsible>
            {product.size_options.length > 0 ? (
              <Collapsible title="Size & Fit">
                <p>Available in {product.size_options.join(', ')}. If you are between sizes, we recommend sizing up.</p>
              </Collapsible>
            ) : null}
            <Collapsible title="Jewellery Care">
              <p>{product.care_instructions}</p>
            </Collapsible>
            <Collapsible title="Shipping">
              <p>
                Dispatched within 2–4 business days. Free shipping on orders above ₹3,000.
                International shipping available to Canada, Australia, UK, Russia and more.
              </p>
            </Collapsible>
            <Collapsible title="Returns & Exchange">
              <p>
                We accept returns within 7 days of delivery for unused items in original
                packaging. Customised and pierced items are non-returnable.
              </p>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
}
