import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Move-Out Ledger — security deposit deadlines & itemized statements",
  description:
    "Track each state's security deposit return deadline, itemize deductions and print a statement for your tenant.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
