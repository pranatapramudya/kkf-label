import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PenyediaKeranjang } from "@/context/CartContext";
import { ClerkProvider } from "@clerk/nextjs";
import SafeAreaProvider from "@/components/SafeAreaProvider";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"),
  title: "kkf-label | Fashion Wanita Minimalis",
  description:
    "Butik fashion wanita modern dengan nuansa soft pink dan minimalist white.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KKF Label",
  },
  icons: {
    apple: "/icon-192x192.png",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ff0080',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/sign-in">
      <html lang="id" suppressHydrationWarning>
        <body className="font-sans antialiased bg-zinc-900" suppressHydrationWarning>
          <div className="bg-white min-h-screen pt-[var(--safe-area-inset-top,env(safe-area-inset-top))] pb-[env(safe-area-inset-bottom)]">
            <PenyediaKeranjang>
              <SafeAreaProvider>
                {children}
              </SafeAreaProvider>
            </PenyediaKeranjang>
          </div>
          <Analytics />
          <SpeedInsights />
        </body>
      </html>
    </ClerkProvider>
  );
}

