import { AdminPageHeader } from '@/components/admin/ui';
import SettingsForm from '@/components/admin/SettingsForm';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

const FIELDS = [
  'store_open',
  'cod_enabled',
  'discount_enabled',
  'discount_percent',
  'discount_code',
  'free_shipping_threshold',
  'shipping_fee_flat',
  'international_shipping_enabled',
] as const;

export default async function AdminDiscountsPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Discounts & Fees"
        subtitle="Launch discounts, shipping thresholds, delivery fees and payment options."
      />
      <SettingsForm
        initial={db.settings}
        fields={[...FIELDS]}
        title="Discounts, Shipping & Fees"
      />
    </div>
  );
}
