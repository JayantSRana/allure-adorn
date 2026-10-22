'use client';

import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsApp({
  phone = '9115503135',
}: {
  phone?: string;
}) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const href = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    'Hello Allure Adorn, I would like assistance choosing a piece from your boutique.',
  )}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with Boutique Stylist on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2.5 border border-brand-gold/80 bg-brand-burgundy px-4 py-3 text-white shadow-xl transition-all duration-300 hover:bg-brand-charcoal"
    >
      <MessageCircle className="h-4 w-4 text-brand-gold transition-transform group-hover:scale-110" />
      <span className="hidden text-[10px] uppercase tracking-[0.22em] sm:inline">
        Stylist Concierge
      </span>
    </a>
  );
}
