import { cn } from '@/lib/utils';

export function DiamondMotif({
  className,
  count = 4,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 text-brand-gold', className)}
      aria-hidden="true"
    >
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[0.55em] leading-none">
          ◆
        </span>
      ))}
    </span>
  );
}

export function SectionHeading({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn('text-center', className)}>
      <h2 className="font-serif text-3xl sm:text-4xl font-light tracking-wide text-brand-charcoal">
        {title}
      </h2>
      <div className="flex justify-center py-3">
        <DiamondMotif className="text-sm" />
      </div>
      {subtitle ? (
        <p className="mx-auto max-w-2xl text-sm text-brand-charcoal/70">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}
