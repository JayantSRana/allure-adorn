'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Plus, Search, Pencil, Trash2, AlertTriangle, X, Upload } from 'lucide-react';
import { Product, Collection, ProductCategory, RoomType } from '@/types';
import { formatINR, CATEGORY_LABELS } from '@/lib/format';
import { StatusBadge } from '@/components/admin/ui';

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];
const ROOMS: RoomType[] = ['LIVING', 'BEDROOM', 'DINING', 'KITCHEN', 'BATHROOM', 'OFFICE'];

const inputCls =
  'w-full border border-brand-champagne bg-white px-3 py-2 text-sm outline-none focus:border-brand-burgundy';
const labelCls = 'mb-1 block text-[11px] uppercase tracking-widest text-brand-charcoal/50';

const EMPTY: Partial<Product> = {
  name: '',
  category: 'JEWELLERY',
  price: 0,
  cost_price: 0,
  stock: 0,
  description_short: '',
  description_long: '',
  images: ['/products/product-1.jpg'],
  size_options: [],
  tags: [],
  collection_ids: [],
  is_anti_tarnish: false,
  is_new_arrival: false,
  is_bestseller: false,
  is_active: true,
};

export default function ProductsManager({
  products,
  collections,
  scope = 'all',
}: {
  products: Product[];
  collections: Collection[];
  scope?: 'all' | 'home-decor';
}) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [lowOnly, setLowOnly] = useState(false);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const uploadImage = async (file: File): Promise<string | null> => {
    setUploading(file.name);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/products/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.path) return data.path;
      alert(data.error || 'Upload failed');
      return null;
    } catch {
      alert('Upload failed');
      return null;
    } finally {
      setUploading(null);
    }
  };

  const handleImageUpload = (field: keyof Product) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const path = await uploadImage(file);
      if (path && editing) {
        setEditing({ ...editing, [field]: path });
      }
    };
    input.click();
  };

  const scoped = useMemo(() => {
    const cats = scope === 'home-decor'
      ? ['HOME_DECOR', 'CANDLES', 'VASES', 'WALL_ART', 'TABLESCAPE']
      : CATEGORIES;
    return products.filter((p) => cats.includes(p.category));
  }, [products, scope]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return scoped
      .filter((p) => (category ? p.category === category : true))
      .filter((p) => (lowOnly ? p.stock <= 3 : true))
      .filter((p) => (q ? p.name.toLowerCase().includes(q) || p.slug.includes(q) : true));
  }, [scoped, query, category, lowOnly]);

  const save = async (draft: Partial<Product>) => {
    setBusy(true);
    try {
      const isNew = !draft.id;
      const res = await fetch(
        isNew ? '/api/admin/products' : `/api/admin/products/${draft.id}`,
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
    if (!window.confirm('Delete this product permanently?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      setEditing(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const toggleActive = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: !p.is_active }),
    });
    router.refresh();
  };

  const bulkStock = async () => {
    const raw = window.prompt('Set stock for all currently filtered products to:');
    if (raw === null) return;
    const value = Number(raw);
    if (Number.isNaN(value)) return;
    setBusy(true);
    try {
      await Promise.all(
        filtered.map((p) =>
          fetch(`/api/admin/products/${p.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ stock: value }),
          }),
        ),
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const lowStockCount = scoped.filter((p) => p.stock <= 3).length;

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[200px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className={`${inputCls} max-w-[200px]`}>
          <option value="">All Categories</option>
          {CATEGORIES.filter((c) =>
            scope === 'home-decor'
              ? ['HOME_DECOR', 'CANDLES', 'VASES', 'WALL_ART', 'TABLESCAPE'].includes(c)
              : true,
          ).map((c) => (
            <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
          ))}
        </select>
        <button
          onClick={() => setLowOnly((v) => !v)}
          className={`inline-flex items-center gap-2 border px-3 py-2 text-xs tracking-widest ${
            lowOnly ? 'border-brand-burgundy bg-brand-burgundy text-white' : 'border-brand-champagne'
          }`}
        >
          <AlertTriangle className="h-3.5 w-3.5" /> Low Stock ({lowStockCount})
        </button>
        <button
          onClick={bulkStock}
          disabled={busy || filtered.length === 0}
          className="border border-brand-champagne px-3 py-2 text-xs tracking-widest hover:border-brand-gold disabled:opacity-50"
        >
          Bulk Stock
        </button>
        <button
          onClick={() => setEditing({ ...EMPTY })}
          className="inline-flex items-center gap-2 bg-brand-burgundy px-4 py-2 text-xs tracking-widest text-white hover:bg-brand-charcoal"
        >
          <Plus className="h-4 w-4" /> New Product
        </button>
      </div>

      <div className="overflow-x-auto border border-brand-champagne bg-white/50">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-brand-champagne text-left text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Cost</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Flags</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-brand-champagne/60 last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-brand-champagne">
                      {p.images[0] ? (
                        <Image src={p.images[0]} alt="" fill sizes="40px" className="object-cover" />
                      ) : null}
                    </div>
                    <div>
                      <span className="block">{p.name}</span>
                      <span className="text-xs text-brand-charcoal/40">{p.slug}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-brand-charcoal/60">{CATEGORY_LABELS[p.category]}</td>
                <td className="px-4 py-3">{formatINR(p.price)}</td>
                <td className="px-4 py-3 text-brand-charcoal/60">{formatINR(p.cost_price)}</td>
                <td className="px-4 py-3">
                  <span className={p.stock <= 3 ? 'font-medium text-brand-burgundy' : ''}>{p.stock}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.is_anti_tarnish ? <StatusBadge status="Anti-tarnish" /> : null}
                    {p.is_new_arrival ? <StatusBadge status="New" /> : null}
                    {p.is_bestseller ? <StatusBadge status="Best" /> : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleActive(p)}
                    className={`h-5 w-9 rounded-full transition ${p.is_active ? 'bg-brand-burgundy' : 'bg-brand-champagne'}`}
                    aria-label="Toggle active"
                  >
                    <span
                      className={`block h-4 w-4 rounded-full bg-white transition-transform ${p.is_active ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
                    />
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => setEditing(p)} aria-label="Edit" className="p-1.5 hover:text-brand-burgundy">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button onClick={() => remove(p.id)} aria-label="Delete" className="p-1.5 hover:text-brand-burgundy">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-brand-charcoal/45">
                  No products match.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      {editing ? (
        <ProductModal
          draft={editing}
          collections={collections}
          busy={busy}
          scope={scope}
          onChange={setEditing}
          onClose={() => setEditing(null)}
          onSave={save}
          uploading={uploading}
          onUpload={handleImageUpload}
        />
      ) : null}
    </>
  );
}

function ProductModal({
  draft,
  collections,
  busy,
  scope,
  onChange,
  onClose,
  onSave,
  uploading,
  onUpload,
}: {
  draft: Partial<Product>;
  collections: Collection[];
  busy: boolean;
  scope: 'all' | 'home-decor';
  onChange: (p: Partial<Product>) => void;
  onClose: () => void;
  onSave: (p: Partial<Product>) => void;
  uploading: string | null;
  onUpload: (field: keyof Product) => void;
}) {
  const set = (key: keyof Product, value: unknown) => onChange({ ...draft, [key]: value });
  const listValue = (arr?: string[]) => (arr ?? []).join(', ');

  const isHomeDecor = scope === 'home-decor' || (draft.category && ['HOME_DECOR', 'CANDLES', 'VASES', 'WALL_ART', 'TABLESCAPE'].includes(draft.category));

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-brand-charcoal/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-2xl flex-col overflow-y-auto bg-brand-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-champagne px-5 py-4">
          <h2 className="font-serif text-xl">{draft.id ? 'Edit Product' : 'New Product'}</h2>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:text-brand-burgundy">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={labelCls}>Name</label>
            <input className={inputCls} value={draft.name ?? ''} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Category</label>
            <select className={inputCls} value={draft.category ?? 'JEWELLERY'} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelCls}>Sub-category</label>
            <input className={inputCls} value={draft.sub_category ?? ''} onChange={(e) => set('sub_category', e.target.value)} />
          </div>

          <div>
            <label className={labelCls}>Price (₹)</label>
            <input className={inputCls} type="number" value={draft.price ?? 0} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Compare-at Price (₹)</label>
            <input className={inputCls} type="number" value={draft.compare_at_price ?? ''} onChange={(e) => set('compare_at_price', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Cost Price (₹)</label>
            <input className={inputCls} type="number" value={draft.cost_price ?? 0} onChange={(e) => set('cost_price', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Stock</label>
            <input className={inputCls} type="number" value={draft.stock ?? 0} onChange={(e) => set('stock', e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Short Description</label>
            <input className={inputCls} value={draft.description_short ?? ''} onChange={(e) => set('description_short', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Long Description</label>
            <textarea rows={3} className={inputCls} value={draft.description_long ?? ''} onChange={(e) => set('description_long', e.target.value)} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Primary Image</label>
            <div className="flex items-center gap-3">
              <input className={inputCls} flex-1 value={draft.images?.[0] ?? ''} onChange={(e) => set('images', [e.target.value, ...(draft.images?.slice(1) ?? [])])} />
              <button type="button" onClick={() => onUpload('images' as keyof Product)} disabled={uploading === 'images'} className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-xs tracking-widest hover:border-brand-gold disabled:opacity-50">
                {uploading === 'images' ? 'UPLOADING…' : <><Upload className="h-3.5 w-3.5" /> UPLOAD</>}
              </button>
            </div>
            {draft.images?.[0] && <div className="mt-1"><Image src={draft.images[0]} alt="Preview" width={80} height={80} className="rounded border border-brand-champagne" /></div>}
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Gallery Images (comma separated paths)</label>
            <textarea rows={2} className={inputCls} value={listValue(draft.images?.slice(1))} onChange={(e) => set('images', [draft.images?.[0] ?? '', ...e.target.value.split(',').map((s) => s.trim()).filter(Boolean)])} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>Hover Image</label>
            <div className="flex items-center gap-3">
              <input className={inputCls} flex-1 value={draft.hover_image ?? ''} onChange={(e) => set('hover_image', e.target.value)} />
              <button type="button" onClick={() => onUpload('hover_image' as keyof Product)} disabled={uploading === 'hover_image'} className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-xs tracking-widest hover:border-brand-gold disabled:opacity-50">
                {uploading === 'hover_image' ? 'UPLOADING…' : <><Upload className="h-3.5 w-3.5" /> UPLOAD</>}
              </button>
            </div>
            {draft.hover_image && <div className="mt-1"><Image src={draft.hover_image} alt="Hover preview" width={80} height={80} className="rounded border border-brand-champagne" /></div>}
          </div>

          <div>
            <label className={labelCls}>Material</label>
            <input className={inputCls} value={draft.material ?? ''} onChange={(e) => set('material', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Finish</label>
            <input className={inputCls} value={draft.finish ?? ''} onChange={(e) => set('finish', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Colour</label>
            <input className={inputCls} value={draft.colour ?? ''} onChange={(e) => set('colour', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>Size Options (comma)</label>
            <input className={inputCls} value={listValue(draft.size_options)} onChange={(e) => set('size_options', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
          </div>

          {isHomeDecor ? (
            <>
              <div>
                <label className={labelCls}>Dimensions</label>
                <input className={inputCls} value={draft.dimensions ?? ''} onChange={(e) => set('dimensions', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Weight (g)</label>
                <input className={inputCls} type="number" value={draft.weight ?? ''} onChange={(e) => set('weight', e.target.value)} />
              </div>
              <div>
                <label className={labelCls}>Room Type</label>
                <select className={inputCls} value={draft.room_type ?? ''} onChange={(e) => set('room_type', e.target.value)}>
                  <option value="">—</option>
                  {ROOMS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!draft.fragile} onChange={(e) => set('fragile', e.target.checked)} />
                  Fragile
                </label>
              </div>
            </>
          ) : null}

          <div className="sm:col-span-2">
            <label className={labelCls}>Tags (comma)</label>
            <input className={inputCls} value={listValue(draft.tags)} onChange={(e) => set('tags', e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} />
          </div>

          <div className="sm:col-span-2">
            <label className={labelCls}>Collections</label>
            <div className="flex flex-wrap gap-2">
              {collections.map((c) => {
                const checked = (draft.collection_ids ?? []).includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      set(
                        'collection_ids',
                        checked
                          ? (draft.collection_ids ?? []).filter((id) => id !== c.id)
                          : [...(draft.collection_ids ?? []), c.id],
                      )
                    }
                    className={`border px-3 py-1.5 text-xs ${checked ? 'border-brand-burgundy bg-brand-burgundy text-white' : 'border-brand-champagne'}`}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 sm:col-span-2">
            {([
              ['is_anti_tarnish', 'Anti-Tarnish'],
              ['is_new_arrival', 'New Arrival'],
              ['is_bestseller', 'Bestseller'],
              ['is_active', 'Active'],
            ] as [keyof Product, string][]).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!draft[key]} onChange={(e) => set(key, e.target.checked)} />
                {label}
              </label>
            ))}
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
            {busy ? 'SAVING…' : 'SAVE PRODUCT'}
          </button>
        </div>
      </div>
    </div>
  );
}
