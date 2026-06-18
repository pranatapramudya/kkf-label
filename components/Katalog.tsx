"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { ProdukKartu } from "./ProdukKartu";

export function Katalog() {
  const [produkDariDb, setProdukDariDb] = useState<any[]>([]);
  const [kategoriAktif, setKategoriAktif] = useState("Semua");
  const [sedangMemuat, setSedangMemuat] = useState(true);

  useEffect(() => {
    const tarikDataKatalog = async () => {
      try {
        const respons = await fetch("/api/admin/produk");
        if (respons.ok) {
          const data = await respons.json();
          setProdukDariDb(data);
        }
      } catch (error) {
        console.error("Gagal narik data katalog:", error);
      } finally {
        setSedangMemuat(false);
      }
    };

    tarikDataKatalog();
  }, []);

  const daftarKategori = [
    "Semua",
    ...Array.from(
      new Set(produkDariDb.map((p) => p.kategori?.nama).filter(Boolean)),
    ),
  ];

  const produkTampil =
    kategoriAktif === "Semua"
      ? produkDariDb
      : produkDariDb.filter((p) => p.kategori?.nama === kategoriAktif);

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
            Pilihan paling disukai
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

      {sedangMemuat ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 animate-spin text-soft-pink-500 mb-4" />
          <p className="text-zinc-500 font-medium">
            Menyiapkan etalase toko...
          </p>
        </div>
      ) : produkTampil.length === 0 ? (
        <div className="text-center py-24 bg-pink-50/40 rounded-3xl border-2 border-dashed border-pink-200">
          <p className="text-zinc-500 font-medium text-lg">
            Belum ada produk untuk kategori "{kategoriAktif}" nih.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-6">
          {produkTampil.map((item) => (
            <ProdukKartu key={item.id} produk={item} />
          ))}
        </div>
      )}
    </section>
  );
}
