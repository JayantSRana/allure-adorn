import { AdminPageHeader } from '@/components/admin/ui';
import InboxManager from '@/components/admin/InboxManager';
import { ensureDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Inbox | Allure Adorn Admin' };

export default async function AdminInboxPage() {
  const db = await ensureDatabase();
  return (
    <div>
      <AdminPageHeader
        title="Inbox"
        subtitle="Customer enquiries from the contact form and newsletter sign-ups."
      />
      <InboxManager messages={db.messages} subscribers={db.subscribers} />
    </div>
  );
}
