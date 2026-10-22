import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  AdminPageHeader,
  Card,
  StatCard,
  BarList,
  RangeTabs,
} from '@/components/admin/ui';
import DemoActions from '@/components/admin/DemoActions';
import { ensureDatabase } from '@/lib/db';
import {
  computeDashboard,
  DATE_RANGES,
  DateRange,
  rangeBounds,
} from '@/lib/analytics';
import { formatINR } from '@/lib/format';
import { ProductCategory } from '@/types';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const range = (
    DATE_RANGES.some((r) => r.key === searchParams.range)
      ? searchParams.range
      : 'all'
  ) as DateRange;

  const db = await ensureDatabase();
  const categoryLookup: Record<string, ProductCategory> = {};
  db.products.forEach((p) => (categoryLookup[p.id] = p.category));

  const stats = computeDashboard(db.orders, range, categoryLookup);
  const { from } = rangeBounds(range);
  const lowStock = db.products.filter((p) => p.stock <= 3 && p.is_active).length;
  const pendingApproval = db.reviews.filter((r) => !r.is_approved).length;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        subtitle="Live revenue, profit and order insights across your boutique."
        action={<DemoActions />}
      />

      <div className="mb-6">
        <RangeTabs basePath="/admin" active={range} ranges={DATE_RANGES} />
        <p className="mt-2 text-xs text-brand-charcoal/40">
          Showing orders since {from.toLocaleDateString('en-IN')}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Net Revenue"
          value={formatINR(stats.netRevenue)}
          hint={`${stats.paidOrderCount} paid orders`}
          accent
        />
        <StatCard label="Gross Profit" value={formatINR(stats.grossProfit)} hint={`COGS ${formatINR(stats.cogs)}`} />
        <StatCard label="Profit Margin" value={`${stats.profitMargin.toFixed(1)}%`} hint="Gross profit / net revenue" />
        <StatCard label="Average Order Value" value={formatINR(stats.aov)} hint={`${stats.unitsSold} units sold`} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Orders" value={String(stats.totalOrders)} hint="All statuses in range" />
        <StatCard label="Awaiting Payment" value={String(stats.pendingCount)} hint="Needs follow-up" />
        <StatCard label="Cancelled / Returned" value={String(stats.cancelledCount)} />
        <StatCard
          label="Repeat Customer Rate"
          value={`${stats.repeatCustomerRate.toFixed(0)}%`}
          hint={`${stats.repeatCustomers} of ${stats.uniqueCustomers} customers`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-4 font-serif text-xl">Top 5 Best-Selling Products</h2>
          <BarList
            items={stats.topProducts.map((p) => ({
              label: p.name,
              value: p.qty,
              sub: formatINR(p.revenue),
            }))}
            emptyLabel="No paid orders in this range yet. Add demo orders to preview."
            valueFormat={(n) => `${n} sold`}
          />
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl">Category Share</h2>
          <BarList
            items={stats.categoryShare.map((c) => ({
              label: c.category,
              value: Math.round(c.percent),
              sub: formatINR(c.revenue),
            }))}
            emptyLabel="No paid orders in this range yet."
            valueFormat={(n) => `${n}%`}
          />
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl">Hourly Order Distribution</h2>
          <div className="flex h-40 items-end gap-1">
            {stats.hourly.map((h) => {
              const max = Math.max(1, ...stats.hourly.map((x) => x.count));
              return (
                <div key={h.hour} className="flex flex-1 flex-col items-center justify-end">
                  <div
                    className="w-full bg-brand-burgundy/80"
                    style={{ height: `${(h.count / max) * 100}%`, minHeight: h.count > 0 ? 4 : 1 }}
                    title={`${h.count} orders at ${h.hour}:00`}
                  />
                  {h.hour % 6 === 0 ? (
                    <span className="mt-1 text-[9px] text-brand-charcoal/40">{h.hour}</span>
                  ) : (
                    <span className="mt-1 text-[9px]">&nbsp;</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 font-serif text-xl">Quick Actions</h2>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href="/admin/content" className="flex items-center justify-between border border-brand-champagne px-4 py-3 hover:border-brand-gold">
                <span>Customize Website & Homepage Sections</span>
                <ArrowUpRight className="h-4 w-4 text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/admin/orders" className="flex items-center justify-between border border-brand-champagne px-4 py-3 hover:border-brand-gold">
                Manage orders ledger <ArrowUpRight className="h-4 w-4 text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/admin/products" className="flex items-center justify-between border border-brand-champagne px-4 py-3 hover:border-brand-gold">
                <span>Inventory · {lowStock} low-stock item(s)</span>
                <ArrowUpRight className="h-4 w-4 text-brand-gold" />
              </Link>
            </li>
            <li>
              <Link href="/admin/reviews" className="flex items-center justify-between border border-brand-champagne px-4 py-3 hover:border-brand-gold">
                <span>Reviews · {pendingApproval} awaiting approval</span>
                <ArrowUpRight className="h-4 w-4 text-brand-gold" />
              </Link>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

