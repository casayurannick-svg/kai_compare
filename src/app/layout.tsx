import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "KaiCompare Auckland — Grocery Price Comparison",
  description:
    "Compare staple grocery prices across PAK'nSAVE, Woolworths, New World, and The Warehouse in Auckland, New Zealand. Find the cheapest basket and smart split savings.",
  keywords: ["grocery prices", "Auckland", "supermarket comparison", "New Zealand", "PAK'nSAVE", "Woolworths", "New World"],
  openGraph: {
    title: "KaiCompare Auckland",
    description: "Compare Auckland grocery prices & save money on your weekly shop.",
    locale: "en_NZ",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NZ" className={geist.variable}>
      <body className="antialiased bg-slate-50 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}
