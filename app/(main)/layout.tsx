"use client";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { FloatingCSButton } from "@/components/FloatingCSButton";
import { FCMProvider } from "@/components/FCMProvider";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/checkout") || pathname?.startsWith("/pembayaran") || pathname === "/katalog";

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">{children}</main>
      {!hideFooter && <Footer />}
      <FCMProvider />
      <FloatingCSButton />
    </>
  );
}
