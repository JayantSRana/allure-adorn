'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Trash2, PackageCheck, Truck, CheckCircle2, Ban, RotateCcw } from 'lucide-react';
import { Order } from '@/types';
import { formatINR, formatDateTime } from '@/lib/format';
import { StatusBadge } from '@/components/admin/ui';

const STATUS_FILTERS: { key: string; label: string }[] = [
  { key: '', label: 'All Statuses' },
  { key: 'PENDING_PAYMENT', label: 'Awaiting Payment' },
  { key: 'PAID', label: 'Confirmed' },
  { key: 'PACKED', label: 'Packed' },
  { key: 'SHIPPED', label: 'Shipped' },
  { key: 'DELIVERED', label: 'Delivered' },
  { key: 'CANCELLED', label: 'Cancelled' },
  { key: 'RETURNED', label: 'Returned' },
];

const PAYMENT_FILTERS = ['', 'PENDING', 'PAID', 'REFUNDED', 'FAILED'];
const REFUND_FILTERS = ['', 'NONE', 'NEEDS_REFUND', 'REFUNDED', 'PARTIAL'];

const inputCls =
  'w-full border border-brand-champagne bg-white px-3 py-2 text-sm outline-none focus:border-brand-burgundy';

export default function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('');
  const [payment, setPayment] = useState('');
  const [refund, setRefund] = useState('');
  const [selected, setSelected] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((o) => (status ? o.status === status : true))
      .filter((o) => (payment ? o.payment_status === payment : true))
      .filter((o) => (refund ? o.refund_status === refund : true))
      .filter((o) =>
        q
          ? o.customer_name.toLowerCase().includes(q) ||
            o.customer_phone.includes(q) ||
            o.order_number.toLowerCase().includes(q)
          : true,
      )
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, query, status, payment, refund]);

  const patch = async (id: string, body: Record<string, unknown>) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.order) setSelected(data.order);
      if (data.deleted) setSelected(null);
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-charcoal/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, phone, order #"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className={inputCls}>
          {STATUS_FILTERS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
        <select value={payment} onChange={(e) => setPayment(e.target.value)} className={inputCls}>
          {PAYMENT_FILTERS.map((p) => (
            <option key={p} value={p}>
              {p ? `Payment: ${p}` : 'All Payments'}
            </option>
          ))}
        </select>
        <select value={refund} onChange={(e) => setRefund(e.target.value)} className={inputCls}>
          {REFUND_FILTERS.map((r) => (
            <option key={r} value={r}>
              {r ? `Refund: ${r.replace('_', ' ')}` : 'All Refunds'}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-brand-champagne bg-white/50">
        <table className="w-full min-w-[820px] text-sm">
          <thead>
            <tr className="border-b border-brand-champagne text-left text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-brand-charcoal/45">
                  No orders match. Place a test order from the storefront, or add demo
                  orders from the dashboard.
                </td>
              </tr>
            ) : (
              filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="cursor-pointer border-b border-brand-champagne/60 last:border-0 hover:bg-brand-champagne/30"
                >
                  <td className="px-4 py-3 font-medium">{o.order_number}</td>
                  <td className="px-4 py-3">
                    <span className="block">{o.customer_name}</span>
                    <span className="text-xs text-brand-charcoal/45">{o.customer_phone}</span>
                  </td>
                  <td className="px-4 py-3 text-brand-charcoal/60">{o.items.length}</td>
                  <td className="px-4 py-3">{formatINR(o.total_amount)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.payment_status} />
                  </td>
                  <td className="px-4 py-3 text-xs text-brand-charcoal/50">
                    {formatDateTime(o.created_at)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selected ? (
        <OrderDrawer
          order={selected}
          busy={busy}
          onClose={() => setSelected(null)}
          onPatch={(body) => patch(selected.id, body)}
        />
      ) : null}
    </>
  );
}

function OrderDrawer({
  order,
  busy,
  onClose,
  onPatch,
}: {
  order: Order;
  busy: boolean;
  onClose: () => void;
  onPatch: (body: Record<string, unknown>) => void;
}) {
  const [tracking, setTracking] = useState(order.tracking_number ?? '');
  const [courier, setCourier] = useState(order.courier ?? '');
  const [notes, setNotes] = useState(order.admin_notes ?? '');
  const [refundAmount, setRefundAmount] = useState(String(order.refund_amount || order.total_amount));
  const [refundReason, setRefundReason] = useState(order.refund_reason ?? '');

  const canPay = order.status === 'PENDING_PAYMENT';
  const canPack = order.status === 'PAID';
  const canShip = order.status === 'PACKED';
  const canDeliver = order.status === 'SHIPPED';

  return (
    <div className="fixed inset-0 z-[90] flex justify-end">
      <div className="absolute inset-0 bg-brand-charcoal/40" onClick={onClose} />
      <div className="relative flex h-full w-full max-w-lg flex-col overflow-y-auto bg-brand-ivory shadow-2xl">
        <div className="flex items-center justify-between border-b border-brand-champagne px-5 py-4">
          <div>
            <h2 className="font-serif text-xl">{order.order_number}</h2>
            <p className="text-xs text-brand-charcoal/50">{formatDateTime(order.created_at)}</p>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 hover:text-brand-burgundy">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          <div className="flex flex-wrap gap-2">
            <StatusBadge status={order.status} />
            <StatusBadge status={order.payment_status} />
            <StatusBadge status={order.refund_status} />
          </div>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              Customer
            </h3>
            <p className="text-sm">{order.customer_name}</p>
            <p className="text-sm text-brand-charcoal/60">{order.customer_phone}</p>
            <p className="text-sm text-brand-charcoal/60">{order.customer_email}</p>
            <p className="mt-2 text-sm leading-relaxed text-brand-charcoal/70">
              {order.shipping_address.line1}
              {order.shipping_address.line2 ? `, ${order.shipping_address.line2}` : ''}
              <br />
              {order.shipping_address.city}, {order.shipping_address.state}{' '}
              {order.shipping_address.pincode}
              <br />
              {order.shipping_address.country}
            </p>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              Items
            </h3>
            <ul className="space-y-2">
              {order.items.map((it, i) => (
                <li key={i} className="flex justify-between gap-3 text-sm">
                  <span>
                    {it.name}
                    <span className="block text-xs text-brand-charcoal/45">
                      {formatINR(it.price)} × {it.qty} · cost {formatINR(it.cost_price)}
                    </span>
                  </span>
                  <span>{formatINR(it.total)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-brand-champagne pt-3 text-sm">
              <div className="flex justify-between text-brand-charcoal/60">
                <span>Subtotal</span>
                <span>{formatINR(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-brand-charcoal/60">
                <span>Shipping</span>
                <span>{order.shipping_fee === 0 ? 'Free' : formatINR(order.shipping_fee)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>{formatINR(order.total_amount)}</span>
              </div>
              <div className="flex justify-between text-xs text-green-700">
                <span>Profit (est.)</span>
                <span>{formatINR(order.total_amount - order.total_cost)}</span>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              Fulfilment
            </h3>
            <div className="flex flex-wrap gap-2">
              {canPay ? (
                <ActionBtn busy={busy} onClick={() => onPatch({ action: 'PAY' })} icon={CheckCircle2}>
                  Mark Paid
                </ActionBtn>
              ) : null}
              {canPack ? (
                <ActionBtn busy={busy} onClick={() => onPatch({ status: 'PACKED' })} icon={PackageCheck}>
                  Pack
                </ActionBtn>
              ) : null}
              {canShip ? (
                <ActionBtn
                  busy={busy}
                  onClick={() => onPatch({ status: 'SHIPPED', tracking_number: tracking, courier })}
                  icon={Truck}
                >
                  Mark Shipped
                </ActionBtn>
              ) : null}
              {canDeliver ? (
                <ActionBtn busy={busy} onClick={() => onPatch({ status: 'DELIVERED' })} icon={CheckCircle2}>
                  Delivered
                </ActionBtn>
              ) : null}
              {order.status !== 'CANCELLED' && order.status !== 'RETURNED' ? (
                <ActionBtn
                  busy={busy}
                  onClick={() => onPatch({ status: 'CANCELLED', note: 'Cancelled by admin' })}
                  icon={Ban}
                  danger
                >
                  Cancel
                </ActionBtn>
              ) : null}
            </div>

            {(order.status === 'PACKED' || order.status === 'SHIPPED') && (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <input
                  className={inputCls}
                  placeholder="Courier"
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                />
                <input
                  className={inputCls}
                  placeholder="Tracking number"
                  value={tracking}
                  onChange={(e) => setTracking(e.target.value)}
                />
              </div>
            )}
          </section>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              Refund
            </h3>
            <div className="grid gap-2 sm:grid-cols-2">
              <input
                className={inputCls}
                placeholder="Refund amount"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                inputMode="numeric"
              />
              <input
                className={inputCls}
                placeholder="Reason"
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
              />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <ActionBtn
                busy={busy}
                icon={RotateCcw}
                onClick={() =>
                  onPatch({
                    refund: {
                      status: 'NEEDS_REFUND',
                      amount: Number(refundAmount),
                      reason: refundReason,
                    },
                  })
                }
              >
                Flag Needs Refund
              </ActionBtn>
              <ActionBtn
                busy={busy}
                icon={CheckCircle2}
                onClick={() =>
                  onPatch({
                    refund: {
                      status: 'REFUNDED',
                      amount: Number(refundAmount),
                      reason: refundReason,
                    },
                  })
                }
              >
                Mark Refunded
              </ActionBtn>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              Admin Notes
            </h3>
            <textarea
              rows={3}
              className={inputCls}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <button
              onClick={() => onPatch({ admin_notes: notes })}
              disabled={busy}
              className="mt-2 border border-brand-champagne px-4 py-2 text-xs tracking-widest hover:border-brand-gold disabled:opacity-50"
            >
              SAVE NOTES
            </button>
          </section>

          <section>
            <h3 className="mb-2 text-[11px] uppercase tracking-widest text-brand-charcoal/50">
              History
            </h3>
            <ul className="space-y-1 text-xs text-brand-charcoal/60">
              {order.status_history.map((h, i) => (
                <li key={i}>
                  {formatDateTime(h.timestamp)} — {h.status.replace('_', ' ')}
                  {h.note ? ` (${h.note})` : ''}
                </li>
              ))}
            </ul>
          </section>

          <button
            onClick={() => {
              if (window.confirm('Delete this order permanently?')) onPatch({ delete: true });
            }}
            disabled={busy}
            className="inline-flex items-center gap-2 border border-red-200 px-4 py-2 text-xs tracking-widest text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> DELETE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  onClick,
  busy,
  icon: Icon,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  busy: boolean;
  icon: React.ComponentType<{ className?: string }>;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={busy}
      className={`inline-flex items-center gap-2 border px-3 py-2 text-xs tracking-widest transition disabled:opacity-50 ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50'
          : 'border-brand-champagne hover:border-brand-gold'
      }`}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </button>
  );
}
