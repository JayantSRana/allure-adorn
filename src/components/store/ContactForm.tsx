'use client';

import { useState } from 'react';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setError('');

    const isEmail = contact.includes('@');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email: isEmail ? contact : '',
          phone: isEmail ? '' : contact,
          message,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
      setName('');
      setContact('');
      setMessage('');
    } catch {
      setError('Network error. Please try again.');
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return (
      <div className="mx-auto mt-12 flex max-w-2xl flex-col items-center gap-3 border border-brand-champagne bg-white/60 p-10 text-center">
        <CheckCircle2 className="h-7 w-7 text-brand-gold" />
        <h2 className="font-serif text-xl">Thank you — your message is on its way.</h2>
        <p className="text-sm text-brand-charcoal/60">
          We&apos;ll get back to you within one business day.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-2 text-xs tracking-widest text-brand-burgundy underline"
        >
          SEND ANOTHER MESSAGE
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="mx-auto mt-12 max-w-2xl space-y-4">
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
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Email or phone"
          className="border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
        />
      </div>
      <textarea
        required
        rows={5}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="How can we help?"
        className="w-full border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy"
      />
      {status === 'error' && (
        <p className="flex items-center gap-2 text-sm text-brand-burgundy">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'sending'}
        className="flex w-full items-center justify-center gap-2 bg-brand-burgundy py-3.5 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> SENDING…
          </>
        ) : (
          'SEND MESSAGE'
        )}
      </button>
    </form>
  );
}
