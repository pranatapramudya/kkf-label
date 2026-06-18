import type { Metadata } from "next";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { PenyediaKeranjang } from "@/context/CartContext";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "kkf-label | Fashion Wanita Minimalis",
  description:
    "Butik fashion wanita modern dengan nuansa soft pink dan minimalist white.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* 🔥 FIX: Tambahkan suppressHydrationWarning di html dan body! */}
      <html lang="id" suppressHydrationWarning>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <PenyediaKeranjang>
            <Navbar />
            <main className="min-h-screen pt-20">{children}</main>
            <Footer />
          </PenyediaKeranjang>
        </body>
      </html>
    </ClerkProvider>
  );
}
