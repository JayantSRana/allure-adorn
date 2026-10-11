'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';
import { formatINR } from '@/lib/format';
import { DiamondMotif } from '@/components/store/DiamondMotif';

interface Settings {
  cod_enabled: boolean;
  free_shipping_threshold: number;
  shipping_fee_flat: number;
  store_open: boolean;
}

const inputCls =
  'w-full border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy';

export default function CheckoutForm({ settings }: { settings: Settings }) {
  const { lines, subtotal, clear, hydrated } = useCart();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [method, setMethod] = useState<'COD' | 'RAZORPAY_UPI'>(
    settings.cod_enabled ? 'COD' : 'RAZORPAY_UPI',
  );

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    notes: '',
  });

  const shipping = subtotal >= settings.free_shipping_threshold ? 0 : settings.shipping_fee_flat;
  const total = subtotal + shipping;

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[6-9]\d{9}$/.test(form.customer_phone)) {
      setError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }
    if (lines.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.customer_name,
          customer_phone: form.customer_phone,
          customer_email: form.customer_email,
          shipping_address: {
            line1: form.line1,
            line2: form.line2,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            country: form.country,
          },
          notes: form.notes,
          payment_method: method,
          items: lines.map((l) => ({
            product_id: l.product_id,
            slug: l.slug,
            name: l.name,
            image: l.image,
            price: l.price,
            cost_price: Math.round(l.price * 0.45),
            qty: l.qty,
            total: l.price * l.qty,
            total_cost: Math.round(l.price * 0.45) * l.qty,
            size: l.size,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.order) throw new Error(data.error || 'Could not place order');
      clear();
      router.push(`/order/${data.order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  };

  if (hydrated && lines.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="font-serif text-2xl">Your cart is empty</p>
        <p className="mt-2 text-sm text-brand-charcoal/60">Add a few pieces before checking out.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-3">
      <div className="space-y-8 lg:col-span-2">
        <section>
          <h2 className="mb-4 font-serif text-xl">Contact</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputCls} placeholder="Full name" required value={form.customer_name} onChange={set('customer_name')} />
            <input className={inputCls} placeholder="Mobile number (10 digits)" required value={form.customer_phone} onChange={set('customer_phone')} inputMode="numeric" />
            <input className={`${inputCls} sm:col-span-2`} type="email" placeholder="Email address" required value={form.customer_email} onChange={set('customer_email')} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl">Delivery Address</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={`${inputCls} sm:col-span-2`} placeholder="Address line 1" required value={form.line1} onChange={set('line1')} />
            <input className={`${inputCls} sm:col-span-2`} placeholder="Address line 2 (optional)" value={form.line2} onChange={set('line2')} />
            <input className={inputCls} placeholder="City" required value={form.city} onChange={set('city')} />
            <input className={inputCls} placeholder="State" required value={form.state} onChange={set('state')} />
            <input className={inputCls} placeholder="PIN code" required value={form.pincode} onChange={set('pincode')} inputMode="numeric" />
            <input className={inputCls} placeholder="Country" required value={form.country} onChange={set('country')} />
            <textarea className={`${inputCls} sm:col-span-2`} placeholder="Order notes (optional)" rows={2} value={form.notes} onChange={set('notes')} />
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-xl">Payment</h2>
          <div className="space-y-3">
            {settings.cod_enabled ? (
              <label className={`flex cursor-pointer items-center gap-3 border p-4 text-sm ${method === 'COD' ? 'border-brand-burgundy bg-brand-champagne/30' : 'border-brand-champagne'}`}>
                <input type="radio" name="method" checked={method === 'COD'} onChange={() => setMethod('COD')} />
                <span>Cash on Delivery / Pay on Confirmation</span>
              </label>
            ) : null}
            <label className={`flex cursor-pointer items-center gap-3 border p-4 text-sm ${method === 'RAZORPAY_UPI' ? 'border-brand-burgundy bg-brand-champagne/30' : 'border-brand-champagne'}`}>
              <input type="radio" name="method" checked={method === 'RAZORPAY_UPI'} onChange={() => setMethod('RAZORPAY_UPI')} />
              <span>Pay Online — UPI / Card / Net Banking <span className="text-brand-charcoal/50">(Demo mode)</span></span>
            </label>
          </div>
          {method === 'RAZORPAY_UPI' ? (
            <p className="mt-2 text-xs text-brand-charcoal/50">
              Online payments run in demo mode until Razorpay live keys are configured. Your
              order will be confirmed instantly.
            </p>
          ) : null}
        </section>
      </div>

      <div className="h-fit border border-brand-champagne bg-brand-champagne/20 p-6">
        <h2 className="font-serif text-xl">Order Summary</h2>
        <div className="mt-4 space-y-3">
          {lines.map((l) => (
            <div key={`${l.product_id}-${l.size ?? ''}`} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-brand-champagne">
                <Image src={l.image} alt={l.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1 text-xs">
                <p className="leading-snug">{l.name}</p>
                <p className="text-brand-charcoal/50">Qty {l.qty}{l.size ? ` · ${l.size}` : ''}</p>
              </div>
              <span className="text-xs">{formatINR(l.price * l.qty)}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 space-y-2 border-t border-brand-champagne pt-4 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
          <div className="flex justify-between text-brand-charcoal/60"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatINR(shipping)}</span></div>
          <div className="flex justify-between border-t border-brand-champagne pt-3 text-base font-medium"><span>Total</span><span>{formatINR(total)}</span></div>
        </div>

        {error ? <p className="mt-4 text-xs text-brand-burgundy">{error}</p> : null}

        <button type="submit" disabled={submitting} className="mt-5 w-full bg-brand-burgundy py-4 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-50">
          {submitting ? 'PLACING ORDER…' : 'PLACE ORDER'}
        </button>
        <div className="mt-4 flex justify-center">
          <DiamondMotif className="text-xs" />
        </div>
      </div>
    </form>
  );
}
