import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import TabelProduk from "./TabelProduk"; // Import komponen tabel kita

const prisma = new PrismaClient();

export default async function HalamanManajemenProduk() {
  // Tarik data dari Supabase, termasuk nama kategorinya
  const produk = await prisma.product.findMany({
    orderBy: {
      dibuatPada: "desc",
    },
    include: {
      kategori: true,
    },
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Daftar Produk</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola inventaris LumeStack SaaS Anda.
          </p>
        </div>
        {/* Tombol Tambah Produk */}
        <Link
          href="/admin/produk/tambah"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors shadow-sm"
        >
          + Tambah Produk Baru
        </Link>
      </div>

      {/* Lempar data dari server ke tabel interaktif */}
      <TabelProduk dataProduk={produk} />
    </div>
  );
}
