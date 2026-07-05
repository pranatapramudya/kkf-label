import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import ClientProdukDetail from "./ClientProdukDetail";

import { Metadata } from "next";

const prisma = new PrismaClient();

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;

  const produkDb = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    select: {
      nama: true,
      deskripsi: true,
      slug: true,
      fotoUtama: true,
    },
  });

  if (!produkDb) {
    return {
      title: "Produk Tidak Ditemukan | KKF Label",
    };
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    title: `${produkDb.nama} | KKF Label`,
    description: produkDb.deskripsi.substring(0, 160),
    openGraph: {
      title: produkDb.nama,
      description: produkDb.deskripsi.substring(0, 160),
      url: `${baseUrl}/produk/${produkDb.slug}`,
      siteName: "KKF Label",
      images: [produkDb.fotoUtama],
      type: "website",
    },
  };
}

export default async function HalamanDetailProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const produkDb = await prisma.product.findFirst({
    where: {
      OR: [{ id: id }, { slug: id }],
    },
    select: {
      id: true,
      nama: true,
      slug: true,
      deskripsi: true,
      harga: true,
      hargaCoret: true,
      diskonPersen: true,
      fotoUtama: true,
      galeriFoto: true,
      stokTotal: true,
      videoUrl: true,
      kategoriId: true,
      kategori: { select: { nama: true } },
      varian: {
        select: {
          id: true,
          ukuran: true,
          warna: true,
          stok: true,
        },
      },
      ulasan: {
        take: 5,
        orderBy: { dibuatPada: "desc" },
        select: {
          id: true,
          namaGuest: true,
          rating: true,
          comment: true,
          adminReply: true,
          dibuatPada: true,
        },
      },
    },
  });

  if (!produkDb) {
    notFound();
  }

  // ALGORITMA REKOMENDASI (Content-Based)
  // 1. Ambil dari kategori yang sama
  const rekomendasiKategori = await prisma.product.findMany({
    where: {
      aktif: true,
      isArchived: false,
      id: { not: produkDb.id },
      kategoriId: produkDb.kategoriId,
    },
    take: 10,
    orderBy: { dibuatPada: "desc" },
    select: {
      id: true,
      nama: true,
      harga: true,
      hargaCoret: true,
      diskonPersen: true,
      fotoUtama: true,
      kategori: { select: { nama: true } },
    }
  });

  let rekomendasi = [...rekomendasiKategori];

  // 2. Jika kurang dari 10, tambahkan dari kategori lain secara acak/terbaru
  if (rekomendasi.length < 10) {
    const idsToExclude = [produkDb.id, ...rekomendasi.map((p) => p.id)];
    const tambahan = await prisma.product.findMany({
      where: {
        aktif: true,
        isArchived: false,
        id: { notIn: idsToExclude },
      },
      take: 10 - rekomendasi.length,
      orderBy: { dibuatPada: "desc" },
      select: {
        id: true,
        nama: true,
        harga: true,
        hargaCoret: true,
        diskonPersen: true,
        fotoUtama: true,
        kategori: { select: { nama: true } },
      }
    });
    rekomendasi = [...rekomendasi, ...tambahan];
  }

  return <ClientProdukDetail produk={produkDb} rekomendasi={rekomendasi} />;
}
