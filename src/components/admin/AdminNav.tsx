'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Receipt,
  Gem,
  FolderOpen,
  Sofa,
  Star,
  Percent,
  Settings,
  LogOut,
  ExternalLink,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logoutAdmin } from '@/app/admin/actions';

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/orders', label: 'Orders', icon: Receipt },
  { href: '/admin/inbox', label: 'Inbox', icon: Inbox },
  { href: '/admin/products', label: 'Products', icon: Gem },
  { href: '/admin/collections', label: 'Collections', icon: FolderOpen },
  { href: '/admin/home-decor', label: 'Home Decor', icon: Sofa },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/discounts', label: 'Discounts & Fees', icon: Percent },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-brand-champagne bg-brand-charcoal text-white lg:h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="px-6 py-5">
        <Link href="/admin" className="font-serif text-lg tracking-[0.2em]">
          ALLURE ADORN
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-widest text-brand-gold">
          Admin Portal
        </p>
      </div>
      <nav className="flex flex-1 flex-row gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:px-3">
        {NAV.map((item) => {
          const active =
            item.href === '/admin'
              ? pathname === '/admin'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex shrink-0 items-center gap-3 px-3 py-2.5 text-sm transition',
                active
                  ? 'bg-brand-burgundy text-white'
                  : 'text-white/70 hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="whitespace-nowrap">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden border-t border-white/10 p-3 lg:block">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white"
        >
          <ExternalLink className="h-4 w-4" /> View Store
        </Link>
        <form action={logoutAdmin}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm text-white/60 hover:text-white"
          >
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </form>
      </div>
    </aside>
  );
}
