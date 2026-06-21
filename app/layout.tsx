import type { Metadata } from "next";
import "./globals.css";
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
      <html lang="id" suppressHydrationWarning>
        <body className="font-sans antialiased" suppressHydrationWarning>
          <PenyediaKeranjang>
            {children}
          </PenyediaKeranjang>
        </body>
      </html>
    </ClerkProvider>
  );
}
