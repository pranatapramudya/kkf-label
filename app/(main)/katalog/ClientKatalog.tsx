"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProdukKartu } from "@/components/ProdukKartu";

export default function ClientKatalog({ semuaProduk }: { semuaProduk: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "new";

  const [kategoriAktif, setKategoriAktif] = useState<string | null>(null);
  const [halaman, setHalaman] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;

  const daftarKategori = [
    { label: "Semua", value: null },
    ...Array.from(
      new Set(semuaProduk.map((p) => p.kategori?.nama).filter(Boolean))
    ).map((name) => ({ label: name, value: name })),
  ];

  const daftarSort = [
    { label: "Terbaru", value: "new" },
    { label: "Harga: Rendah ke Tinggi", value: "asc" },
    { label: "Harga: Tinggi ke Rendah", value: "desc" },
  ];

  const produkTampilFiltered =
    kategoriAktif === null
      ? semuaProduk
      : semuaProduk.filter((p) => p.kategori?.nama === kategoriAktif);

  const produkTampil = produkTampilFiltered.slice(0, halaman * itemsPerPage);
  const adaLebihBanyak = produkTampilFiltered.length > halaman * itemsPerPage;

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setHalaman((prev) => prev + 1);
      setIsLoading(false);
    }, 400); // Simulasi delay singkat agar UX loading terlihat
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (val === "new") {
      params.delete("sort");
    } else {
      params.set("sort", val);
    }
    router.push(`/katalog?${params.toString()}`);
  };

  return (
    <div className="kontainer-halaman py-6 pb-32 md:py-10 md:pb-32 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-2">Katalog Produk</h1>
          <p className="text-sm md:text-base text-zinc-500">Temukan koleksi pilihan kami khusus untukmu.</p>
        </div>
        <div className="shrink-0">
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="w-full md:w-auto px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-700 focus:outline-none focus:border-soft-pink-500 transition-colors cursor-pointer"
          >
            {daftarSort.map((sort) => (
              <option key={sort.value} value={sort.value}>
                Urutkan: {sort.label}
              </option>
            ))}
          </select>
        </div>
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
        <div className="mt-10 flex justify-center pb-8 md:pb-0">
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="w-full md:w-auto px-8 py-3.5 bg-transparent border-2 border-soft-pink-300 text-soft-pink-600 rounded-xl font-bold text-sm shadow-sm hover:bg-soft-pink-50 hover:border-soft-pink-400 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoading ? "Memuat..." : "Muat Lebih Banyak"}
          </button>
        </div>
      )}
    </div>
  );
}
