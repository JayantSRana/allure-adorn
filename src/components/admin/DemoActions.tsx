'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Database, Trash2 } from 'lucide-react';

export default function DemoActions() {
  const router = useRouter();
  const [busy, setBusy] = useState<'seed' | 'clear' | null>(null);

  const run = async (kind: 'seed' | 'clear') => {
    const msg =
      kind === 'seed'
        ? 'Add a set of clearly-labelled demo orders to showcase analytics?'
        : 'Remove all demo orders? Real orders created at checkout are kept.';
    if (!window.confirm(msg)) return;
    setBusy(kind);
    await fetch('/api/admin/demo-orders', { method: kind === 'seed' ? 'POST' : 'DELETE' });
    setBusy(null);
    router.refresh();
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => run('seed')}
        disabled={busy !== null}
        className="inline-flex items-center gap-2 border border-brand-champagne bg-white px-3 py-2 text-xs tracking-widest text-brand-charcoal/70 transition hover:border-brand-gold disabled:opacity-50"
      >
        <Database className="h-3.5 w-3.5" />
        {busy === 'seed' ? 'ADDING…' : 'DEMO ORDERS'}
      </button>
      <button
        onClick={() => run('clear')}
        disabled={busy !== null}
        className="inline-flex items-center gap-2 border border-brand-champagne bg-white px-3 py-2 text-xs tracking-widest text-brand-charcoal/70 transition hover:border-brand-burgundy hover:text-brand-burgundy disabled:opacity-50"
      >
        <Trash2 className="h-3.5 w-3.5" />
        {busy === 'clear' ? 'CLEARING…' : 'CLEAR DEMO'}
      </button>
    </div>
  );
}
