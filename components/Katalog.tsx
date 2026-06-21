"use client";

import { useState } from "react";
import { ProductCarousel } from "./ProductCarousel";

export function Katalog({ semuaProduk = [] }: { semuaProduk?: any[] }) {
  const [kategoriAktif, setKategoriAktif] = useState("Semua");

  const daftarKategori = [
    "Semua",
    ...Array.from(
      new Set(semuaProduk.map((p) => p.kategori?.nama).filter(Boolean)),
    ),
  ];

  const produkTampil =
    kategoriAktif === "Semua"
      ? semuaProduk
      : semuaProduk.filter((p) => p.kategori?.nama === kategoriAktif);

  return (
    <section
      id="katalog"
      className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <p className="text-soft-pink-500 font-bold text-sm uppercase tracking-wider mb-1">
            Katalog kkf-label
          </p>
          <h2 className="text-3xl font-bold text-zinc-900">
            Semua Produk
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {daftarKategori.map((kat: any) => (
            <button
              key={kat}
              onClick={() => setKategoriAktif(kat)}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                kategoriAktif === kat
                  ? "bg-soft-pink-500 text-white shadow-md"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:border-soft-pink-300 hover:bg-soft-pink-50"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {produkTampil.length === 0 ? (
        <div className="text-center py-24 bg-pink-50/40 rounded-3xl border-2 border-dashed border-pink-200">
          <p className="text-zinc-500 font-medium text-lg">
            Belum ada produk untuk kategori "{kategoriAktif}" nih.
          </p>
        </div>
      ) : (
        <div className="mt-4">
          <ProductCarousel products={produkTampil} />
        </div>
      )}
    </section>
  );
}
