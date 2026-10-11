import Link from 'next/link';
import OrderStatusTracker from '@/components/store/OrderStatusTracker';
import { DiamondMotif } from '@/components/store/DiamondMotif';
import { getOrderByNumberOrId } from '@/lib/store';

export const dynamic = 'force-dynamic';

export default async function OrderPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = await getOrderByNumberOrId(params.orderId);

  if (!order) {
    return (
      <div className="bg-brand-ivory py-20">
        <div className="mx-auto max-w-lg px-4 text-center">
          <h1 className="font-serif text-3xl">Order not found</h1>
          <div className="flex justify-center py-3">
            <DiamondMotif className="text-sm" />
          </div>
          <p className="text-sm text-brand-charcoal/60">
            We couldn&apos;t find an order with that reference.
          </p>
          <Link href="/track" className="mt-6 inline-block bg-brand-burgundy px-8 py-3 text-xs tracking-widest text-white">
            TRACK AN ORDER
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-ivory py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <OrderStatusTracker initial={order} />
        <div className="mt-10 text-center">
          <Link href="/shop" className="text-xs uppercase tracking-widest text-brand-burgundy hover:text-brand-gold">
            Continue shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
