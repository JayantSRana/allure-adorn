'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Plus,
  ArrowUp,
  ArrowDown,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  RotateCcw,
  Upload,
  X,
  Check,
  LayoutTemplate,
  Sparkles,
} from 'lucide-react';
import {
  HomepageSection,
  SectionType,
  HeroSlideItem,
  CategoryCardItem,
  ServiceBadgeItem,
  ServiceIconName,
  Collection,
  Product,
  ProductCategory,
} from '@/types';
import { SECTION_TYPE_LABELS } from '@/lib/seed-sections';
import { CATEGORY_LABELS, formatINR } from '@/lib/format';

const inputCls =
  'w-full border border-brand-champagne bg-white px-3 py-2 text-sm outline-none focus:border-brand-burgundy';
const labelCls =
  'mb-1 block text-[11px] uppercase tracking-widest text-brand-charcoal/50';

const SERVICE_ICONS: ServiceIconName[] = [
  'Globe',
  'Package',
  'MousePointerClick',
  'Headphones',
  'ShieldCheck',
  'Sparkles',
  'Truck',
  'Heart',
  'Award',
];

const CATEGORIES = Object.keys(CATEGORY_LABELS) as ProductCategory[];

export default function ContentManager({
  initialSections,
  collections,
  products,
}: {
  initialSections: HomepageSection[];
  collections: Collection[];
  products: Product[];
}) {
  const router = useRouter();
  const [sections, setSections] = useState<HomepageSection[]>(initialSections);
  const [editing, setEditing] = useState<HomepageSection | null>(null);
  const [addingModal, setAddingModal] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  const uploadImageFile = async (): Promise<string | null> => {
    return new Promise((resolve) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        const file = input.files?.[0];
        if (!file) {
          resolve(null);
          return;
        }
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch('/api/admin/products/upload', {
            method: 'POST',
            body: formData,
          });
          const data = await res.json();
          if (res.ok && data.path) {
            resolve(data.path);
          } else {
            alert(data.error || 'Upload failed');
            resolve(null);
          }
        } catch {
          alert('Upload failed');
          resolve(null);
        } finally {
          setUploading(false);
        }
      };
      input.click();
    });
  };

  /* -------------------- Section List Operations -------------------- */

  const moveSection = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    const reordered = next.map((s, idx) => ({ ...s, order: idx }));
    setSections(reordered);

    setBusy(true);
    try {
      await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: reordered }),
      });
      router.refresh();
      showToast('Section order updated');
    } finally {
      setBusy(false);
    }
  };

  const toggleSection = async (section: HomepageSection) => {
    const updatedVal = !section.is_enabled;
    setSections((prev) =>
      prev.map((s) =>
        s.id === section.id ? { ...s, is_enabled: updatedVal } : s,
      ),
    );
    setBusy(true);
    try {
      await fetch(`/api/admin/sections/${section.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_enabled: updatedVal }),
      });
      router.refresh();
      showToast(
        `${section.title} ${updatedVal ? 'visible on storefront' : 'hidden'}`,
      );
    } finally {
      setBusy(false);
    }
  };

  const deleteSection = async (section: HomepageSection) => {
    if (
      !confirm(
        `Remove section "${section.title}" from the homepage? You can always add it back later.`,
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${section.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setSections((prev) =>
          prev
            .filter((s) => s.id !== section.id)
            .map((s, idx) => ({ ...s, order: idx })),
        );
        router.refresh();
        showToast('Section removed');
      }
    } finally {
      setBusy(false);
    }
  };

  const addSection = async (type: SectionType) => {
    setBusy(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
      const data = await res.json();
      if (res.ok && data.section) {
        setSections((prev) => [...prev, data.section]);
        setAddingModal(false);
        setEditing(JSON.parse(JSON.stringify(data.section)));
        router.refresh();
        showToast('New section added');
      }
    } finally {
      setBusy(false);
    }
  };

  const resetToDefault = async () => {
    if (
      !confirm(
        'Reset all homepage sections and banners back to the original Allure Adorn defaults?',
      )
    )
      return;
    setBusy(true);
    try {
      const res = await fetch('/api/admin/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reset: true }),
      });
      const data = await res.json();
      if (res.ok && data.sections) {
        setSections(data.sections);
        router.refresh();
        showToast('Restored default homepage layout');
      }
    } finally {
      setBusy(false);
    }
  };

  const saveEditingSection = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/sections/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editing.title,
          subtitle: editing.subtitle,
          eyebrow: editing.eyebrow,
          is_enabled: editing.is_enabled,
          config: editing.config,
        }),
      });
      const data = await res.json();
      if (res.ok && data.section) {
        setSections((prev) =>
          prev.map((s) => (s.id === data.section.id ? data.section : s)),
        );
        setEditing(null);
        router.refresh();
        showToast('Section changes saved');
      }
    } finally {
      setBusy(false);
    }
  };

  const updateConfig = (patch: Partial<HomepageSection['config']>) => {
    if (!editing) return;
    setEditing({
      ...editing,
      config: {
        ...editing.config,
        ...patch,
      },
    });
  };

  /* -------------------- Summary Badge Helper -------------------- */
  const sectionSummary = (s: HomepageSection): string => {
    switch (s.type) {
      case 'HERO_SLIDESHOW':
        return `${s.config.slides?.length || 0} slide(s)`;
      case 'CATEGORY_SHOWCASE':
        return `${s.config.category_cards?.length || 0} category card(s)`;
      case 'SERVICE_STRIP':
        return `${s.config.service_badges?.length || 0} badge(s)`;
      case 'INSTAGRAM_FEED':
        return `${s.config.instagram_images?.length || 0} photo(s)`;
      case 'NEW_ARRIVALS':
      case 'BESTSELLERS':
      case 'HOME_DECOR_SHOWCASE':
      case 'REVIEWS_SHOWCASE':
      case 'BRAND_PROMISE':
        return `Shows up to ${s.config.limit || 4} items`;
      case 'CUSTOM_PRODUCT_GRID':
        return s.config.product_ids?.length
          ? `${s.config.product_ids.length} hand-picked product(s)`
          : `Category: ${s.config.filter_category || 'JEWELLERY'}`;
      default:
        return SECTION_TYPE_LABELS[s.type]?.label || s.type;
    }
  };

  return (
    <div>
      {/* Top Action Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border border-brand-champagne bg-white p-4">
        <div className="flex items-center gap-3">
          <LayoutTemplate className="h-5 w-5 text-brand-burgundy" />
          <div>
            <p className="text-sm font-medium text-brand-charcoal">
              Storefront Layout ({sections.filter((s) => s.is_enabled).length}{' '}
              active of {sections.length} sections)
            </p>
            <p className="text-xs text-brand-charcoal/55">
              Reorder sections, toggle visibility, or click Customize to edit
              banners, cards, text & links.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={resetToDefault}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-brand-champagne px-4 py-2.5 text-xs tracking-widest text-brand-charcoal/70 hover:border-brand-charcoal hover:text-brand-charcoal disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" /> RESET DEFAULTS
          </button>
          <button
            onClick={() => setAddingModal(true)}
            disabled={busy}
            className="inline-flex items-center gap-2 bg-brand-burgundy px-5 py-2.5 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
          >
            <Plus className="h-4 w-4" /> ADD SECTION
          </button>
        </div>
      </div>

      {toast ? (
        <div className="mb-4 flex items-center gap-2 border border-brand-gold bg-brand-champagne/40 px-4 py-2.5 text-xs text-brand-charcoal">
          <Check className="h-4 w-4 text-brand-burgundy" />
          <span>{toast}</span>
        </div>
      ) : null}

      {/* Ordered Section List */}
      <div className="space-y-3">
        {sections.map((section, idx) => (
          <div
            key={section.id}
            className={`flex flex-col justify-between gap-4 border bg-white p-4 transition sm:flex-row sm:items-center ${
              section.is_enabled
                ? 'border-brand-champagne'
                : 'border-brand-champagne/50 bg-white/50 opacity-65'
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Reorder Controls */}
              <div className="flex flex-col items-center gap-1 pt-0.5">
                <button
                  onClick={() => moveSection(idx, -1)}
                  disabled={idx === 0 || busy}
                  title="Move section up"
                  className="border border-brand-champagne p-1 text-brand-charcoal/60 hover:border-brand-burgundy hover:text-brand-burgundy disabled:opacity-25"
                >
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <span className="text-[10px] font-medium text-brand-charcoal/40">
                  #{idx + 1}
                </span>
                <button
                  onClick={() => moveSection(idx, 1)}
                  disabled={idx === sections.length - 1 || busy}
                  title="Move section down"
                  className="border border-brand-champagne p-1 text-brand-charcoal/60 hover:border-brand-burgundy hover:text-brand-burgundy disabled:opacity-25"
                >
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-brand-champagne/60 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand-burgundy">
                    {SECTION_TYPE_LABELS[section.type]?.label || section.type}
                  </span>
                  <span className="border border-brand-champagne px-2 py-0.5 text-[10px] text-brand-charcoal/60">
                    {sectionSummary(section)}
                  </span>
                  {!section.is_enabled ? (
                    <span className="bg-brand-charcoal/10 px-2 py-0.5 text-[10px] uppercase tracking-widest text-brand-charcoal/60">
                      Hidden
                    </span>
                  ) : null}
                </div>
                <h3 className="mt-1.5 font-serif text-xl text-brand-charcoal">
                  {section.title}
                </h3>
                {section.subtitle ? (
                  <p className="mt-0.5 text-xs text-brand-charcoal/60">
                    {section.subtitle}
                  </p>
                ) : null}
              </div>
            </div>

            {/* Section Actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => toggleSection(section)}
                disabled={busy}
                className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs tracking-wider transition ${
                  section.is_enabled
                    ? 'border-brand-champagne text-brand-charcoal/70 hover:border-brand-charcoal'
                    : 'border-brand-gold bg-brand-champagne/30 text-brand-burgundy'
                }`}
              >
                {section.is_enabled ? (
                  <>
                    <Eye className="h-3.5 w-3.5" /> Visible
                  </>
                ) : (
                  <>
                    <EyeOff className="h-3.5 w-3.5" /> Hidden
                  </>
                )}
              </button>

              <button
                onClick={() =>
                  setEditing(JSON.parse(JSON.stringify(section)))
                }
                className="inline-flex items-center gap-1.5 bg-brand-burgundy px-4 py-2 text-xs tracking-widest text-white hover:bg-brand-charcoal"
              >
                <Pencil className="h-3.5 w-3.5" /> CUSTOMIZE
              </button>

              <button
                onClick={() => deleteSection(section)}
                disabled={busy}
                title="Remove section"
                className="border border-brand-champagne p-2 text-brand-charcoal/40 hover:border-red-700 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* -------------------- ADD SECTION MODAL -------------------- */}
      {addingModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto bg-brand-ivory p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between border-b border-brand-champagne pb-3">
              <div>
                <h2 className="font-serif text-2xl">Add Website Section</h2>
                <p className="text-xs text-brand-charcoal/60">
                  Choose a section block to append to your homepage.
                </p>
              </div>
              <button
                onClick={() => setAddingModal(false)}
                className="p-1 text-brand-charcoal/50 hover:text-brand-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {(Object.keys(SECTION_TYPE_LABELS) as SectionType[]).map(
                (type) => {
                  const info = SECTION_TYPE_LABELS[type];
                  return (
                    <button
                      key={type}
                      onClick={() => addSection(type)}
                      disabled={busy}
                      className="flex flex-col items-start border border-brand-champagne bg-white p-4 text-left transition hover:border-brand-burgundy hover:bg-brand-champagne/20"
                    >
                      <span className="flex items-center gap-1.5 font-serif text-lg text-brand-burgundy">
                        <Sparkles className="h-4 w-4 text-brand-gold" />
                        {info.label}
                      </span>
                      <span className="mt-1 text-xs text-brand-charcoal/65">
                        {info.description}
                      </span>
                    </button>
                  );
                },
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* -------------------- EDIT SECTION MODAL -------------------- */}
      {editing ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-brand-ivory p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-brand-champagne pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-brand-gold">
                  {SECTION_TYPE_LABELS[editing.type]?.label || editing.type}
                </span>
                <h2 className="font-serif text-2xl">
                  Customize: {editing.title}
                </h2>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="p-1 text-brand-charcoal/50 hover:text-brand-charcoal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Common Section Metadata */}
            <div className="mb-6 grid gap-4 border border-brand-champagne bg-white p-4 sm:grid-cols-2">
              <div>
                <label className={labelCls}>Section Heading / Title</label>
                <input
                  className={inputCls}
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className={labelCls}>Subtitle (Optional)</label>
                <input
                  className={inputCls}
                  value={editing.subtitle || ''}
                  onChange={(e) =>
                    setEditing({ ...editing, subtitle: e.target.value })
                  }
                />
              </div>
              {['FEATURED_COLLECTION', 'BRAND_PROMISE', 'PROMO_BANNER'].includes(
                editing.type,
              ) ? (
                <div>
                  <label className={labelCls}>Eyebrow Label (Small Gold Text)</label>
                  <input
                    className={inputCls}
                    value={editing.eyebrow || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, eyebrow: e.target.value })
                    }
                  />
                </div>
              ) : null}
              <div className="flex items-end">
                <label className="flex w-full items-center justify-between border border-brand-champagne bg-brand-ivory/50 px-3 py-2 text-sm">
                  <span>Show this section on storefront</span>
                  <input
                    type="checkbox"
                    checked={editing.is_enabled}
                    onChange={(e) =>
                      setEditing({ ...editing, is_enabled: e.target.checked })
                    }
                  />
                </label>
              </div>
            </div>

            {/* ==================== 1. HERO SLIDESHOW EDITOR ==================== */}
            {editing.type === 'HERO_SLIDESHOW' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg">
                    Hero Slides ({editing.config.slides?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const slides = [...(editing.config.slides || [])];
                      slides.push({
                        id: `slide-${Date.now()}`,
                        image: '/editorial/editorial-2.jpg',
                        eyebrow: 'New Arrival',
                        headline: 'New Headline',
                        sub: 'Describe your new collection or campaign here.',
                        primary_cta_text: 'SHOP JEWELLERY',
                        primary_cta_href: '/shop?category=JEWELLERY',
                        secondary_cta_text: 'EXPLORE BANGLES',
                        secondary_cta_href: '/bangles',
                        is_active: true,
                      });
                      updateConfig({ slides });
                    }}
                    className="inline-flex items-center gap-1.5 bg-brand-burgundy px-3 py-1.5 text-xs tracking-widest text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD SLIDE
                  </button>
                </div>

                {(editing.config.slides || []).map(
                  (slide: HeroSlideItem, sIdx: number) => (
                    <div
                      key={slide.id || sIdx}
                      className="border border-brand-champagne bg-white p-4"
                    >
                      <div className="mb-3 flex items-center justify-between border-b border-brand-champagne pb-2">
                        <span className="text-xs font-medium uppercase tracking-widest text-brand-burgundy">
                          Slide #{sIdx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            disabled={sIdx === 0}
                            onClick={() => {
                              const slides = [...(editing.config.slides || [])];
                              const [m] = slides.splice(sIdx, 1);
                              slides.splice(sIdx - 1, 0, m);
                              updateConfig({ slides });
                            }}
                            className="border border-brand-champagne p-1 text-xs disabled:opacity-30"
                          >
                            <ArrowUp className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            disabled={
                              sIdx === (editing.config.slides?.length || 1) - 1
                            }
                            onClick={() => {
                              const slides = [...(editing.config.slides || [])];
                              const [m] = slides.splice(sIdx, 1);
                              slides.splice(sIdx + 1, 0, m);
                              updateConfig({ slides });
                            }}
                            className="border border-brand-champagne p-1 text-xs disabled:opacity-30"
                          >
                            <ArrowDown className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const slides = (
                                editing.config.slides || []
                              ).filter((_, i) => i !== sIdx);
                              updateConfig({ slides });
                            }}
                            className="border border-brand-champagne p-1 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <div>
                          <div className="relative aspect-[16/10] w-full overflow-hidden border border-brand-champagne bg-brand-champagne">
                            {slide.image ? (
                              <Image
                                src={slide.image}
                                alt={slide.headline}
                                fill
                                sizes="240px"
                                className="object-cover"
                              />
                            ) : null}
                          </div>
                          <div className="mt-2 flex gap-2">
                            <input
                              className={inputCls}
                              value={slide.image}
                              placeholder="/editorial/..."
                              onChange={(e) => {
                                const slides = [
                                  ...(editing.config.slides || []),
                                ];
                                slides[sIdx] = {
                                  ...slide,
                                  image: e.target.value,
                                };
                                updateConfig({ slides });
                              }}
                            />
                            <button
                              type="button"
                              disabled={uploading}
                              onClick={async () => {
                                const path = await uploadImageFile();
                                if (path) {
                                  const slides = [
                                    ...(editing.config.slides || []),
                                  ];
                                  slides[sIdx] = { ...slide, image: path };
                                  updateConfig({ slides });
                                }
                              }}
                              className="shrink-0 border border-brand-burgundy px-2.5 py-1 text-xs text-brand-burgundy hover:bg-brand-burgundy hover:text-white"
                              title="Upload image"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-3 sm:col-span-2">
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className={labelCls}>Eyebrow Text</label>
                              <input
                                className={inputCls}
                                value={slide.eyebrow}
                                onChange={(e) => {
                                  const slides = [
                                    ...(editing.config.slides || []),
                                  ];
                                  slides[sIdx] = {
                                    ...slide,
                                    eyebrow: e.target.value,
                                  };
                                  updateConfig({ slides });
                                }}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Headline</label>
                              <input
                                className={inputCls}
                                value={slide.headline}
                                onChange={(e) => {
                                  const slides = [
                                    ...(editing.config.slides || []),
                                  ];
                                  slides[sIdx] = {
                                    ...slide,
                                    headline: e.target.value,
                                  };
                                  updateConfig({ slides });
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={labelCls}>Subheadline</label>
                            <textarea
                              rows={2}
                              className={inputCls}
                              value={slide.sub}
                              onChange={(e) => {
                                const slides = [
                                  ...(editing.config.slides || []),
                                ];
                                slides[sIdx] = {
                                  ...slide,
                                  sub: e.target.value,
                                };
                                updateConfig({ slides });
                              }}
                            />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2">
                            <div>
                              <label className={labelCls}>
                                Primary Button Text & Link
                              </label>
                              <div className="flex gap-2">
                                <input
                                  className={inputCls}
                                  placeholder="SHOP JEWELLERY"
                                  value={slide.primary_cta_text ?? ''}
                                  onChange={(e) => {
                                    const slides = [
                                      ...(editing.config.slides || []),
                                    ];
                                    slides[sIdx] = {
                                      ...slide,
                                      primary_cta_text: e.target.value,
                                    };
                                    updateConfig({ slides });
                                  }}
                                />
                                <input
                                  className={inputCls}
                                  placeholder="/shop"
                                  value={slide.primary_cta_href ?? ''}
                                  onChange={(e) => {
                                    const slides = [
                                      ...(editing.config.slides || []),
                                    ];
                                    slides[sIdx] = {
                                      ...slide,
                                      primary_cta_href: e.target.value,
                                    };
                                    updateConfig({ slides });
                                  }}
                                />
                              </div>
                            </div>
                            <div>
                              <label className={labelCls}>
                                Secondary Button Text & Link
                              </label>
                              <div className="flex gap-2">
                                <input
                                  className={inputCls}
                                  placeholder="EXPLORE BANGLES"
                                  value={slide.secondary_cta_text ?? ''}
                                  onChange={(e) => {
                                    const slides = [
                                      ...(editing.config.slides || []),
                                    ];
                                    slides[sIdx] = {
                                      ...slide,
                                      secondary_cta_text: e.target.value,
                                    };
                                    updateConfig({ slides });
                                  }}
                                />
                                <input
                                  className={inputCls}
                                  placeholder="/bangles"
                                  value={slide.secondary_cta_href ?? ''}
                                  onChange={(e) => {
                                    const slides = [
                                      ...(editing.config.slides || []),
                                    ];
                                    slides[sIdx] = {
                                      ...slide,
                                      secondary_cta_href: e.target.value,
                                    };
                                    updateConfig({ slides });
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>
            ) : null}

            {/* ==================== 2. CATEGORY SHOWCASE EDITOR ==================== */}
            {editing.type === 'CATEGORY_SHOWCASE' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg">
                    Category Cards ({editing.config.category_cards?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const cards = [...(editing.config.category_cards || [])];
                      cards.push({
                        id: `cat-${Date.now()}`,
                        label: 'New Category',
                        tagline: 'Explore more',
                        href: '/shop',
                        img: '/editorial/editorial-3.jpg',
                        is_active: true,
                      });
                      updateConfig({ category_cards: cards });
                    }}
                    className="inline-flex items-center gap-1.5 bg-brand-burgundy px-3 py-1.5 text-xs tracking-widest text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD CARD
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {(editing.config.category_cards || []).map(
                    (card: CategoryCardItem, cIdx: number) => (
                      <div
                        key={card.id || cIdx}
                        className="border border-brand-champagne bg-white p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-burgundy">
                            Card #{cIdx + 1}: {card.label}
                          </span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              disabled={cIdx === 0}
                              onClick={() => {
                                const cards = [
                                  ...(editing.config.category_cards || []),
                                ];
                                const [m] = cards.splice(cIdx, 1);
                                cards.splice(cIdx - 1, 0, m);
                                updateConfig({ category_cards: cards });
                              }}
                              className="border border-brand-champagne p-1 disabled:opacity-30"
                            >
                              <ArrowUp className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              disabled={
                                cIdx ===
                                (editing.config.category_cards?.length || 1) - 1
                              }
                              onClick={() => {
                                const cards = [
                                  ...(editing.config.category_cards || []),
                                ];
                                const [m] = cards.splice(cIdx, 1);
                                cards.splice(cIdx + 1, 0, m);
                                updateConfig({ category_cards: cards });
                              }}
                              className="border border-brand-champagne p-1 disabled:opacity-30"
                            >
                              <ArrowDown className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const cards = (
                                  editing.config.category_cards || []
                                ).filter((_, i) => i !== cIdx);
                                updateConfig({ category_cards: cards });
                              }}
                              className="border border-brand-champagne p-1 text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2.5">
                          <div className="flex items-center gap-3">
                            <div className="relative h-16 w-14 shrink-0 overflow-hidden bg-brand-champagne">
                              {card.img ? (
                                <Image
                                  src={card.img}
                                  alt={card.label}
                                  fill
                                  sizes="60px"
                                  className="object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="flex flex-1 gap-1.5">
                              <input
                                className={inputCls}
                                value={card.img}
                                onChange={(e) => {
                                  const cards = [
                                    ...(editing.config.category_cards || []),
                                  ];
                                  cards[cIdx] = {
                                    ...card,
                                    img: e.target.value,
                                  };
                                  updateConfig({ category_cards: cards });
                                }}
                              />
                              <button
                                type="button"
                                disabled={uploading}
                                onClick={async () => {
                                  const path = await uploadImageFile();
                                  if (path) {
                                    const cards = [
                                      ...(editing.config.category_cards || []),
                                    ];
                                    cards[cIdx] = { ...card, img: path };
                                    updateConfig({ category_cards: cards });
                                  }
                                }}
                                className="border border-brand-burgundy px-2.5 text-brand-burgundy hover:bg-brand-burgundy hover:text-white"
                              >
                                <Upload className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className={labelCls}>Title</label>
                              <input
                                className={inputCls}
                                value={card.label}
                                onChange={(e) => {
                                  const cards = [
                                    ...(editing.config.category_cards || []),
                                  ];
                                  cards[cIdx] = {
                                    ...card,
                                    label: e.target.value,
                                  };
                                  updateConfig({ category_cards: cards });
                                }}
                              />
                            </div>
                            <div>
                              <label className={labelCls}>Tagline</label>
                              <input
                                className={inputCls}
                                value={card.tagline}
                                onChange={(e) => {
                                  const cards = [
                                    ...(editing.config.category_cards || []),
                                  ];
                                  cards[cIdx] = {
                                    ...card,
                                    tagline: e.target.value,
                                  };
                                  updateConfig({ category_cards: cards });
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <label className={labelCls}>Destination URL</label>
                            <input
                              className={inputCls}
                              value={card.href}
                              onChange={(e) => {
                                const cards = [
                                  ...(editing.config.category_cards || []),
                                ];
                                cards[cIdx] = {
                                  ...card,
                                  href: e.target.value,
                                };
                                updateConfig({ category_cards: cards });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {/* ==================== 3. PRODUCT SHOWCASES (NEW ARRIVALS / BESTSELLERS / HOME DECOR) ==================== */}
            {['NEW_ARRIVALS', 'BESTSELLERS', 'HOME_DECOR_SHOWCASE'].includes(
              editing.type,
            ) ? (
              <div className="grid gap-4 border border-brand-champagne bg-white p-4 sm:grid-cols-3">
                <div>
                  <label className={labelCls}>Number of Products to Show</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    className={inputCls}
                    value={editing.config.limit ?? 4}
                    onChange={(e) =>
                      updateConfig({ limit: Number(e.target.value) || 4 })
                    }
                  />
                </div>
                <div>
                  <label className={labelCls}>Button / Link Label</label>
                  <input
                    className={inputCls}
                    value={editing.config.cta_text ?? ''}
                    onChange={(e) => updateConfig({ cta_text: e.target.value })}
                  />
                </div>
                <div>
                  <label className={labelCls}>Button / Link URL</label>
                  <input
                    className={inputCls}
                    value={editing.config.cta_href ?? ''}
                    onChange={(e) => updateConfig({ cta_href: e.target.value })}
                  />
                </div>
              </div>
            ) : null}

            {/* ==================== 4. FEATURED COLLECTION EDITOR ==================== */}
            {editing.type === 'FEATURED_COLLECTION' ? (
              <div className="space-y-4 border border-brand-champagne bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Select Linked Collection</label>
                    <select
                      className={inputCls}
                      value={editing.config.collection_id || ''}
                      onChange={(e) =>
                        updateConfig({
                          collection_id: e.target.value || undefined,
                        })
                      }
                    >
                      <option value="">
                        Auto (Use Featured Collection from Collections tab)
                      </option>
                      {collections.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Override Image (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        className={inputCls}
                        placeholder="Leave blank to use collection's hero image"
                        value={editing.config.image || ''}
                        onChange={(e) =>
                          updateConfig({ image: e.target.value || undefined })
                        }
                      />
                      <button
                        type="button"
                        onClick={async () => {
                          const path = await uploadImageFile();
                          if (path) updateConfig({ image: path });
                        }}
                        className="border border-brand-burgundy px-3 text-brand-burgundy hover:bg-brand-burgundy hover:text-white"
                      >
                        <Upload className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelCls}>Override Description (Optional)</label>
                    <textarea
                      rows={3}
                      className={inputCls}
                      placeholder="Leave blank to use collection's description"
                      value={editing.config.body_text || ''}
                      onChange={(e) =>
                        updateConfig({ body_text: e.target.value || undefined })
                      }
                    />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className={labelCls}>CTA Button Label</label>
                      <input
                        className={inputCls}
                        value={editing.config.cta_text || ''}
                        onChange={(e) =>
                          updateConfig({ cta_text: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>CTA Button Link</label>
                      <input
                        className={inputCls}
                        value={editing.config.cta_href || ''}
                        onChange={(e) =>
                          updateConfig({ cta_href: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* ==================== 5. BRAND PROMISE / PROMO BANNER EDITOR ==================== */}
            {['BRAND_PROMISE', 'PROMO_BANNER'].includes(editing.type) ? (
              <div className="space-y-4 border border-brand-champagne bg-white p-4">
                <div>
                  <label className={labelCls}>Body Copy / Story Text</label>
                  <textarea
                    rows={3}
                    className={inputCls}
                    value={editing.config.body_text || ''}
                    onChange={(e) =>
                      updateConfig({ body_text: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelCls}>Button Label</label>
                    <input
                      className={inputCls}
                      value={editing.config.cta_text || ''}
                      onChange={(e) =>
                        updateConfig({ cta_text: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Button Link URL</label>
                    <input
                      className={inputCls}
                      value={editing.config.cta_href || ''}
                      onChange={(e) =>
                        updateConfig({ cta_href: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Background Theme</label>
                    <select
                      className={inputCls}
                      value={editing.config.theme || 'burgundy'}
                      onChange={(e) =>
                        updateConfig({
                          theme: e.target.value as
                            | 'ivory'
                            | 'champagne'
                            | 'burgundy'
                            | 'charcoal',
                        })
                      }
                    >
                      <option value="burgundy">Deep Burgundy (Luxury)</option>
                      <option value="charcoal">Charcoal Dark</option>
                      <option value="champagne">Warm Champagne</option>
                      <option value="ivory">Soft Ivory</option>
                    </select>
                  </div>
                </div>
                {editing.type === 'PROMO_BANNER' ? (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelCls}>
                        Promo Badge / Offer Code (Optional)
                      </label>
                      <input
                        className={inputCls}
                        placeholder="e.g. USE CODE: FESTIVE15"
                        value={editing.config.badge_text || ''}
                        onChange={(e) =>
                          updateConfig({ badge_text: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Banner Image (Optional)</label>
                      <div className="flex gap-2">
                        <input
                          className={inputCls}
                          value={editing.config.image || ''}
                          onChange={(e) =>
                            updateConfig({ image: e.target.value })
                          }
                        />
                        <button
                          type="button"
                          onClick={async () => {
                            const path = await uploadImageFile();
                            if (path) updateConfig({ image: path });
                          }}
                          className="border border-brand-burgundy px-3 text-brand-burgundy hover:bg-brand-burgundy hover:text-white"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ) : null}

            {/* ==================== 6. CUSTOM PRODUCT GRID EDITOR ==================== */}
            {editing.type === 'CUSTOM_PRODUCT_GRID' ? (
              <div className="space-y-4 border border-brand-champagne bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-4">
                  <div>
                    <label className={labelCls}>Filter By Category</label>
                    <select
                      className={inputCls}
                      value={editing.config.filter_category || 'JEWELLERY'}
                      onChange={(e) =>
                        updateConfig({
                          filter_category: e.target.value as ProductCategory,
                        })
                      }
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {CATEGORY_LABELS[c]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Max Products</label>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      className={inputCls}
                      value={editing.config.limit ?? 4}
                      onChange={(e) =>
                        updateConfig({ limit: Number(e.target.value) || 4 })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Button Text</label>
                    <input
                      className={inputCls}
                      value={editing.config.cta_text || ''}
                      onChange={(e) =>
                        updateConfig({ cta_text: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>CTA Link URL</label>
                    <input
                      className={inputCls}
                      value={editing.config.cta_href || ''}
                      onChange={(e) =>
                        updateConfig({ cta_href: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>
                    Or Hand-Pick Specific Products (Optional — overrides category
                    filter when any are checked)
                  </label>
                  <div className="mt-2 grid max-h-56 grid-cols-2 gap-2 overflow-y-auto border border-brand-champagne p-3 sm:grid-cols-3">
                    {products.map((p) => {
                      const selected = (
                        editing.config.product_ids || []
                      ).includes(p.id);
                      return (
                        <label
                          key={p.id}
                          className={`flex cursor-pointer items-center gap-2 border p-2 text-xs ${
                            selected
                              ? 'border-brand-burgundy bg-brand-champagne/30'
                              : 'border-brand-champagne'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => {
                              const current = editing.config.product_ids || [];
                              const next = e.target.checked
                                ? [...current, p.id]
                                : current.filter((id) => id !== p.id);
                              updateConfig({ product_ids: next });
                            }}
                          />
                          <span className="truncate">{p.name}</span>
                          <span className="ml-auto text-[10px] text-brand-charcoal/50">
                            {formatINR(p.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

            {/* ==================== 7. INSTAGRAM FEED EDITOR ==================== */}
            {editing.type === 'INSTAGRAM_FEED' ? (
              <div className="space-y-4 border border-brand-champagne bg-white p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Instagram Profile URL</label>
                    <input
                      className={inputCls}
                      value={editing.config.instagram_url || ''}
                      onChange={(e) =>
                        updateConfig({ instagram_url: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Button Text</label>
                    <input
                      className={inputCls}
                      value={editing.config.cta_text || 'FOLLOW US'}
                      onChange={(e) =>
                        updateConfig({ cta_text: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className={labelCls}>
                      Gallery Images (
                      {editing.config.instagram_images?.length || 0})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const imgs = [
                          ...(editing.config.instagram_images || []),
                          '/editorial/editorial-20.jpg',
                        ];
                        updateConfig({ instagram_images: imgs });
                      }}
                      className="inline-flex items-center gap-1 bg-brand-burgundy px-2.5 py-1 text-[11px] tracking-widest text-white"
                    >
                      <Plus className="h-3 w-3" /> ADD PHOTO
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(editing.config.instagram_images || []).map(
                      (imgUrl, idx) => (
                        <div
                          key={idx}
                          className="border border-brand-champagne p-2"
                        >
                          <div className="relative aspect-square w-full overflow-hidden bg-brand-champagne">
                            <Image
                              src={imgUrl}
                              alt={`Instagram ${idx + 1}`}
                              fill
                              sizes="150px"
                              className="object-cover"
                            />
                          </div>
                          <div className="mt-2 flex gap-1">
                            <input
                              className={inputCls}
                              value={imgUrl}
                              onChange={(e) => {
                                const imgs = [
                                  ...(editing.config.instagram_images || []),
                                ];
                                imgs[idx] = e.target.value;
                                updateConfig({ instagram_images: imgs });
                              }}
                            />
                            <button
                              type="button"
                              onClick={async () => {
                                const path = await uploadImageFile();
                                if (path) {
                                  const imgs = [
                                    ...(editing.config.instagram_images || []),
                                  ];
                                  imgs[idx] = path;
                                  updateConfig({ instagram_images: imgs });
                                }
                              }}
                              className="border border-brand-burgundy px-2 text-brand-burgundy"
                            >
                              <Upload className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const imgs = (
                                  editing.config.instagram_images || []
                                ).filter((_, i) => i !== idx);
                                updateConfig({ instagram_images: imgs });
                              }}
                              className="border border-brand-champagne px-2 text-red-700"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            ) : null}

            {/* ==================== 8. SERVICE STRIP EDITOR ==================== */}
            {editing.type === 'SERVICE_STRIP' ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg">
                    Service & Trust Badges (
                    {editing.config.service_badges?.length || 0})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      const badges = [
                        ...(editing.config.service_badges || []),
                      ];
                      badges.push({
                        id: `srv-${Date.now()}`,
                        icon: 'ShieldCheck',
                        title: '100% Authentic',
                        text: 'Handcrafted quality assurance',
                        is_active: true,
                      });
                      updateConfig({ service_badges: badges });
                    }}
                    className="inline-flex items-center gap-1.5 bg-brand-burgundy px-3 py-1.5 text-xs tracking-widest text-white"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD BADGE
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {(editing.config.service_badges || []).map(
                    (badge: ServiceBadgeItem, bIdx: number) => (
                      <div
                        key={badge.id || bIdx}
                        className="border border-brand-champagne bg-white p-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-medium text-brand-burgundy">
                            Badge #{bIdx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const badges = (
                                editing.config.service_badges || []
                              ).filter((_, i) => i !== bIdx);
                              updateConfig({ service_badges: badges });
                            }}
                            className="text-red-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className={labelCls}>Icon</label>
                            <select
                              className={inputCls}
                              value={badge.icon}
                              onChange={(e) => {
                                const badges = [
                                  ...(editing.config.service_badges || []),
                                ];
                                badges[bIdx] = {
                                  ...badge,
                                  icon: e.target.value as ServiceIconName,
                                };
                                updateConfig({ service_badges: badges });
                              }}
                            >
                              {SERVICE_ICONS.map((ic) => (
                                <option key={ic} value={ic}>
                                  {ic}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>Title</label>
                            <input
                              className={inputCls}
                              value={badge.title}
                              onChange={(e) => {
                                const badges = [
                                  ...(editing.config.service_badges || []),
                                ];
                                badges[bIdx] = {
                                  ...badge,
                                  title: e.target.value,
                                };
                                updateConfig({ service_badges: badges });
                              }}
                            />
                          </div>
                          <div>
                            <label className={labelCls}>Description</label>
                            <input
                              className={inputCls}
                              value={badge.text}
                              onChange={(e) => {
                                const badges = [
                                  ...(editing.config.service_badges || []),
                                ];
                                badges[bIdx] = {
                                  ...badge,
                                  text: e.target.value,
                                };
                                updateConfig({ service_badges: badges });
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="mt-6 flex items-center justify-end gap-3 border-t border-brand-champagne pt-4">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="border border-brand-champagne px-5 py-2.5 text-xs tracking-widest text-brand-charcoal/70 hover:border-brand-charcoal"
              >
                CANCEL
              </button>
              <button
                type="button"
                onClick={saveEditingSection}
                disabled={busy}
                className="bg-brand-burgundy px-6 py-2.5 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
              >
                {busy ? 'SAVING…' : 'SAVE SECTION'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
