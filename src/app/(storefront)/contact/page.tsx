import { MessageCircle, Mail, MapPin } from 'lucide-react';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import ContactForm from '@/components/store/ContactForm';

export const metadata = { title: 'Contact | Allure Adorn' };

export default function ContactPage() {
  const whatsapp = '9115503135';
  const email = 'allureadorn1321@gmail.com';
  const studioAddress = 'umbera homez Ferozepur - Ludhiana Rd, Ludhiana, Punjab 141102';
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
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="border border-brand-champagne p-8 text-center hover:border-brand-gold">
            <MessageCircle className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">WhatsApp</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">{whatsapp}</p>
            <p className="mt-1 text-sm text-brand-charcoal/60">Fastest response</p>
          </a>
          <a href={`mailto:${email}`} className="border border-brand-champagne p-8 text-center hover:border-brand-gold">
            <Mail className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">Email</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">{email}</p>
          </a>
          <div className="border border-brand-champagne p-8 text-center">
            <MapPin className="mx-auto h-6 w-6 text-brand-gold" />
            <h2 className="mt-3 font-serif text-lg">Studio</h2>
            <p className="mt-1 text-sm text-brand-charcoal/60">{studioAddress}</p>
            <p className="mt-1 text-sm text-brand-charcoal/60">By appointment only</p>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
