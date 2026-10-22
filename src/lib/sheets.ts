import { Order } from '@/types';

export async function syncOrderToGoogleSheets(
  order: Order,
  webhookUrl?: string,
): Promise<void> {
  const url =
    webhookUrl ||
    process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!url || !url.startsWith('http')) {
    return;
  }

  try {
    const itemsSummary = order.items
      .map((i) => `${i.name} (Qty: ${i.qty}, Size: ${i.slug || 'std'}) - ₹${i.total}`)
      .join(' | ');

    const address = [
      order.shipping_address.line1,
      order.shipping_address.line2,
      order.shipping_address.city,
      order.shipping_address.state,
      order.shipping_address.pincode,
      order.shipping_address.country,
    ]
      .filter(Boolean)
      .join(', ');

    const payload = {
      order_number: order.order_number,
      created_at: new Date(order.created_at).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
      }),
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      customer_email: order.customer_email || '',
      items: itemsSummary,
      subtotal: order.subtotal,
      discount_amount: order.discount_amount,
      discount_code: order.discount_code || '',
      shipping_fee: order.shipping_fee,
      total_amount: order.total_amount,
      payment_method: order.payment_method,
      payment_status: order.payment_status,
      order_status: order.status,
      shipping_address: address,
      notes: order.notes || '',
    };

    // Google Apps Script expects redirect follow and accepts JSON
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    // Non-blocking background sync
    console.error('Failed to sync order to Google Sheets:', err);
  }
}
