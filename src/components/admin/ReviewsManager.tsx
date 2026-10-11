'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Check, X, ShieldCheck, Trash2, RefreshCw } from 'lucide-react';
import { Review, Product } from '@/types';
import { formatDate } from '@/lib/format';
import { StatusBadge } from '@/components/admin/ui';

export default function ReviewsManager({
  reviews,
  products,
}: {
  reviews: Review[];
  products: Product[];
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'unverified'>('all');
  const [busy, setBusy] = useState(false);

  const productName = useMemo(() => {
    const map: Record<string, string> = {};
    products.forEach((p) => (map[p.id] = p.name));
    return map;
  }, [products]);

  const filtered = reviews.filter((r) => {
    if (filter === 'pending') return !r.is_approved;
    if (filter === 'approved') return r.is_approved;
    if (filter === 'unverified') return !r.is_verified_purchase;
    return true;
  });

  const act = async (id: string, body: Record<string, unknown>) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this review?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const counts = {
    all: reviews.length,
    pending: reviews.filter((r) => !r.is_approved).length,
    approved: reviews.filter((r) => r.is_approved).length,
    unverified: reviews.filter((r) => !r.is_verified_purchase).length,
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          ['all', `All (${counts.all})`],
          ['pending', `Pending (${counts.pending})`],
          ['approved', `Approved (${counts.approved})`],
          ['unverified', `Unverified (${counts.unverified})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`border px-3 py-2 text-xs tracking-widest ${
              filter === key
                ? 'border-brand-burgundy bg-brand-burgundy text-white'
                : 'border-brand-champagne hover:border-brand-gold'
            }`}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="border border-brand-champagne bg-white/50 py-12 text-center text-sm text-brand-charcoal/45">
            No reviews in this view.
          </p>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="border border-brand-champagne bg-white/60 p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-brand-gold text-brand-gold' : 'text-brand-champagne'}`}
                        />
                      ))}
                    </span>
                    <span className="font-medium">{r.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-brand-charcoal/50">
                    {r.customer_name} · {r.customer_phone} · {formatDate(r.created_at)}
                  </p>
                  <p className="mt-1 text-xs text-brand-charcoal/40">
                    Product: {productName[r.product_id] ?? 'Unknown'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status={r.is_approved ? 'Approved' : 'Pending'} />
                  <StatusBadge status={r.is_verified_purchase ? 'Verified' : 'Unverified'} />
                </div>
              </div>

              <p className="mt-3 text-sm text-brand-charcoal/75">{r.body}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {!r.is_approved ? (
                  <button
                    onClick={() => act(r.id, { is_approved: true })}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 bg-brand-burgundy px-3 py-2 text-[11px] tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
                  >
                    <Check className="h-3.5 w-3.5" /> APPROVE
                  </button>
                ) : (
                  <button
                    onClick={() => act(r.id, { is_approved: false })}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-[11px] tracking-widest hover:border-brand-gold disabled:opacity-50"
                  >
                    <X className="h-3.5 w-3.5" /> UNPUBLISH
                  </button>
                )}
                <button
                  onClick={() => act(r.id, { action: 'reverify' })}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-[11px] tracking-widest hover:border-brand-gold disabled:opacity-50"
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> RE-VERIFY
                </button>
                {!r.is_verified_purchase ? (
                  <button
                    onClick={() => act(r.id, { is_verified_purchase: true })}
                    disabled={busy}
                    className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-[11px] tracking-widest hover:border-brand-gold disabled:opacity-50"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> FORCE VERIFY
                  </button>
                ) : null}
                <button
                  onClick={() => remove(r.id)}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 border border-red-200 px-3 py-2 text-[11px] tracking-widest text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  <Trash2 className="h-3.5 w-3.5" /> DELETE
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <p className="mt-6 text-xs text-brand-charcoal/45">
        Only reviews from customers with a paid order (matched by phone) are marked
        verified. Verified + approved reviews appear on the storefront. If none exist,
        the reviews section is hidden automatically.
      </p>
    </>
  );
}
