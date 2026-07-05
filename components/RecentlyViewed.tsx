"use client";

import { useEffect, useState } from "react";
import { ProductCarousel } from "./ProductCarousel";

export function RecentlyViewed() {
  const [recentProducts, setRecentProducts] = useState<any[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("kkf_recently_viewed");
      if (stored) {
        const parsed = JSON.parse(stored);
        setRecentProducts(parsed);
      }
    } catch (err) {
      console.error("Gagal membaca recently viewed:", err);
    }
  }, []);

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 bg-white/50 border-t border-zinc-100">
      <div className="flex flex-col mb-8 gap-1">
        <p className="text-soft-pink-500 font-bold text-sm uppercase tracking-wider">
          Histori Penjelajahan
        </p>
        <h2 className="text-3xl font-bold text-zinc-900">
          Terakhir Kamu Lihat
        </h2>
      </div>
      <div className="mt-4">
        {/* autoPlay={false} agar bisa di-scroll manual seperti kategori Pilihan Disukai */}
        <ProductCarousel products={recentProducts} autoPlay={false} />
      </div>
    </section>
  );
}
