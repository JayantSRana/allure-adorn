'use client';

import { useState } from 'react';
import { Star, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function ReviewForm({
  productId,
  productName,
}: {
  productId: string;
  productName: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    if (rating < 1) {
      setError('Please choose a star rating.');
      setStatus('error');
      return;
    }
    setStatus('sending');
    setError('');
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name,
          customer_phone: phone,
          rating,
          title,
          body,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setVerified(Boolean(data.verified));
      setStatus('done');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <div className="mt-6 flex flex-col items-center gap-2 border border-brand-champagne bg-brand-ivory p-8 text-center">
        <CheckCircle2 className="h-6 w-6 text-brand-gold" />
        <p className="font-serif text-lg">Thank you for your review.</p>
        <p className="text-sm text-brand-charcoal/60">
          {verified
            ? 'Your verified review will appear once approved by our team.'
            : 'It will appear once approved by our team. Reviews from a paid order are marked verified.'}
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="border border-brand-burgundy px-6 py-3 text-xs tracking-widest text-brand-burgundy transition hover:bg-brand-burgundy hover:text-white"
        >
          WRITE A REVIEW
        </button>
      ) : (
        <form
          onSubmit={submit}
          className="mx-auto max-w-xl space-y-4 border border-brand-champagne bg-brand-ivory p-6 text-left"
        >
          <p className="font-serif text-xl">Review {productName}</p>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${i + 1} star${i ? 's' : ''}`}
                className="p-0.5"
              >
                <Star
                  className={cn(
                    'h-6 w-6 transition',
                    (hover || rating) > i
                      ? 'fill-brand-gold text-brand-gold'
                      : 'text-brand-champagne',
                  )}
                />
              </button>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
            />
            <input
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone (to verify purchase)"
              className="border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
            />
          </div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Headline (optional)"
            className="w-full border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
          />
          <textarea
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Tell us what you love about it…"
            className="w-full border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
          />

          {status === 'error' && (
            <p className="flex items-center gap-2 text-sm text-brand-burgundy">
              <AlertCircle className="h-4 w-4" /> {error}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === 'sending'}
              className="flex items-center gap-2 bg-brand-burgundy px-7 py-3 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-60"
            >
              {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              SUBMIT REVIEW
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs tracking-widest text-brand-charcoal/50 underline"
            >
              CANCEL
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
