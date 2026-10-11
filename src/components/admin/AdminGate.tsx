'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { verifyAdminPin } from '@/app/admin/actions';

export default function AdminGate() {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const res = await verifyAdminPin(pin);
    if (!res.ok) {
      setError(res.error ?? 'Incorrect PIN.');
      setLoading(false);
      return;
    }
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-charcoal px-4">
      <div className="w-full max-w-sm bg-brand-ivory p-8 text-center shadow-2xl">
        <Lock className="mx-auto h-7 w-7 text-brand-gold" />
        <h1 className="mt-4 font-serif text-2xl tracking-[0.2em] text-brand-charcoal">
          ALLURE ADORN
        </h1>
        <div className="flex justify-center py-3">
          <DiamondMotif className="text-xs" />
        </div>
        <p className="text-xs uppercase tracking-widest text-brand-charcoal/50">
          Admin Access
        </p>

        <form onSubmit={submit} className="mt-6 space-y-3">
          <input
            autoFocus
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            className="w-full border border-brand-champagne bg-white px-4 py-3 text-center text-lg tracking-[0.5em] outline-none focus:border-brand-burgundy"
          />
          {error ? <p className="text-xs text-brand-burgundy">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-burgundy py-3.5 text-xs tracking-widest text-white transition hover:bg-brand-charcoal disabled:opacity-50"
          >
            {loading ? 'VERIFYING…' : 'ENTER'}
          </button>
        </form>
        <p className="mt-4 text-[10px] text-brand-charcoal/40">
          Demo PIN: 0314
        </p>
      </div>
    </div>
  );
}
