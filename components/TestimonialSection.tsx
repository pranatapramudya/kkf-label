"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";

import { maskName } from "@/lib/masking";

export function TestimonialSection() {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [ulasanReal, setUlasanReal] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/ulasan")
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) setUlasanReal(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const dataUlasan = ulasanReal;
  useEffect(() => {
    if (isHovered || dataUlasan.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev === dataUlasan.length - 1 ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, dataUlasan.length]);

  if (ulasanReal.length === 0) return null;

  return (
    // FIX: Tambahkan overflow-hidden di section utama agar tidak ada elemen yang bocor ke samping layar HP
    <section className="kontainer-halaman mt-16 mb-16 overflow-hidden max-w-full">
      <div className="mb-5">
        <p className="text-sm font-semibold text-soft-pink-600">
          Cerita pelanggan
        </p>
        <h2 className="mt-1.5 text-2xl font-bold text-zinc-900 sm:text-3xl">
          Dipakai untuk hari yang cantik
        </h2>
      </div>

      {/* Wadah Slider: Padding kiri-kanan disesuaikan untuk mobile (px-4) */}
      <div
        className="relative overflow-hidden rounded-2xl bg-pink-50/50 border border-pink-100 py-8 px-4 sm:p-8 shadow-sm w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex w-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {dataUlasan.map((u) => (
            // FIX: Gunakan w-full flex-none agar setiap ulasan ukurannya mengunci pas 100% layar
            <div
              key={u.id}
              className="w-full flex-none flex flex-col justify-center items-center text-center px-2 sm:px-6"
            >
              <div className="flex gap-1 mb-3.5">
                {[...Array(5)].map((_, idx) => (
                  <Star
                    key={idx}
                    size={16}
                    className={
                      idx < u.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-zinc-200 text-zinc-200"
                    }
                  />
                ))}
              </div>

              {/* FIX: break-words memastikan teks yang panjang akan dipaksa turun ke baris baru */}
              <p className="text-base sm:text-lg font-medium text-zinc-700 italic leading-relaxed w-full max-w-2xl break-words whitespace-normal">
                "{u.teks}"
              </p>

              <div className="mt-5">
                <p className="font-bold text-zinc-900 text-sm sm:text-base">
                  {maskName(u.nama)}
                </p>
                <p className="text-xs sm:text-sm text-zinc-500 mt-0.5">
                  {u.lokasi}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-1.5">
          {dataUlasan.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${index === i ? "w-6 bg-soft-pink-500" : "w-1.5 bg-pink-200 hover:bg-pink-300"}`}
              aria-label={`Lihat ulasan ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
