"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FloatingCSButton } from "@/components/FloatingCSButton";
import { FCMProvider } from "@/components/FCMProvider";
import { PwaPromptProvider } from "@/components/pwa/PwaPromptProvider";
import { InstallDrawer } from "@/components/pwa/InstallDrawer";
import { NotificationDrawer } from "@/components/pwa/NotificationDrawer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isRekomendasi = pathname?.startsWith("/rekomendasi");
  const hideFooter = pathname?.startsWith("/checkout") || pathname?.startsWith("/pembayaran") || pathname === "/katalog" || isRekomendasi;

  return (
    <PwaPromptProvider>
      <Navbar />
      <main className={`min-h-screen ${isRekomendasi ? "" : "pt-20"}`}>{children}</main>
      {!hideFooter && <Footer />}
      <FCMProvider />
      {!isRekomendasi && <FloatingCSButton />}
      <InstallDrawer />
      <NotificationDrawer />
    </PwaPromptProvider>
  );
}

