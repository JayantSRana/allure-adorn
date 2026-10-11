import { DiamondMotif } from '@/components/store/DiamondMotif';

export default function PolicyPage({
  title,
  intro,
  sections,
}: {
  title: string;
  intro?: string;
  sections: { heading: string; body: string }[];
}) {
  return (
    <div className="bg-brand-ivory py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">{title}</h1>
          <div className="flex justify-center py-3"><DiamondMotif className="text-sm" /></div>
          {intro ? <p className="text-sm text-brand-charcoal/70">{intro}</p> : null}
        </div>
        <div className="mt-12 space-y-8">
          {sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-serif text-2xl">{s.heading}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/75">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
