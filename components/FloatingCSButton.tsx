"use client";

import { usePathname } from "next/navigation";
import { Bot } from "lucide-react";

export function FloatingCSButton() {
  const pathname = usePathname();

  // Sembunyikan di halaman admin agar tidak mengganggu operasional admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  const bukaWA = () => {
    window.open(
      "https://wa.me/6285117490449?text=Halo%20Admin%20KKF%20Label!",
      "_blank"
    );
  };

  return (
    <button
      onClick={bukaWA}
      className="fixed bottom-24 right-4 z-[90] bg-emerald-500 text-white p-3.5 rounded-full shadow-lg hover:bg-emerald-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center animate-bounce md:animate-none"
      aria-label="Hubungi CS via WhatsApp"
    >
      <Bot size={28} />
    </button>
  );
}
