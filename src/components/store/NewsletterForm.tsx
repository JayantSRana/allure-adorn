'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [message, setMessage] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setMessage(
        data.alreadySubscribed
          ? 'You are already on the list — thank you.'
          : 'Welcome to the Allure List.',
      );
      setStatus('done');
      setEmail('');
    } catch {
      setMessage('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'done') {
    return (
      <p className="mt-8 text-sm text-brand-burgundy">{message}</p>
    );
  }

  return (
    <>
      <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email address"
          aria-label="Email address"
          className="flex-1 border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
        />
        <button
          type="submit"
          disabled={status === 'sending'}
          className="flex items-center justify-center gap-2 bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-60"
        >
          {status === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          JOIN THE ALLURE LIST
        </button>
      </form>
      {status === 'error' && <p className="mt-3 text-sm text-brand-burgundy">{message}</p>}
    </>
  );
}
