"use client";
import { useState, useEffect } from "react";

const ulasan = [
  {
    nama: "Alya",
    lokasi: "Bandung",
    teks: "Bahannya jatuh dan ukurannya pas...",
  },
  {
    nama: "Nadia",
    lokasi: "Surabaya",
    teks: "Checkout mudah, paket cepat sampai...",
  },
  {
    nama: "Rara",
    lokasi: "Jakarta",
    teks: "Suka detail minimalis, produk rapi.",
  },
];

export function SliderUlasan() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i === ulasan.length - 1 ? 0 : i + 1));
    }, 5000); // Ganti tiap 5 detik
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden h-40">
      <div
        className="transition-all duration-700 ease-out flex flex-col"
        style={{ transform: `translateY(-${index * 100}%)` }}
      >
        {ulasan.map((u, i) => (
          <div
            key={i}
            className="min-h-[160px] p-6 bg-white rounded-2xl border border-pink-100 shadow-sm"
          >
            <p className="text-zinc-600 italic">"{u.teks}"</p>
            <p className="mt-4 font-bold text-sm">
              {u.nama}{" "}
              <span className="font-normal text-zinc-400">| {u.lokasi}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
