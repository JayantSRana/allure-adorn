'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { Order } from '@/types';
import { formatINR, ORDER_STATUS_LABELS } from '@/lib/format';

export default function TrackPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'order' | 'phone'>('order');
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState<Order[]>([]);

  const search = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResults([]);
    setLoading(true);
    try {
      if (mode === 'phone') {
        const res = await fetch(`/api/track?phone=${encodeURIComponent(value.trim())}`, {
          cache: 'no-store',
        });
        const data = await res.json();
        if (!data.orders || data.orders.length === 0) {
          setError('No orders found for that number.');
        } else {
          setResults(data.orders);
        }
      } else {
        const res = await fetch(`/api/orders/${encodeURIComponent(value.trim())}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            router.push(`/order/${data.order.id}`);
            return;
          }
        }
        setError('No order found with that reference.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-ivory py-16">
      <div className="mx-auto max-w-2xl px-4">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">Track Your Order</h1>
          <div className="flex justify-center py-3">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="text-sm text-brand-charcoal/60">
            Enter your order number or the mobile number used at checkout.
          </p>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          <button
            onClick={() => setMode('order')}
            className={`px-4 py-2 text-xs tracking-widest ${mode === 'order' ? 'bg-brand-burgundy text-white' : 'border border-brand-champagne'}`}
          >
            ORDER NUMBER
          </button>
          <button
            onClick={() => setMode('phone')}
            className={`px-4 py-2 text-xs tracking-widest ${mode === 'phone' ? 'bg-brand-burgundy text-white' : 'border border-brand-champagne'}`}
          >
            MOBILE NUMBER
          </button>
        </div>

        <form onSubmit={search} className="mt-6 flex flex-col gap-3 sm:flex-row">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={mode === 'order' ? 'e.g. #AA-261011-0001' : 'e.g. 9876543210'}
            className="flex-1 border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
          >
            {loading ? 'SEARCHING…' : 'TRACK'}
          </button>
        </form>

        {error ? <p className="mt-4 text-center text-sm text-brand-burgundy">{error}</p> : null}

        {results.length > 0 ? (
          <ul className="mt-8 space-y-3">
            {results.map((o) => (
              <li key={o.id}>
                <a
                  href={`/order/${o.id}`}
                  className="flex items-center justify-between border border-brand-champagne bg-white/60 p-4 text-sm hover:border-brand-gold"
                >
                  <span>
                    <span className="font-medium">{o.order_number}</span>
                    <span className="block text-xs text-brand-charcoal/50">
                      {ORDER_STATUS_LABELS[o.status]} · {o.items.length} item(s)
                    </span>
                  </span>
                  <span>{formatINR(o.total_amount)}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
