import { Droplets, SprayCan, Box, Sparkles, Wind, Heart } from 'lucide-react';
import { SectionHeading } from '@/components/store/DiamondMotif';

export const metadata = { title: 'Care Guide | Allure Adorn' };

const TIPS = [
  { icon: SprayCan, title: 'Last on, first off', text: 'Apply perfume, lotion and hairspray before wearing your jewellery — never directly onto it.' },
  { icon: Droplets, title: 'Keep it dry', text: 'Avoid water, pools and chemicals. Remove before washing hands, showering or swimming.' },
  { icon: Box, title: 'Store separately', text: 'Keep each piece in its own pouch to prevent scratches and tangling.' },
  { icon: Sparkles, title: 'Wipe gently', text: 'After wearing, wipe with a soft dry cloth to remove oils and restore shine.' },
  { icon: Wind, title: 'A dry, cool place', text: 'Store away from direct sunlight and humidity to protect the finish.' },
  { icon: Heart, title: 'Wear often', text: 'Anti-tarnish pieces are made to be worn. Regular, gentle wear keeps them glowing.' },
];

export default function CarePage() {
  return (
    <div className="bg-brand-ivory">
      <section className="bg-brand-champagne/40 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <SectionHeading title="Care For Your Allure" subtitle="A few small habits keep your pieces looking as beautiful as the day they arrived." />
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TIPS.map((t) => (
            <div key={t.title} className="border border-brand-champagne p-8 text-center">
              <t.icon className="mx-auto h-7 w-7 text-brand-gold" />
              <h2 className="mt-4 font-serif text-xl">{t.title}</h2>
              <p className="mt-2 text-sm text-brand-charcoal/70">{t.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
