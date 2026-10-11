import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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
  try {
    const db = await ensureDatabase();
    if (db.settings.announcement_bar_enabled) {
      announcement = db.settings.announcement_bar_text;
    }
    threshold = db.settings.free_shipping_threshold;
  } catch {
    announcement = '✨ Worldwide Shipping Available | Free Shipping Above ₹3000 ✨';
  }

  return (
    <WishlistProvider>
      <CartProvider>
        <Header announcement={announcement} />
        <main className="min-h-[60vh]">{children}</main>
        <Footer />
        <CartDrawer freeShippingThreshold={threshold} />
      </CartProvider>
    </WishlistProvider>
  );
}
