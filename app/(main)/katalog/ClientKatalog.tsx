"use client";

import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ProdukKartu } from "@/components/ProdukKartu";
import { ChevronDown, Check } from "lucide-react";

export default function ClientKatalog({ semuaProduk }: { semuaProduk: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "new";

  const [kategoriAktif, setKategoriAktif] = useState<string | null>(null);
  const [halaman, setHalaman] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const handleSortChange = (val: string) => {
    setIsDropdownOpen(false);
    startTransition(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (val === "new") {
        params.delete("sort");
      } else {
        params.set("sort", val);
      }
      router.push(`/katalog?${params.toString()}`);
    });
  };

  return (
    <div className="kontainer-halaman py-6 pb-32 md:py-10 md:pb-32 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900">Katalog Produk</h1>
        </div>
        <div className="relative shrink-0 w-auto z-20" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center gap-2 px-4 py-1.5 bg-white border border-zinc-200 rounded-full text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm w-fit"
          >
            <span className="flex items-center gap-2">
              Urutkan
              {currentSort !== "new" && (
                <span className="w-2 h-2 rounded-full bg-soft-pink-500"></span>
              )}
            </span>
            <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isDropdownOpen && (
            <div className="absolute top-full mt-2 right-0 w-full md:w-56 bg-white border border-zinc-100 rounded-xl shadow-lg overflow-hidden flex flex-col py-1 animate-in fade-in slide-in-from-top-2">
              {daftarSort.map((sort) => {
                const isActive = currentSort === sort.value;
                return (
                  <button
                    key={sort.value}
                    onClick={() => handleSortChange(sort.value)}
                    className={`flex items-center justify-between w-full text-left px-4 py-3 md:py-2 text-sm transition-colors ${
                      isActive ? "bg-soft-pink-50 text-soft-pink-600 font-semibold" : "text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {sort.label}
                    {isActive && <Check className="w-4 h-4 text-soft-pink-500" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 snap-x [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
        <div className={`grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4 lg:grid-cols-5 transition-opacity duration-300 ${isPending ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
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
