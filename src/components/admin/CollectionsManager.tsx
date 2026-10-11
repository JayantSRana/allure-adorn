'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Star, X } from 'lucide-react';
import { Collection, Product } from '@/types';

const inputCls =
  'w-full border border-brand-champagne bg-white px-3 py-2 text-sm outline-none focus:border-brand-burgundy';
const labelCls = 'mb-1 block text-[11px] uppercase tracking-widest text-brand-charcoal/50';

export default function CollectionsManager({
  collections,
  products,
}: {
  collections: Collection[];
  products: Product[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<Partial<Collection> | null>(null);
  const [busy, setBusy] = useState(false);

  const save = async (draft: Partial<Collection>) => {
    setBusy(true);
    try {
      const isNew = !draft.id;
      const res = await fetch(
        isNew ? '/api/admin/collections' : `/api/admin/collections/${draft.id}`,
        {
          method: isNew ? 'POST' : 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(draft),
        },
      );
      if (res.ok) {
        setEditing(null);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm('Delete this collection?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/collections/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const feature = async (c: Collection) => {
    await fetch(`/api/admin/collections/${c.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_featured: true }),
    });
    router.refresh();
  };

  return (
    <>
      <div className="mb-5 flex justify-end">
        <button
          onClick={() =>
            setEditing({
              name: '',
              description: '',
              hero_image: '/editorial/editorial-1.jpg',
              product_ids: [],
              is_featured: false,
            })
          }
          className="inline-flex items-center gap-2 bg-brand-burgundy px-4 py-2 text-xs tracking-widest text-white hover:bg-brand-charcoal"
        >
          <Plus className="h-4 w-4" /> New Collection
        </button>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {collections.map((c) => (
          <div key={c.id} className="border border-brand-champagne bg-white/60">
            <div className="relative aspect-[16/9] overflow-hidden bg-brand-champagne">
              {c.hero_image ? (
                <Image src={c.hero_image} alt={c.name} fill sizes="33vw" className="object-cover" />
              ) : null}
              {c.is_featured ? (
                <span className="absolute left-3 top-3 bg-brand-gold px-2 py-0.5 text-[10px] tracking-widest text-white">
                  FEATURED
                </span>
              ) : null}
            </div>
            <div className="p-4">
              <h3 className="font-serif text-lg">{c.name}</h3>
              <p className="mt-1 line-clamp-2 text-xs text-brand-charcoal/55">{c.description}</p>
              <p className="mt-2 text-xs text-brand-charcoal/45">
                {c.product_ids.length} product(s){c.season ? ` · ${c.season}` : ''}
              </p>
              <div className="mt-3 flex items-center gap-2">
                {!c.is_featured ? (
                  <button
                    onClick={() => feature(c)}
                    className="inline-flex items-center gap-1.5 border border-brand-champagne px-2.5 py-1.5 text-[11px] tracking-widest hover:border-brand-gold"
                  >
                    <Star className="h-3 w-3" /> Feature
                  </button>
                ) : null}
                <button
                  onClick={() => setEditing(c)}
                  className="inline-flex items-center gap-1.5 border border-brand-champagne px-2.5 py-1.5 text-[11px] tracking-widest hover:border-brand-gold"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => remove(c.id)}
                  className="inline-flex items-center gap-1.5 border border-red-200 px-2.5 py-1.5 text-[11px] tracking-widest text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing ? (
        <CollectionModal
          draft={editing}
          products={products}
          busy={busy}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      ) : null}
    </>
  );
}

function CollectionModal({
  draft,
  products,
  busy,
  onChange,
  onClose,
  onSave,
}: {
  draft: Partial<Collection>;
  products: Product[];
  busy: boolean;
  onChange: (c: Partial<Collection>) => void;
  onClose: () => void;
  onSave: (c: Partial<Collection>) => void;
}) {
  const set = (key: keyof Collection, value: unknown) => onChange({ ...draft, [key]: value });
  const [filter, setFilter] = useState('');

  const filtered = products.filter((p) =>
    filter ? p.name.toLowerCase().includes(filter.toLowerCase()) : true,
  );

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-brand-charcoal/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-xl flex-col overflow-y-auto bg-brand-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-champagne px-5 py-4">
          <h2 className="font-serif text-xl">{draft.id ? 'Edit Collection' : 'New Collection'}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:text-brand-burgundy">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div>
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={draft.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={3} className={inputCls} value={draft.description ?? ''} onChange={(e) => set('description', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Hero Image</label>
            <input className={inputCls} value={draft.hero_image ?? ''} onChange={(e) => set('hero_image', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Season</label>
            <input className={inputCls} value={draft.season ?? ''} onChange={(e) => set('season', e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!draft.is_featured} onChange={(e) => set('is_featured', e.target.checked)} />
            Feature on homepage
          </label>

          <div>
            <label className={labelCls}>Products ({(draft.product_ids ?? []).length} selected)</label>
            <input
              className={`${inputCls} mb-2`}
              placeholder="Filter products…"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <div className="max-h-64 overflow-y-auto border border-brand-champagne bg-white/60 p-2">
              {filtered.map((p) => {
                const checked = (draft.product_ids ?? []).includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() =>
                      set(
                        'product_ids',
                        checked
                          ? (draft.product_ids ?? []).filter((id) => id !== p.id)
                          : [...(draft.product_ids ?? []), p.id],
                      )
                    }
                    className={`flex w-full items-center gap-2 px-2 py-1.5 text-left text-xs ${checked ? 'bg-brand-champagne/60' : 'hover:bg-brand-champagne/30'}`}
                  >
                    <input type="checkbox" checked={checked} readOnly />
                    {p.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-champagne p-5">
          <button onClick={onClose} className="text-xs tracking-widest text-brand-charcoal/60 hover:text-brand-charcoal">
            CANCEL
          </button>
          <button
            onClick={() => onSave(draft)}
            disabled={busy || !draft.name}
            className="bg-brand-burgundy px-6 py-3 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
          >
            {busy ? 'SAVING…' : 'SAVE COLLECTION'}
          </button>
        </div>
      </div>
    </div>
  );
}
