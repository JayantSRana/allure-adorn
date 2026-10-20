import Link from 'next/link';
import { Camera, MessageCircle, Mail } from 'lucide-react';
import { DiamondMotif } from '@/components/store/DiamondMotif';

const COLS = [
  {
    heading: 'Shop',
    links: [
      { label: 'Jewellery', href: '/shop?category=JEWELLERY' },
      { label: 'Bangles', href: '/bangles' },
      { label: 'Home Decor', href: '/home-decor' },
      { label: 'New Arrivals', href: '/shop?filter=new' },
      { label: 'Collections', href: '/collections/the-allure-edit' },
    ],
  },
  {
    heading: 'Information',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Care Guide', href: '/care' },
      { label: 'Track Order', href: '/track' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    heading: 'Customer Care',
    links: [
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns & Exchange', href: '/returns' },
      { label: 'FAQs', href: '/faqs' },
    ],
  },
  {
    heading: 'Policies',
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export default function Footer() {
  const whatsapp = '9115503135';
  const email = 'allureadorn1321@gmail.com';
  const instagram = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || 'allureadorn';

  return (
    <footer className="mt-24 bg-brand-burgundy text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <h2 className="font-serif text-2xl tracking-[0.2em]">ALLURE ADORN</h2>
            <DiamondMotif className="my-4 text-xs" />
            <p className="max-w-xs text-sm text-white/70">
              Adornment, made to be remembered. Timeless jewellery and home decor,
              crafted with quiet luxury.
            </p>
            <div className="mt-6 flex gap-4">
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-white/80 hover:text-brand-gold"
              >
                <Camera className="h-5 w-5" />
              </a>
              <a
                href={whatsapp ? `https://wa.me/${whatsapp}` : '/contact'}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="text-white/80 hover:text-brand-gold"
              >
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href={`mailto:${email}`} aria-label="Email" className="text-white/80 hover:text-brand-gold">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {COLS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-4 text-[11px] uppercase tracking-widest text-brand-gold">
                {col.heading}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-white/75 hover:text-white">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center gap-3 border-t border-white/15 pt-8 text-center">
          <DiamondMotif className="text-xs" />
          <p className="text-xs text-white/60">
            © {new Date().getFullYear()} Allure Adorn. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
