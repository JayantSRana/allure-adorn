'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  initAuth,
  googleSignIn,
  getAccessToken,
  logoutGoogle,
} from '@/lib/google-auth';
import { User } from 'firebase/auth';
import {
  FileSpreadsheet,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  Plus,
  Link as LinkIcon,
  AlertCircle,
  Unlink,
  LogOut,
  ShoppingBag,
  Gem,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { Card } from '@/components/admin/ui';
import { formatDateTime } from '@/lib/format';

interface SheetsStatus {
  spreadsheet_id: string | null;
  spreadsheet_name: string | null;
  last_synced: string | null;
  orders_count: number;
  products_count: number;
  messages_count: number;
  subscribers_count: number;
  webhook_url: string | null;
}

interface PendingSync {
  scope: 'all' | 'orders' | 'inventory' | 'inquiries';
  title: string;
  description: string;
  affectedCount: number;
}

export default function GoogleSheetsManager() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginBusy, setLoginBusy] = useState(false);

  const [status, setStatus] = useState<SheetsStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [actionBusy, setActionBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Link existing sheet input
  const [linkInput, setLinkInput] = useState('');
  const [showLinkForm, setShowLinkForm] = useState(false);

  // User confirmation dialog state (Mandatory for Workspace mutations)
  const [pendingConfirm, setPendingConfirm] = useState<PendingSync | null>(null);

  const fetchStatus = useCallback(async () => {
    setStatusLoading(true);
    try {
      const res = await fetch('/api/admin/sheets');
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch {
      // ignore
    } finally {
      setStatusLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();

    const unsubscribe = initAuth(
      (currentUser, currentToken) => {
        setUser(currentUser);
        setToken(currentToken);
        setAuthLoading(false);
      },
      () => {
        setUser(null);
        setToken(null);
        setAuthLoading(false);
      },
    );

    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, [fetchStatus]);

  const handleSignIn = async () => {
    setLoginBusy(true);
    setErrorMsg(null);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setToken(res.accessToken);
        setSuccessMsg(`Signed in as ${res.user.email}`);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(`Sign-in failed: ${msg}`);
    } finally {
      setLoginBusy(false);
    }
  };

  const handleSignOut = async () => {
    await logoutGoogle();
    setUser(null);
    setToken(null);
    setSuccessMsg('Signed out of Google');
  };

  const handleCreateNewSheet = async () => {
    if (!token) {
      setErrorMsg('Please sign in with Google first');
      return;
    }
    setActionBusy(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'create' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create sheet');
      setSuccessMsg(`Google Sheet created and initialized: "${data.spreadsheet_name}"`);
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setActionBusy(false);
    }
  };

  const handleLinkSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('Please sign in with Google first');
      return;
    }
    if (!linkInput.trim()) return;

    setActionBusy(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch('/api/admin/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'link', spreadsheet_id: linkInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to link sheet');
      setSuccessMsg(`Linked to "${data.spreadsheet_name}"`);
      setLinkInput('');
      setShowLinkForm(false);
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setActionBusy(false);
    }
  };

  const handleUnlink = async () => {
    if (!window.confirm('Disconnect this Google Sheet from the boutique? The spreadsheet in your Google Drive will not be deleted.')) {
      return;
    }
    setActionBusy(true);
    try {
      await fetch('/api/admin/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unlink' }),
      });
      setSuccessMsg('Google Sheet disconnected');
      await fetchStatus();
    } finally {
      setActionBusy(false);
    }
  };

  const executeConfirmedSync = async () => {
    if (!pendingConfirm) return;
    const currentToken = token || (await getAccessToken());
    if (!currentToken) {
      setErrorMsg('Please sign in with Google to perform sync.');
      setPendingConfirm(null);
      return;
    }

    const targetScope = pendingConfirm.scope;
    setPendingConfirm(null);
    setActionBusy(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/admin/sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentToken}`,
        },
        body: JSON.stringify({
          action: 'sync',
          scope: targetScope,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      const parts: string[] = [];
      if (data.results?.orders !== undefined) parts.push(`${data.results.orders} orders`);
      if (data.results?.inventory !== undefined) parts.push(`${data.results.inventory} inventory items`);
      if (data.results?.inquiries !== undefined) parts.push(`${data.results.inquiries} inquiries & subscribers`);

      setSuccessMsg(`Synchronized successfully to Google Sheets (${parts.join(', ')})!`);
      await fetchStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setErrorMsg(msg);
    } finally {
      setActionBusy(false);
    }
  };

  const spreadsheetUrl = status?.spreadsheet_id
    ? `https://docs.google.com/spreadsheets/d/${status.spreadsheet_id}/edit`
    : null;

  return (
    <div className="space-y-6">
      {/* Messages */}
      {errorMsg && (
        <div className="flex items-center gap-3 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <p className="flex-1">{errorMsg}</p>
          <button onClick={() => setErrorMsg(null)} className="text-xs uppercase tracking-wider font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <p className="flex-1">{successMsg}</p>
          <button onClick={() => setSuccessMsg(null)} className="text-xs uppercase tracking-wider font-semibold">
            Dismiss
          </button>
        </div>
      )}

      {/* Step 1: Google Account Connection */}
      <Card>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-semibold text-brand-burgundy">
                1
              </span>
              <h2 className="font-serif text-xl">Google Workspace Account</h2>
            </div>
            <p className="mt-1 text-xs text-brand-charcoal/65">
              Connect your Google account to grant permission to sync orders and inventory into Google Sheets.
            </p>
          </div>

          <div>
            {authLoading ? (
              <span className="text-xs text-brand-charcoal/50">Checking connection…</span>
            ) : user ? (
              <div className="flex items-center gap-3 border border-brand-champagne bg-brand-ivory px-3 py-2 text-xs">
                {user.photoURL ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Google User'}
                    className="h-6 w-6 rounded-full"
                  />
                ) : (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-burgundy text-[11px] text-white">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                )}
                <div>
                  <p className="font-medium text-brand-charcoal">{user.displayName || 'Connected User'}</p>
                  <p className="text-[11px] text-brand-charcoal/60">{user.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  title="Sign out of Google"
                  className="ml-2 p-1 text-brand-charcoal/50 hover:text-brand-burgundy"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={loginBusy}
                className="inline-flex items-center gap-3 rounded border border-gray-300 bg-white px-4 py-2 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-60"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>{loginBusy ? 'Signing in…' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Step 2: Spreadsheet Connection */}
      <Card>
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-semibold text-brand-burgundy">
            2
          </span>
          <h2 className="font-serif text-xl">Target Spreadsheet</h2>
        </div>
        <p className="mt-1 text-xs text-brand-charcoal/65">
          Choose where orders, products, and customer inquiries should be mirrored.
        </p>

        {statusLoading ? (
          <div className="py-6 text-center text-xs text-brand-charcoal/50">Loading spreadsheet status…</div>
        ) : status?.spreadsheet_id ? (
          <div className="mt-4 border border-brand-champagne bg-brand-champagne/15 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-3">
                <FileSpreadsheet className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" />
                <div>
                  <h3 className="font-serif text-lg font-medium text-brand-charcoal">
                    {status.spreadsheet_name || 'Allure Adorn Store Ledger'}
                  </h3>
                  <p className="font-mono text-[11px] text-brand-charcoal/60">ID: {status.spreadsheet_id}</p>
                  {status.last_synced ? (
                    <p className="mt-1 text-xs text-brand-charcoal/60">
                      Last synchronized: <span className="font-medium">{formatDateTime(status.last_synced)}</span>
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-amber-700">Not synchronized yet</p>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {spreadsheetUrl && (
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border border-brand-burgundy bg-brand-burgundy px-3.5 py-2 text-xs uppercase tracking-widest text-white transition hover:bg-brand-charcoal"
                  >
                    Open Sheet <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
                <button
                  onClick={handleUnlink}
                  disabled={actionBusy}
                  className="inline-flex items-center gap-1.5 border border-brand-champagne px-3 py-2 text-xs uppercase tracking-widest text-brand-charcoal hover:border-red-400 hover:text-red-700 disabled:opacity-50"
                >
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="border border-dashed border-brand-champagne p-5 text-center hover:border-brand-gold">
                <FileSpreadsheet className="mx-auto h-8 w-8 text-brand-gold" />
                <h3 className="mt-2 font-serif text-lg font-medium">Create New Dedicated Sheet</h3>
                <p className="mt-1 text-xs text-brand-charcoal/65">
                  Generates a formatted Google Sheet with Orders, Products &amp; Inventory, and Inquiries tabs automatically.
                </p>
                <button
                  onClick={handleCreateNewSheet}
                  disabled={actionBusy || !user}
                  className="mt-4 inline-flex items-center gap-2 bg-brand-burgundy px-4 py-2.5 text-xs uppercase tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
                >
                  <Plus className="h-3.5 w-3.5" /> {actionBusy ? 'Creating Sheet…' : 'Create & Link Sheet'}
                </button>
                {!user && (
                  <p className="mt-2 text-[11px] text-amber-700">Sign in with Google above first</p>
                )}
              </div>

              <div className="border border-dashed border-brand-champagne p-5 text-center hover:border-brand-gold">
                <LinkIcon className="mx-auto h-8 w-8 text-brand-charcoal/50" />
                <h3 className="mt-2 font-serif text-lg font-medium">Link Existing Google Sheet</h3>
                <p className="mt-1 text-xs text-brand-charcoal/65">
                  Already have an inventory or orders spreadsheet? Paste its URL or ID to connect.
                </p>
                <button
                  onClick={() => setShowLinkForm(!showLinkForm)}
                  className="mt-4 inline-flex items-center gap-2 border border-brand-champagne px-4 py-2.5 text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-burgundy"
                >
                  <LinkIcon className="h-3.5 w-3.5" /> {showLinkForm ? 'Hide Form' : 'Enter Sheet ID'}
                </button>
              </div>
            </div>

            {showLinkForm && (
              <form onSubmit={handleLinkSheet} className="border border-brand-champagne bg-white p-4">
                <label className="block text-xs font-medium uppercase tracking-wider text-brand-charcoal/70">
                  Google Sheet URL or Spreadsheet ID:
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                    className="flex-1 border border-brand-champagne px-3 py-2 text-sm outline-none focus:border-brand-burgundy"
                  />
                  <button
                    type="submit"
                    disabled={actionBusy || !linkInput.trim() || !user}
                    className="bg-brand-burgundy px-6 py-2 text-xs uppercase tracking-widest text-white hover:bg-brand-charcoal disabled:opacity-50"
                  >
                    {actionBusy ? 'Verifying…' : 'Link Spreadsheet'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </Card>

      {/* Step 3: Synchronization Controls */}
      {status?.spreadsheet_id && (
        <Card>
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-gold/20 text-xs font-semibold text-brand-burgundy">
                  3
                </span>
                <h2 className="font-serif text-xl">Synchronize Data</h2>
              </div>
              <p className="mt-1 text-xs text-brand-charcoal/65">
                Update spreadsheet records from your boutique. All changes are formatted into clear columns.
              </p>
            </div>

            <button
              onClick={() =>
                setPendingConfirm({
                  scope: 'all',
                  title: 'Full Synchronization',
                  description:
                    'This will update the Orders, Products & Inventory, and Inquiries tabs in your connected Google Sheet with all records.',
                  affectedCount:
                    (status?.orders_count || 0) +
                    (status?.products_count || 0) +
                    (status?.messages_count || 0) +
                    (status?.subscribers_count || 0),
                })
              }
              disabled={actionBusy || !user}
              className="inline-flex items-center gap-2 bg-brand-burgundy px-5 py-3 text-xs uppercase tracking-widest text-white shadow transition hover:bg-brand-charcoal disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${actionBusy ? 'animate-spin' : ''}`} />
              {actionBusy ? 'Synchronizing…' : 'Sync Everything Now'}
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {/* Orders Tab Card */}
            <div className="border border-brand-champagne bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-burgundy">
                  <ShoppingBag className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Orders Ledger</span>
                </div>
                <span className="rounded bg-brand-champagne/40 px-2 py-0.5 text-xs font-medium">
                  {status.orders_count} orders
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-charcoal/65">
                Tab: <code className="bg-brand-champagne/30 px-1 py-0.5">Orders</code>
                <br />
                Columns: Order #, Status, Customer, Items, Financials, Courier &amp; Tracking.
              </p>
              <button
                onClick={() =>
                  setPendingConfirm({
                    scope: 'orders',
                    title: 'Sync Orders Ledger',
                    description: `This will update the Orders tab in your Google Sheet with all ${status.orders_count} orders currently in your store.`,
                    affectedCount: status.orders_count,
                  })
                }
                disabled={actionBusy || !user}
                className="mt-4 w-full border border-brand-champagne py-2 text-center text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-burgundy disabled:opacity-50"
              >
                Sync Orders ({status.orders_count})
              </button>
            </div>

            {/* Inventory Tab Card */}
            <div className="border border-brand-champagne bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-gold">
                  <Gem className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Catalogue &amp; Stock</span>
                </div>
                <span className="rounded bg-brand-champagne/40 px-2 py-0.5 text-xs font-medium">
                  {status.products_count} products
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-charcoal/65">
                Tab: <code className="bg-brand-champagne/30 px-1 py-0.5">Products &amp; Inventory</code>
                <br />
                Columns: SKU, Name, Category, Price, Cost Price, Stock, Anti-Tarnish.
              </p>
              <button
                onClick={() =>
                  setPendingConfirm({
                    scope: 'inventory',
                    title: 'Sync Catalogue & Stock',
                    description: `This will update the Products & Inventory tab with all ${status.products_count} pieces and current stock counts.`,
                    affectedCount: status.products_count,
                  })
                }
                disabled={actionBusy || !user}
                className="mt-4 w-full border border-brand-champagne py-2 text-center text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-gold disabled:opacity-50"
              >
                Sync Inventory ({status.products_count})
              </button>
            </div>

            {/* Inquiries Tab Card */}
            <div className="border border-brand-champagne bg-white/70 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-brand-charcoal">
                  <Mail className="h-4 w-4" />
                  <span className="text-xs uppercase tracking-wider font-semibold">Inquiries &amp; Leads</span>
                </div>
                <span className="rounded bg-brand-champagne/40 px-2 py-0.5 text-xs font-medium">
                  {status.messages_count + status.subscribers_count} records
                </span>
              </div>
              <p className="mt-2 text-xs text-brand-charcoal/65">
                Tab: <code className="bg-brand-champagne/30 px-1 py-0.5">Inquiries &amp; Subscribers</code>
                <br />
                Columns: Type, Date, Customer Name, Email, Phone, Message, Status.
              </p>
              <button
                onClick={() =>
                  setPendingConfirm({
                    scope: 'inquiries',
                    title: 'Sync Inquiries & Subscribers',
                    description: `This will update the Inquiries tab with ${status.messages_count} contact inquiries and ${status.subscribers_count} newsletter members.`,
                    affectedCount: status.messages_count + status.subscribers_count,
                  })
                }
                disabled={actionBusy || !user}
                className="mt-4 w-full border border-brand-champagne py-2 text-center text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-burgundy disabled:opacity-50"
              >
                Sync Inquiries ({status.messages_count + status.subscribers_count})
              </button>
            </div>
          </div>
        </Card>
      )}

      {/* Security & Architecture Card */}
      <Card>
        <div className="flex items-start gap-3 text-xs text-brand-charcoal/75">
          <ShieldCheck className="h-5 w-5 shrink-0 text-brand-gold" />
          <div className="space-y-1">
            <h3 className="font-medium text-brand-charcoal">Google Workspace Security &amp; Least Privilege</h3>
            <p>
              This integration connects via Google OAuth with scoped permissions (<code>spreadsheets</code> and <code>drive.file</code>),
              meaning it can only view and edit spreadsheets created by or explicitly shared with this application.
              Your tokens are held strictly in temporary browser memory and are never persisted to insecure storage.
            </p>
          </div>
        </div>
      </Card>

      {/* Mandatory User Confirmation Dialog */}
      {pendingConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-brand-charcoal/50 p-4">
          <div className="w-full max-w-md border border-brand-champagne bg-brand-ivory p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-brand-burgundy">
              <FileSpreadsheet className="h-6 w-6 text-brand-gold" />
              <h3 className="font-serif text-2xl font-light text-brand-charcoal">Confirm Spreadsheet Sync</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-brand-charcoal/80">
              {pendingConfirm.description}
            </p>
            <div className="mt-4 border-l-2 border-brand-gold bg-brand-champagne/20 p-3 text-xs text-brand-charcoal/70">
              Target: <strong>{status?.spreadsheet_name || 'Allure Adorn Store Ledger'}</strong>
              <br />
              Records affected: <strong>{pendingConfirm.affectedCount}</strong>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingConfirm(null)}
                className="border border-brand-champagne px-4 py-2 text-xs uppercase tracking-widest text-brand-charcoal hover:border-brand-charcoal"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeConfirmedSync}
                className="bg-brand-burgundy px-5 py-2 text-xs uppercase tracking-widest text-white hover:bg-brand-charcoal"
              >
                Confirm &amp; Synchronize
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
