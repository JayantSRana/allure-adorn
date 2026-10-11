import CheckoutForm from './CheckoutForm';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { ensureDatabase } from '@/lib/db';

export const metadata = {
  title: 'Checkout | Allure Adorn',
  robots: { index: false, follow: false },
};

export const dynamic = 'force-dynamic';

export default async function CheckoutPage() {
  const db = await ensureDatabase();
  const { cod_enabled, free_shipping_threshold, shipping_fee_flat, store_open } = db.settings;

  return (
    <div className="bg-brand-ivory py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-serif text-4xl font-light">Checkout</h1>
          <div className="flex justify-center py-3">
            <DiamondMotif className="text-sm" />
          </div>
        </div>
        {!store_open ? (
          <p className="mb-6 bg-brand-burgundy/10 p-4 text-center text-sm text-brand-burgundy">
            Our boutique is currently closed for new orders. Please check back soon.
          </p>
        ) : null}
        <div className="mt-10">
          <CheckoutForm
            settings={{ cod_enabled, free_shipping_threshold, shipping_fee_flat, store_open }}
          />
        </div>
      </div>
    </div>
  );
}
