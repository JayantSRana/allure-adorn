import { Order, ProductCategory } from '@/types';

export type DateRange = 'today' | 'yesterday' | '7d' | 'month' | 'all';

export const DATE_RANGES: { key: DateRange; label: string }[] = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d', label: 'Last 7 Days' },
  { key: 'month', label: 'This Month' },
  { key: 'all', label: 'All Time' },
];

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function rangeBounds(range: DateRange, now = new Date()): { from: Date; to: Date } {
  const to = new Date(now);
  switch (range) {
    case 'today':
      return { from: startOfDay(now), to };
    case 'yesterday': {
      const y = startOfDay(now);
      y.setDate(y.getDate() - 1);
      return { from: y, to: startOfDay(now) };
    }
    case '7d': {
      const f = startOfDay(now);
      f.setDate(f.getDate() - 6);
      return { from: f, to };
    }
    case 'month': {
      const f = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: f, to };
    }
    case 'all':
    default:
      return { from: new Date(0), to };
  }
}

export interface DashboardStats {
  netRevenue: number;
  cogs: number;
  grossProfit: number;
  profitMargin: number;
  aov: number;
  paidOrderCount: number;
  pendingCount: number;
  cancelledCount: number;
  totalOrders: number;
  unitsSold: number;
  topProducts: { name: string; qty: number; revenue: number }[];
  categoryShare: { category: string; revenue: number; percent: number }[];
  hourly: { hour: number; count: number }[];
  repeatCustomerRate: number;
  uniqueCustomers: number;
  repeatCustomers: number;
}

/**
 * Strict financial rules from the spec:
 *  - Net Revenue = sum of total_amount ONLY from orders with payment_status 'PAID'.
 *  - COGS = sum of each item's cost_price × qty (paid orders).
 *  - Gross Profit = Net Revenue − COGS.
 *  - Profit Margin = (Gross Profit / Net Revenue) × 100.
 *  - AOV = Net Revenue / Count of Paid Orders.
 */
export function computeDashboard(
  orders: Order[],
  range: DateRange,
  categoryLookup: Record<string, ProductCategory> = {},
): DashboardStats {
  const categoryOf = (productId: string): string => {
    const cat = categoryLookup[productId];
    if (!cat) return 'Other';
    if (
      cat === 'JEWELLERY' ||
      cat === 'EARRINGS' ||
      cat === 'NECKLACES' ||
      cat === 'RINGS'
    ) {
      return 'Jewellery';
    }
    if (cat === 'BANGLES') return 'Bangles';
    return 'Home Decor';
  };

  const { from, to } = rangeBounds(range);
  const inRange = orders.filter((o) => {
    const t = new Date(o.created_at).getTime();
    return t >= from.getTime() && t <= to.getTime();
  });

  const paid = inRange.filter((o) => o.payment_status === 'PAID');
  const netRevenue = paid.reduce((n, o) => n + o.total_amount, 0);
  const cogs = paid.reduce(
    (n, o) => n + o.items.reduce((m, i) => m + i.cost_price * i.qty, 0),
    0,
  );
  const grossProfit = netRevenue - cogs;
  const profitMargin = netRevenue > 0 ? (grossProfit / netRevenue) * 100 : 0;
  const aov = paid.length > 0 ? netRevenue / paid.length : 0;

  const productMap = new Map<string, { name: string; qty: number; revenue: number }>();
  const categoryMap = new Map<string, number>();
  const phones = new Set<string>();
  const phoneCounts = new Map<string, number>();
  const hourly = Array.from({ length: 24 }, (_, hour) => ({ hour, count: 0 }));

  let unitsSold = 0;
  for (const o of paid) {
    const d = new Date(o.created_at);
    hourly[d.getHours()].count += 1;
    phones.add(o.customer_phone);
    phoneCounts.set(o.customer_phone, (phoneCounts.get(o.customer_phone) ?? 0) + 1);
    for (const it of o.items) {
      unitsSold += it.qty;
      const cur = productMap.get(it.product_id) ?? { name: it.name, qty: 0, revenue: 0 };
      cur.qty += it.qty;
      cur.revenue += it.total;
      productMap.set(it.product_id, cur);
      const cat = categoryOf(it.product_id);
      categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + it.total);
    }
  }

  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  const categoryTotal = Array.from(categoryMap.values()).reduce((n, v) => n + v, 0);
  const categoryShare = Array.from(categoryMap.entries())
    .map(([category, revenue]) => ({
      category,
      revenue,
      percent: categoryTotal > 0 ? (revenue / categoryTotal) * 100 : 0,
    }))
    .sort((a, b) => b.revenue - a.revenue);

  const repeatCustomers = Array.from(phoneCounts.values()).filter((c) => c > 1).length;
  const uniqueCustomers = phones.size;
  const repeatCustomerRate =
    uniqueCustomers > 0 ? (repeatCustomers / uniqueCustomers) * 100 : 0;

  return {
    netRevenue,
    cogs,
    grossProfit,
    profitMargin,
    aov,
    paidOrderCount: paid.length,
    pendingCount: inRange.filter((o) => o.status === 'PENDING_PAYMENT').length,
    cancelledCount: inRange.filter(
      (o) => o.status === 'CANCELLED' || o.status === 'RETURNED',
    ).length,
    totalOrders: inRange.length,
    unitsSold,
    topProducts,
    categoryShare,
    hourly,
    repeatCustomerRate,
    uniqueCustomers,
    repeatCustomers,
  };
}


