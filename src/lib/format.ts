export function formatINR(amount: number): string {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function discountPercent(price: number, compareAt?: number): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const CATEGORY_LABELS: Record<string, string> = {
  JEWELLERY: 'Jewellery',
  BANGLES: 'Bangles',
  EARRINGS: 'Earrings',
  NECKLACES: 'Necklaces',
  RINGS: 'Rings',
  HOME_DECOR: 'Home Decor',
  CANDLES: 'Candles',
  VASES: 'Vases',
  WALL_ART: 'Wall Art',
  TABLESCAPE: 'Tablescape',
};

export const ORDER_STATUS_STEPS = [
  'PENDING_PAYMENT',
  'PAID',
  'PACKED',
  'SHIPPED',
  'DELIVERED',
] as const;

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING_PAYMENT: 'Awaiting Payment',
  PAID: 'Confirmed',
  PACKED: 'Packed',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
  RETURNED: 'Returned',
};

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatDateTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}
