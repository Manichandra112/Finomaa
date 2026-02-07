import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Finomaa — Loan Pricing & Eligibility",
  description: "Explore transparent loan pricing tiers and check your eligibility with real-time calculations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-foreground">
        {children}
      </body>
    </html>
  );
}
