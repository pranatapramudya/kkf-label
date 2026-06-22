import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PenyediaKeranjang } from "@/context/CartContext";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "kkf-label | Fashion Wanita Minimalis",
  description:
    "Butik fashion wanita modern dengan nuansa soft pink dan minimalist white.",
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#18181b', // zinc-900 hex
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="id" suppressHydrationWarning>
        <body className="font-sans antialiased bg-zinc-900" suppressHydrationWarning>
          <div className="bg-white min-h-screen pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
            <PenyediaKeranjang>
              {children}
            </PenyediaKeranjang>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
