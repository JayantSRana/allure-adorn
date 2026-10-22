import { AdminPageHeader } from '@/components/admin/ui';
import GoogleSheetsManager from '@/components/admin/GoogleSheetsManager';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Google Sheets Integration | Allure Adorn Admin',
};

export default function AdminSheetsPage() {
  return (
    <div>
      <AdminPageHeader
        title="Google Sheets Sync"
        subtitle="Mirror boutique orders, inventory counts, and customer inquiries directly to Google Drive spreadsheets."
      />
      <GoogleSheetsManager />
    </div>
  );
}
