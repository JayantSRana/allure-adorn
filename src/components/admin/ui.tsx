import Link from 'next/link';
import { cn } from '@/lib/utils';

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-brand-champagne pb-6">
      <div>
        <h1 className="font-serif text-3xl font-light text-brand-charcoal">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-brand-charcoal/55">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('border border-brand-champagne bg-white/60 p-6', className)}>
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cn(
        'border p-5',
        accent
          ? 'border-brand-burgundy bg-brand-burgundy text-white'
          : 'border-brand-champagne bg-white/60',
      )}
    >
      <p
        className={cn(
          'text-[11px] uppercase tracking-widest',
          accent ? 'text-white/70' : 'text-brand-charcoal/50',
        )}
      >
        {label}
      </p>
      <p className="mt-2 font-serif text-2xl sm:text-3xl">{value}</p>
      {hint ? (
        <p className={cn('mt-1 text-xs', accent ? 'text-white/70' : 'text-brand-charcoal/45')}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function BarList({
  items,
  emptyLabel = 'No data yet.',
  valueFormat,
}: {
  items: { label: string; value: number; sub?: string }[];
  emptyLabel?: string;
  valueFormat?: (n: number) => string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-brand-charcoal/45">{emptyLabel}</p>;
  }
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i.label}>
          <div className="flex items-center justify-between text-sm">
            <span className="truncate pr-3 text-brand-charcoal/80">{i.label}</span>
            <span className="shrink-0 tabular-nums text-brand-charcoal/60">
              {valueFormat ? valueFormat(i.value) : i.value}
              {i.sub ? <span className="ml-2 text-xs text-brand-charcoal/40">{i.sub}</span> : null}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 w-full bg-brand-champagne">
            <div
              className="h-full bg-brand-burgundy"
              style={{ width: `${Math.max(3, (i.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export function RangeTabs({
  basePath,
  active,
  ranges,
}: {
  basePath: string;
  active: string;
  ranges: { key: string; label: string }[];
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {ranges.map((r) => (
        <Link
          key={r.key}
          href={`${basePath}?range=${r.key}`}
          className={cn(
            'border px-3 py-1.5 text-xs tracking-widest transition',
            active === r.key
              ? 'border-brand-burgundy bg-brand-burgundy text-white'
              : 'border-brand-champagne hover:border-brand-gold',
          )}
        >
          {r.label.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

const STATUS_STYLES: Record<string, string> = {
  PENDING_PAYMENT: 'bg-amber-100 text-amber-800 border-amber-200',
  PAID: 'bg-brand-burgundy/10 text-brand-burgundy border-brand-burgundy/20',
  PACKED: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  SHIPPED: 'bg-blue-50 text-blue-700 border-blue-200',
  DELIVERED: 'bg-green-50 text-green-700 border-green-200',
  CANCELLED: 'bg-red-50 text-red-700 border-red-200',
  RETURNED: 'bg-brand-charcoal/10 text-brand-charcoal border-brand-charcoal/20',
  PAID_STATUS: 'bg-green-50 text-green-700 border-green-200',
  PENDING: 'bg-amber-100 text-amber-800 border-amber-200',
  REFUNDED: 'bg-brand-charcoal/10 text-brand-charcoal border-brand-charcoal/20',
  FAILED: 'bg-red-50 text-red-700 border-red-200',
  NONE: 'bg-brand-champagne/60 text-brand-charcoal/60 border-brand-champagne',
  NEEDS_REFUND: 'bg-orange-50 text-orange-700 border-orange-200',
  PARTIAL: 'bg-orange-50 text-orange-700 border-orange-200',
};

export function StatusBadge({ status }: { status: string }) {
  const cls = STATUS_STYLES[status] ?? 'bg-brand-champagne/60 text-brand-charcoal/70 border-brand-champagne';
  return (
    <span
      className={cn(
        'inline-block border px-2 py-0.5 text-[10px] uppercase tracking-widest',
        cls,
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
