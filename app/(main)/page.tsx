import { ArrowRight, Heart, ShieldCheck, Truck } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import { ProdukKartu } from "@/components/ProdukKartu";
import { TestimonialSection } from "@/components/TestimonialSection";
import { Katalog } from "@/components/Katalog";
import { AutoRefresh } from "@/components/AutoRefresh"; // <--- Import komponen gaibnya

const prisma = new PrismaClient();

export default async function HalamanUtama() {
  const produkReal = await prisma.product.findMany({
    where: { aktif: true },
    include: { kategori: true },
    orderBy: { dibuatPada: "desc" },
    take: 4,
  });

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
              <a href="#katalog" className="tombol-utama gap-2">
                Lihat Katalog
                <ArrowRight size={18} />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {produkReal.map((produk, indeks) => (
              <div
                key={produk.id}
                className={indeks % 2 === 0 ? "translate-y-3" : ""}
              >
                <ProdukKartu produk={produk} />
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

      <Katalog />
      <TestimonialSection />
    </div>
  );
}
