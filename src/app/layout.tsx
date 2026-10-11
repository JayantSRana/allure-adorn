import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "500", "600", "700"],
});

const sans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ),
  title: "Allure Adorn | Luxury Jewellery & Home Decor",
  description:
    "Adornment, made to be remembered. Timeless jewellery and home decor, crafted with quiet luxury.",
  applicationName: "Allure Adorn",
  keywords: [
    "Allure Adorn",
    "luxury jewellery",
    "anti-tarnish jewellery",
    "bangles",
    "home decor",
    "gift jewellery",
  ],
  openGraph: {
    type: "website",
    siteName: "Allure Adorn",
    title: "Allure Adorn | Luxury Jewellery & Home Decor",
    description:
      "Adornment, made to be remembered. Timeless jewellery and home decor, crafted with quiet luxury.",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Allure Adorn | Luxury Jewellery & Home Decor",
    description:
      "Adornment, made to be remembered. Timeless jewellery and home decor, crafted with quiet luxury.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
