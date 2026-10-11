'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { SystemSettings } from '@/types';

const inputCls =
  'w-full border border-brand-champagne bg-white px-3 py-2 text-sm outline-none focus:border-brand-burgundy';
const labelCls = 'mb-1 block text-[11px] uppercase tracking-widest text-brand-charcoal/50';

export default function SettingsForm({
  initial,
  fields,
  title = 'Settings',
}: {
  initial: SystemSettings;
  fields: (keyof SystemSettings)[];
  title?: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<SystemSettings>(initial);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  const set = (key: keyof SystemSettings, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));

  const save = async () => {
    setBusy(true);
    setSaved(false);
    const payload: Record<string, unknown> = {};
    fields.forEach((k) => (payload[k] = form[k]));
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <h2 className="mb-5 font-serif text-2xl">{title}</h2>
      <div className="space-y-4">
        {fields.map((key) => {
          const value = form[key];
          if (typeof value === 'boolean') {
            return (
              <label
                key={key}
                className="flex items-center justify-between border border-brand-champagne bg-white/50 px-4 py-3 text-sm"
              >
                <span>{humanize(key)}</span>
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => set(key, e.target.checked)}
                />
              </label>
            );
          }
          const isNumber = typeof value === 'number';
          return (
            <div key={key}>
              <label className={labelCls}>{humanize(key)}</label>
              <input
                className={inputCls}
                type={isNumber ? 'number' : 'text'}
                value={value === undefined || value === null ? '' : String(value)}
                onChange={(e) => set(key, isNumber ? e.target.value : e.target.value)}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={save}
          disabled={busy}
          className="inline-flex items-center gap-2 bg-brand-burgundy px-6 py-3 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {busy ? 'SAVING…' : 'SAVE CHANGES'}
        </button>
        {saved ? <span className="text-xs text-green-700">Saved ✓</span> : null}
      </div>
    </div>
  );
}

function humanize(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
