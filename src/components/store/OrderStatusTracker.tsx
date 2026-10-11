'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Check,
  Clock,
  Package,
  Truck,
  Home,
  CreditCard,
} from 'lucide-react';
import { Order } from '@/types';
import { ORDER_STATUS_STEPS, ORDER_STATUS_LABELS, formatINR, formatDateTime } from '@/lib/format';
import { cn } from '@/lib/utils';

const STEP_ICONS = [CreditCard, Check, Package, Truck, Home];

export default function OrderStatusTracker({ initial }: { initial: Order }) {
  const [order, setOrder] = useState<Order>(initial);
  const [live, setLive] = useState(false);
  const [paying, setPaying] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${order.id}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.order) setOrder(data.order);
      }
    } catch {
      // ignore
    }
  }, [order.id]);

  useEffect(() => {
    const es = new EventSource('/api/realtime');
    es.addEventListener('connected', () => setLive(true));
    const handler = () => refresh();
    ['ORDER_CREATED', 'ORDER_PAID', 'ORDER_UPDATED', 'ORDER_SHIPPED'].forEach((e) =>
      es.addEventListener(e, handler),
    );
    es.onerror = () => setLive(false);
    return () => es.close();
  }, [refresh]);

  const isCancelled = order.status === 'CANCELLED' || order.status === 'RETURNED';
  const currentIndex = ORDER_STATUS_STEPS.indexOf(
    order.status as (typeof ORDER_STATUS_STEPS)[number],
  );

  const pay = async () => {
    setPaying(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PAY' }),
      });
      const data = await res.json();
      if (data.order) setOrder(data.order);
    } finally {
      setPaying(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-gold">Order</p>
          <h1 className="font-serif text-3xl">{order.order_number}</h1>
          <p className="mt-1 text-xs text-brand-charcoal/50">
            Placed {formatDateTime(order.created_at)}
          </p>
        </div>
        <span
          className={cn(
            'px-3 py-1.5 text-[11px] uppercase tracking-widest',
            order.payment_status === 'PAID'
              ? 'bg-brand-burgundy text-white'
              : 'bg-brand-champagne text-brand-charcoal',
          )}
        >
          {order.payment_status === 'PAID' ? 'Paid' : ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {order.payment_status === 'PENDING' && !isCancelled ? (
        <div className="flex flex-col gap-3 border border-brand-gold/50 bg-brand-champagne/40 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-5 w-5 text-brand-gold" />
            <span>Complete your payment to confirm this order.</span>
          </div>
          <button
            onClick={pay}
            disabled={paying}
            className="bg-brand-burgundy px-6 py-3 text-xs tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
          >
            {paying ? 'CONFIRMING…' : 'PAY NOW (DEMO)'}
          </button>
        </div>
      ) : null}

      {isCancelled ? (
        <div className="border border-brand-burgundy/40 bg-brand-burgundy/5 p-5 text-sm text-brand-burgundy">
          This order is {ORDER_STATUS_LABELS[order.status].toLowerCase()}.
        </div>
      ) : (
        <ol className="grid grid-cols-1 gap-4 sm:grid-cols-5">
          {ORDER_STATUS_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i];
            const done = i <= currentIndex;
            return (
              <li key={step} className="flex items-center gap-3 sm:flex-col sm:text-center">
                <span
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border',
                    done
                      ? 'border-brand-burgundy bg-brand-burgundy text-white'
                      : 'border-brand-champagne bg-brand-ivory text-brand-charcoal/40',
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <span className={cn('text-xs', done ? 'text-brand-charcoal' : 'text-brand-charcoal/40')}>
                  {ORDER_STATUS_LABELS[step]}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      {order.status === 'SHIPPED' && order.tracking_number ? (
        <div className="border border-brand-champagne bg-brand-champagne/30 p-5 text-sm">
          <p className="text-brand-charcoal/60">Tracking</p>
          <p className="mt-1">
            {order.courier ? `${order.courier} · ` : ''}
            <span className="font-medium">{order.tracking_number}</span>
          </p>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="border border-brand-champagne p-6">
          <h2 className="mb-4 font-serif text-xl">Items</h2>
          <ul className="space-y-4">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between gap-4 text-sm">
                <div>
                  <p>{it.name}</p>
                  <p className="text-xs text-brand-charcoal/50">Qty {it.qty}</p>
                </div>
                <span>{formatINR(it.total)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 space-y-2 border-t border-brand-champagne pt-4 text-sm">
            <div className="flex justify-between text-brand-charcoal/60">
              <span>Subtotal</span>
              <span>{formatINR(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-brand-charcoal/60">
              <span>Shipping</span>
              <span>{order.shipping_fee === 0 ? 'Free' : formatINR(order.shipping_fee)}</span>
            </div>
            <div className="flex justify-between border-t border-brand-champagne pt-3 font-medium">
              <span>Total</span>
              <span>{formatINR(order.total_amount)}</span>
            </div>
          </div>
        </div>

        <div className="border border-brand-champagne p-6">
          <h2 className="mb-4 font-serif text-xl">Delivery</h2>
          <p className="text-sm">{order.customer_name}</p>
          <p className="text-sm text-brand-charcoal/60">{order.customer_phone}</p>
          <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/70">
            {order.shipping_address.line1}
            {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}
            <br />
            {order.shipping_address.city}, {order.shipping_address.state}{' '}
            {order.shipping_address.pincode}
            <br />
            {order.shipping_address.country}
          </p>
          <p className="mt-4 text-xs text-brand-charcoal/50">
            Payment: {order.payment_method.replace('_', ' ')}
          </p>
          <p className="mt-1 flex items-center gap-2 text-xs text-brand-charcoal/50">
            <span className={cn('h-2 w-2 rounded-full', live ? 'bg-green-500' : 'bg-brand-gold')} />
            {live ? 'Live updates on' : 'Connecting to live updates…'}
          </p>
        </div>
      </div>
    </div>
  );
}
