"use client";
import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function SliderFoto({ gambar }: { gambar: string[] }) {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i === 0 ? gambar.length - 1 : i - 1));
  const next = () => setIndex((i) => (i === gambar.length - 1 ? 0 : i + 1));

  return (
    <div className="relative group overflow-hidden rounded-2xl aspect-[3/4] bg-zinc-100">
      {/* Container Gambar */}
      <div
        className="flex transition-transform duration-500 ease-in-out h-full w-full"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {gambar.map((src, i) => (
          <div key={i} className="min-w-full h-full relative">
            <Image
              src={src}
              alt="Produk"
              fill
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Tombol Navigasi */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
