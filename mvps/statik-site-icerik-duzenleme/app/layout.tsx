import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rötuş — statik sitede tıkla, düzenle, commit'le",
  description: "Düz HTML sitelerde başlık, paragraf ve görselleri yapılandırma olmadan düzenleyin; dosyayı indirin ya da GitHub'a commit'leyin.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
