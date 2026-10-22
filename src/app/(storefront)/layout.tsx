import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FloatingWhatsApp from '@/components/layout/FloatingWhatsApp';
import { CartProvider } from '@/lib/cart-context';
import { WishlistProvider } from '@/lib/wishlist-context';
import CartDrawer from '@/components/store/CartDrawer';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let announcement: string | undefined;
  let threshold = 3000;
  let whatsapp = '9115503135';
  try {
    const db = await ensureDatabase();
    if (db.settings.announcement_bar_enabled) {
      announcement = db.settings.announcement_bar_text;
    }
    threshold = db.settings.free_shipping_threshold;
    if (db.settings.whatsapp_number) {
      whatsapp = db.settings.whatsapp_number;
    }
  } catch {
    announcement =
      '✨ Worldwide Shipping Available | Free Shipping Above ₹3000 ✨';
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <Header announcement={announcement} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CartDrawer freeShippingThreshold={threshold} />
        <FloatingWhatsApp phone={whatsapp} />
      </CartProvider>
    </WishlistProvider>
  );
}
