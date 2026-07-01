export const revalidate = 60;

import { ArrowRight, Heart, ShieldCheck, Truck } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { ProdukKartu } from "@/components/ProdukKartu";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Katalog } from "@/components/Katalog";
import { AutoRefresh } from "@/components/AutoRefresh"; // <--- Import komponen gaibnya
import { ProductCarousel } from "@/components/ProductCarousel";

const prisma = new PrismaClient();

export default async function HalamanUtama() {
  const produkReal = await prisma.product.findMany({
    where: { aktif: true },
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
    where: { aktif: true },
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
    <div>
      {/* Komponen gaib buat refresh background tiap menit */}
      <AutoRefresh />

      <section className="kontainer-halaman pt-6">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="py-4">
            <p className="inline-flex rounded-full bg-white px-4 py-2 text-xs font-semibold text-soft-pink-600 shadow-sm">
              Koleksi terbaru 2026
            </p>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight text-zinc-900 sm:text-5xl">
              Fashion wanita minimalis untuk hari yang terasa lembut.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-zinc-600">
              Pilihan dress, blouse, outer, dan setelan dengan palet soft pink,
              potongan bersih, serta pengalaman belanja yang nyaman dari HP.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href="#katalog" className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all">
                Lihat Katalog
                <ArrowRight size={18} />
              </a>
              {topProducts && topProducts.length > 0 && (
                <a
                  href="#pilihan-disukai"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-pink-50 text-pink-600 font-semibold px-8 py-3 rounded-xl hover:bg-pink-100 transition-all"
                >
                  Pilihan Paling Disukai
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

      <Katalog semuaProduk={semuaProdukLengkap} />
      <TestimonialSection />
    </div>
  );
}
