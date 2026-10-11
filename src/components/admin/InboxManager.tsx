'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Phone, Trash2, Check, RotateCcw, Copy } from 'lucide-react';
import { ContactMessage, Subscriber } from '@/types';
import { cn } from '@/lib/utils';

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function InboxManager({
  messages,
  subscribers,
}: {
  messages: ContactMessage[];
  subscribers: Subscriber[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<'messages' | 'subscribers'>('messages');
  const [busy, setBusy] = useState(false);

  const unread = messages.filter((m) => !m.is_handled).length;

  const act = async (id: string, body: Record<string, unknown>) => {
    setBusy(true);
    try {
      await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeMessage = async (id: string) => {
    if (!window.confirm('Delete this message?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const removeSubscriber = async (id: string) => {
    if (!window.confirm('Remove this subscriber?')) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/subscribers/${id}`, { method: 'DELETE' });
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  const copyAllSubscribers = async () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    try {
      await navigator.clipboard.writeText(emails);
    } catch {
      // clipboard may be unavailable; ignore
    }
  };

  return (
    <>
      <div className="mb-5 flex flex-wrap gap-2">
        {([
          ['messages', `Messages (${messages.length})`],
          ['subscribers', `Subscribers (${subscribers.length})`],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              'border px-3 py-1.5 text-xs tracking-widest transition',
              tab === key
                ? 'border-brand-burgundy bg-brand-burgundy text-white'
                : 'border-brand-champagne hover:border-brand-gold',
            )}
          >
            {label.toUpperCase()}
          </button>
        ))}
      </div>

      {tab === 'messages' ? (
        messages.length === 0 ? (
          <p className="py-16 text-center text-sm text-brand-charcoal/45">
            No messages yet. Enquiries from the storefront contact form will appear here.
          </p>
        ) : (
          <>
            {unread > 0 && (
              <p className="mb-4 text-xs tracking-widest text-brand-burgundy">
                {unread} NEW {unread === 1 ? 'MESSAGE' : 'MESSAGES'}
              </p>
            )}
            <ul className="space-y-3">
              {messages.map((m) => (
                <li
                  key={m.id}
                  className={cn(
                    'border bg-white/60 p-5',
                    m.is_handled ? 'border-brand-champagne' : 'border-brand-gold',
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-serif text-lg text-brand-charcoal">{m.name}</p>
                      <p className="mt-0.5 flex flex-wrap items-center gap-3 text-xs text-brand-charcoal/55">
                        {m.email ? (
                          <span className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            <a href={`mailto:${m.email}`} className="underline hover:text-brand-burgundy">
                              {m.email}
                            </a>
                          </span>
                        ) : null}
                        {m.phone ? (
                          <span className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            <a href={`tel:${m.phone}`} className="underline hover:text-brand-burgundy">
                              {m.phone}
                            </a>
                          </span>
                        ) : null}
                        <span>{formatDateTime(m.created_at)}</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        disabled={busy}
                        onClick={() => act(m.id, { is_handled: !m.is_handled })}
                        className="flex items-center gap-1.5 border border-brand-champagne px-3 py-1.5 text-[11px] tracking-widest text-brand-charcoal/70 transition hover:border-brand-gold disabled:opacity-50"
                      >
                        {m.is_handled ? (
                          <>
                            <RotateCcw className="h-3.5 w-3.5" /> UNREAD
                          </>
                        ) : (
                          <>
                            <Check className="h-3.5 w-3.5" /> MARK HANDLED
                          </>
                        )}
                      </button>
                      <button
                        disabled={busy}
                        onClick={() => removeMessage(m.id)}
                        className="border border-brand-champagne p-1.5 text-brand-charcoal/50 transition hover:border-brand-burgundy hover:text-brand-burgundy disabled:opacity-50"
                        aria-label="Delete message"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm text-brand-charcoal/75">
                    {m.message}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )
      ) : subscribers.length === 0 ? (
        <p className="py-16 text-center text-sm text-brand-charcoal/45">
          No subscribers yet. Sign-ups from the newsletter will appear here.
        </p>
      ) : (
        <>
          <div className="mb-4 flex justify-end">
            <button
              onClick={copyAllSubscribers}
              className="flex items-center gap-1.5 border border-brand-champagne px-3 py-1.5 text-[11px] tracking-widest text-brand-charcoal/70 transition hover:border-brand-gold"
            >
              <Copy className="h-3.5 w-3.5" /> COPY ALL EMAILS
            </button>
          </div>
          <ul className="divide-y divide-brand-champagne border border-brand-champagne bg-white/60">
            {subscribers.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                <div>
                  <p className="text-sm text-brand-charcoal">{s.email}</p>
                  <p className="text-xs text-brand-charcoal/45">
                    {s.source} · {formatDateTime(s.created_at)}
                  </p>
                </div>
                <button
                  disabled={busy}
                  onClick={() => removeSubscriber(s.id)}
                  className="border border-brand-champagne p-1.5 text-brand-charcoal/50 transition hover:border-brand-burgundy hover:text-brand-burgundy disabled:opacity-50"
                  aria-label="Remove subscriber"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
