import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Track Your Order | Allure Adorn',
  description: 'Follow the status of your Allure Adorn order.',
  robots: { index: false, follow: false },
};

export default function TrackLayout({ children }: { children: React.ReactNode }) {
  return children;
}
