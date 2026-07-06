export const revalidate = 60;

import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Heart, ShieldCheck, Truck } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { ProdukKartu } from "@/components/ProdukKartu";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Katalog } from "@/components/Katalog";
import { AutoRefresh } from "@/components/AutoRefresh"; // <--- Import komponen gaibnya
import { ProductCarousel } from "@/components/ProductCarousel";
import { RecentlyViewed } from "@/components/RecentlyViewed";

const prisma = new PrismaClient();

export default async function HalamanUtama() {
  const produkReal = await prisma.product.findMany({
    where: { aktif: true, isArchived: false },
    select: {
      id: true,
      nama: true,
      harga: true,
      diskonPersen: true,
      fotoUtama: true,
      kategori: { select: { nama: true } },
    },
    orderBy: { dibuatPada: "desc" },
    take: 2,
  });

  const semuaProdukLengkap = await prisma.product.findMany({
    where: { aktif: true, isArchived: false },
    select: {
      id: true,
      nama: true,
      harga: true,
      diskonPersen: true,
      fotoUtama: true,
      kategori: { select: { nama: true } },
      ulasan: { select: { rating: true } },
    },
    orderBy: { dibuatPada: "desc" },
    take: 20,
  });

  const topProducts = semuaProdukLengkap
    .filter((p) => {
      if (!p.ulasan || p.ulasan.length === 0) return false;
      const rataRata =
        p.ulasan.reduce((acc, curr) => acc + curr.rating, 0) / p.ulasan.length;
      return rataRata >= 4.5;
    })
    .slice(0, 5); // Ambil maksimal 5 teratas

  return (
    <div className="pb-28">
      {/* Komponen gaib buat refresh background tiap menit */}
      <AutoRefresh />

      <section className="kontainer-halaman pt-2">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="bg-gradient-to-b from-pink-200 via-pink-100 to-white pt-4 pb-8 px-4 mt-2 rounded-[2rem] shadow-sm sm:px-8 sm:rounded-3xl mb-6 lg:mb-0">
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-soft-pink-600 shadow-sm">
              Koleksi terbaru 2026
            </p>
            <h1 className="mt-3 max-w-xl text-4xl font-bold leading-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-300">
              Fashion wanita minimalis untuk hari yang terasa lembut.
            </h1>
            
            {/* Modern Icon Grid Menu */}
            <div className="mt-6 flex items-center justify-around bg-white/70 backdrop-blur-md border border-white/50 shadow-sm rounded-2xl p-5 w-full">
              <Link href="/katalog" className="flex flex-col items-center gap-2 group min-w-[80px]">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:bg-pink-50 group-hover:scale-105 transition-all shadow-md border border-pink-100">
                  <Image src="/icons/icon-cart.png" alt="Semua Produk" width={40} height={40} className="object-contain" />
                </div>
                <span className="text-[10px] font-bold text-black text-center uppercase tracking-wide">
                  Semua Produk
                </span>
              </Link>
              
              {topProducts && topProducts.length > 0 && (
                <a href="#pilihan-disukai" className="flex flex-col items-center gap-2 group min-w-[80px]">
                  <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:bg-pink-50 group-hover:scale-105 transition-all shadow-md border border-pink-100">
                    <Image src="/icons/icon-new.png" alt="Paling Disukai" width={40} height={40} className="object-contain" />
                  </div>
                  <span className="text-[10px] font-bold text-black text-center uppercase tracking-wide">
                    Paling Disukai
                  </span>
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {produkReal.map((produk, indeks) => (
              <div
                key={produk.id}
                className={indeks % 2 === 0 ? "translate-y-3" : ""}
              >
                <ProdukKartu produk={produk} priority={indeks < 2} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="kontainer-halaman mt-12 grid gap-3 sm:grid-cols-3">
        {[
          {
            ikon: Truck,
            judul: "Kirim cepat",
            isi: "Ongkir otomatis setelah kota dipilih.",
          },
          {
            ikon: ShieldCheck,
            judul: "Bayar aman",
            isi: "Payment gateway diproses lewat API internal.",
          },
          {
            ikon: Heart,
            judul: "Kurasi lembut",
            isi: "Warna dan bahan dipilih untuk gaya harian.",
          },
        ].map((fitur) => (
          <div key={fitur.judul} className="kartu-lembut flex gap-3 p-4">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-soft-pink-100 text-soft-pink-600">
              <fitur.ikon size={20} />
            </span>
            <div>
              <h2 className="font-semibold text-zinc-900">{fitur.judul}</h2>
              <p className="mt-1 text-sm leading-6 text-zinc-600">
                {fitur.isi}
              </p>
            </div>
          </div>
        ))}
      </section>

      {topProducts && topProducts.length > 0 && (
        <section id="pilihan-disukai" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div className="flex flex-col mb-8 gap-1">
            <p className="text-soft-pink-500 font-bold text-sm uppercase tracking-wider">
              Highly Rated
            </p>
            <h2 className="text-3xl font-bold text-zinc-900">
              Pilihan Paling Disukai
            </h2>
          </div>
          <div className="mt-4">
            <ProductCarousel products={topProducts} />
          </div>
        </section>
      )}

      <RecentlyViewed />

      <Katalog semuaProduk={semuaProdukLengkap} />
      <TestimonialSection />
    </div>
  );
}
