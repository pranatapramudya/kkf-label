"use client";

import { useState } from "react";
import { ProdukKartu } from "@/components/ProdukKartu";

export default function ClientKatalog({ semuaProduk }: { semuaProduk: any[] }) {
  const [kategoriAktif, setKategoriAktif] = useState<string | null>(null);
  const [halaman, setHalaman] = useState(1);
  const itemsPerPage = 10;

  const daftarKategori = [
    { label: "Semua", value: null },
    ...Array.from(
      new Set(semuaProduk.map((p) => p.kategori?.nama).filter(Boolean))
    ).map((name) => ({ label: name, value: name })),
  ];

  const produkTampilFiltered =
    kategoriAktif === null
      ? semuaProduk
      : semuaProduk.filter((p) => p.kategori?.nama === kategoriAktif);

  const produkTampil = produkTampilFiltered.slice(0, halaman * itemsPerPage);
  const adaLebihBanyak = produkTampilFiltered.length > halaman * itemsPerPage;

  return (
    <div className="kontainer-halaman py-6 md:py-10 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">Katalog Produk</h1>
        <p className="text-sm md:text-base text-zinc-500">Temukan koleksi pilihan kami khusus untukmu.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide snap-x">
        {daftarKategori.map((kat: any) => (
          <button
            key={kat.label}
            onClick={() => {
              setKategoriAktif(kat.value);
              setHalaman(1);
            }}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-semibold transition-all snap-start shrink-0 ${
              kategoriAktif === kat.value
                ? "bg-soft-pink-500 text-white shadow-md"
                : "bg-white text-zinc-600 border border-zinc-200 hover:border-soft-pink-300 hover:bg-soft-pink-50"
            }`}
          >
            {kat.label}
          </button>
        ))}
      </div>

      {produkTampil.length === 0 ? (
        <div className="text-center py-20 bg-pink-50/40 rounded-3xl border-2 border-dashed border-pink-200">
          <p className="text-zinc-500 font-medium text-sm md:text-lg">
            Belum ada produk untuk kategori "{kategoriAktif}" nih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4 lg:grid-cols-5">
          {produkTampil.map((produk) => (
            <ProdukKartu key={produk.id} produk={produk} />
          ))}
        </div>
      )}

      {adaLebihBanyak && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setHalaman((prev) => prev + 1)}
            className="w-full md:w-auto px-6 py-3.5 bg-white border border-soft-pink-200 text-soft-pink-600 rounded-xl font-bold text-sm shadow-sm hover:bg-soft-pink-50 hover:border-soft-pink-300 transition-all active:scale-95"
          >
            Muat Lebih Banyak
          </button>
        </div>
      )}
    </div>
  );
}
