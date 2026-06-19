"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefresh() {
  const router = useRouter();

  useEffect(() => {
    // Timer di-set setiap 60.000 milidetik (1 Menit)
    const interval = setInterval(() => {
      // router.refresh() bakal narik data terbaru dari server (database Prisma)
      // secara diam-diam di background tanpa reload halaman.
      router.refresh();
    }, 15000);

    // Bersihin timer kalau user pindah halaman biar nggak bocor memorinya
    return () => clearInterval(interval);
  }, [router]);

  // Return null = Komponen ini nggak akan nampilin UI apapun di layar (100% Hidden)
  return null;
}
