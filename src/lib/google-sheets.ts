import { Order, Product, ContactMessage, Subscriber } from '@/types';

export interface SheetCreationResult {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

export const SHEETS_TABS = {
  ORDERS: 'Orders',
  INVENTORY: 'Products & Inventory',
  INQUIRIES: 'Inquiries & Subscribers',
};

/**
 * Creates a brand-new Google Spreadsheet with 3 curated tabs and styling.
 */
export async function createStoreSpreadsheet(
  accessToken: string,
  title = 'Allure Adorn — Orders & Boutique Ledger',
): Promise<SheetCreationResult> {
  const payload = {
    properties: {
      title,
      locale: 'en_IN',
      timeZone: 'Asia/Kolkata',
    },
    sheets: [
      {
        properties: {
          title: SHEETS_TABS.ORDERS,
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: SHEETS_TABS.INVENTORY,
          gridProperties: { frozenRowCount: 1 },
        },
      },
      {
        properties: {
          title: SHEETS_TABS.INQUIRIES,
          gridProperties: { frozenRowCount: 1 },
        },
      },
    ],
  };

  const res = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to create Google Spreadsheet: ${err}`);
  }

  const data = await res.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
}

/**
 * Validates access to an existing Google Spreadsheet.
 */
export async function verifySpreadsheet(
  accessToken: string,
  spreadsheetId: string,
): Promise<{ title: string; sheets: string[] }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=properties.title,sheets.properties.title`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Could not access spreadsheet (${res.status}): ${err}`);
  }

  const data = await res.json();
  const sheets = (data.sheets || []).map(
    (s: { properties?: { title?: string } }) => s.properties?.title || '',
  );

  return {
    title: data.properties?.title || 'Google Sheet',
    sheets,
  };
}

/**
 * Extracts raw spreadsheet ID from full URL or returns ID as-is.
 */
export function extractSpreadsheetId(urlOrId: string): string {
  const trimmed = urlOrId.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

/**
 * Formats and updates the Orders sheet with latest orders.
 */
export async function syncOrdersToSheet(
  accessToken: string,
  spreadsheetId: string,
  orders: Order[],
): Promise<{ rowsUpdated: number }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const tabName = SHEETS_TABS.ORDERS;

  const headers = [
    'Order #',
    'Date Placed (IST)',
    'Status',
    'Payment Status',
    'Payment Method',
    'Customer Name',
    'Phone',
    'Email',
    'Items Summary',
    'Subtotal (₹)',
    'Discount (₹)',
    'Shipping Fee (₹)',
    'Total Amount (₹)',
    'Estimated Profit (₹)',
    'Courier',
    'Tracking Number',
    'Delivery Address',
    'Customer Notes',
    'Admin Notes',
  ];

  const rows = orders.map((o) => {
    const itemsSummary = o.items
      .map((it) => `${it.name} (Qty: ${it.qty}, Price: ₹${it.price})`)
      .join(' | ');

    const address = [
      o.shipping_address?.line1,
      o.shipping_address?.line2,
      o.shipping_address?.city,
      o.shipping_address?.state,
      o.shipping_address?.pincode,
      o.shipping_address?.country,
    ]
      .filter(Boolean)
      .join(', ');

    const dateStr = new Date(o.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    const estProfit = (o.total_amount || 0) - (o.total_cost || 0);

    return [
      o.order_number,
      dateStr,
      o.status,
      o.payment_status,
      o.payment_method,
      o.customer_name,
      o.customer_phone,
      o.customer_email || '',
      itemsSummary,
      o.subtotal,
      o.discount_amount,
      o.shipping_fee,
      o.total_amount,
      estProfit,
      o.courier || '',
      o.tracking_number || '',
      address,
      o.notes || '',
      o.admin_notes || '',
    ];
  });

  const values = [headers, ...rows];

  // First clear the sheet to avoid leftover rows
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1:Z5000:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  // Then write new values
  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    },
  );

  if (!writeRes.ok) {
    const err = await writeRes.text();
    throw new Error(`Failed to update Orders in Google Sheet: ${err}`);
  }

  return { rowsUpdated: rows.length };
}

/**
 * Formats and updates the Products & Inventory sheet.
 */
export async function syncInventoryToSheet(
  accessToken: string,
  spreadsheetId: string,
  products: Product[],
): Promise<{ rowsUpdated: number }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const tabName = SHEETS_TABS.INVENTORY;

  const headers = [
    'Product ID',
    'Product Name',
    'Category',
    'Sub Category',
    'Price (₹)',
    'Compare Price (₹)',
    'Cost Price (₹)',
    'Stock Count',
    'Anti-Tarnish',
    'New Arrival',
    'Bestseller',
    'Active in Store',
    'Material / Finish',
    'Short Description',
  ];

  const rows = products.map((p) => [
    p.id,
    p.name,
    p.category,
    p.sub_category || '',
    p.price,
    p.compare_at_price || '',
    p.cost_price,
    p.stock,
    p.is_anti_tarnish ? 'Yes' : 'No',
    p.is_new_arrival ? 'Yes' : 'No',
    p.is_bestseller ? 'Yes' : 'No',
    p.is_active ? 'Yes' : 'Hidden',
    [p.material, p.finish].filter(Boolean).join(', '),
    p.description_short,
  ]);

  const values = [headers, ...rows];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1:Z5000:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    },
  );

  if (!writeRes.ok) {
    const err = await writeRes.text();
    throw new Error(`Failed to update Inventory in Google Sheet: ${err}`);
  }

  return { rowsUpdated: rows.length };
}

/**
 * Formats and updates the Inquiries & Newsletter sheet.
 */
export async function syncInquiriesToSheet(
  accessToken: string,
  spreadsheetId: string,
  messages: ContactMessage[],
  subscribers: Subscriber[],
): Promise<{ rowsUpdated: number }> {
  const cleanId = extractSpreadsheetId(spreadsheetId);
  const tabName = SHEETS_TABS.INQUIRIES;

  const headers = [
    'Type',
    'Date (IST)',
    'Name',
    'Email',
    'Phone',
    'Details / Message',
    'Status',
  ];

  const messageRows = messages.map((m) => [
    'Contact Inquiry',
    new Date(m.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    m.name,
    m.email || '',
    m.phone || '',
    m.message,
    m.is_handled ? 'Handled' : 'Pending',
  ]);

  const subscriberRows = subscribers.map((s) => [
    'Newsletter Subscriber',
    new Date(s.created_at).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    }),
    'Newsletter Member',
    s.email,
    '',
    `Source: ${s.source}`,
    'Subscribed',
  ]);

  const values = [headers, ...messageRows, ...subscriberRows];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1:Z5000:clear`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    },
  );

  const writeRes = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(
      tabName,
    )}!A1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ values }),
    },
  );

  if (!writeRes.ok) {
    const err = await writeRes.text();
    throw new Error(`Failed to update Inquiries in Google Sheet: ${err}`);
  }

  return { rowsUpdated: messageRows.length + subscriberRows.length };
}
