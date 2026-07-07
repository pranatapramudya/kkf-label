"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";

export function FloatingCSButton() {
  const pathname = usePathname();

  // Sembunyikan di halaman admin agar tidak mengganggu operasional admin
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <a
      href="https://wa.me/6285117490449?text=Halo%20Admin%20KKF%20Label!"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-[90] bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:bg-[#20bd5a] hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center animate-bounce md:animate-none"
      aria-label="Hubungi CS via WhatsApp"
    >
      <Image src="/icons/whatsapp.png" alt="WhatsApp" width={32} height={32} className="object-contain" />
    </a>
  );
}
