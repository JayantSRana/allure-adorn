import AdminGate from '@/components/admin/AdminGate';
import AdminNav from '@/components/admin/AdminNav';
import { isAdminAuthed } from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin | Allure Adorn',
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isAdminAuthed()) {
    return <AdminGate />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-brand-ivory lg:flex-row">
      <AdminNav />
      <main className="flex-1 overflow-x-hidden p-5 sm:p-8">{children}</main>
    </div>
  );
}
