import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { DiamondMotif } from '@/components/store/DiamondMotif';

export const metadata = { title: 'Contact | Allure Adorn' };

export default function ContactPage() {
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  return (
    <div className="bg-brand-ivory py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">Get In Touch</h1>
          <div className="flex justify-center py-3"><DiamondMotif className="text-sm" /></div>
          <p className="mx-auto max-w-lg text-sm text-brand-charcoal/70">
            Questions about a piece, your order, or a custom request? We&apos;d love to help.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <a href={whatsapp ? `https://wa.me/${whatsapp}` : '#'} target="_blank" rel="noreferrer" className="border border-brand-champagne p-8 text-center hover:border-brand-gold">
            <MessageCircle className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">WhatsApp</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">Fastest response</p>
          </a>
          <a href="mailto:orders@allureadorn.com" className="border border-brand-champagne p-8 text-center hover:border-brand-gold">
            <Mail className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">Email</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">orders@allureadorn.com</p>
          </a>
          <div className="border border-brand-champagne p-8 text-center">
            <MapPin className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">Studio</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">By appointment</p>
          </div>
        </div>

        <form className="mx-auto mt-12 max-w-2xl space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <input placeholder="Your name" className="border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy" />
            <input placeholder="Email or phone" className="border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy" />
          </div>
          <textarea rows={5} placeholder="How can we help?" className="w-full border border-brand-champagne bg-white px-4 py-3 text-sm outline-none focus:border-brand-burgundy" />
          <button type="submit" className="w-full bg-brand-burgundy py-3.5 text-xs tracking-widest text-white hover:bg-brand-charcoal">
            SEND MESSAGE
          </button>
        </form>
      </div>
    </div>
  );
}
