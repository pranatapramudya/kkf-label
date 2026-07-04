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
    },
  });

  if (!produkDb) {
    return {
      title: "Produk Tidak Ditemukan | KKF Label",
    };
  }

  return {
    title: `${produkDb.nama} | KKF Label`,
    description: produkDb.deskripsi.substring(0, 160),
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

  // Lempar semua data dari server langsung ke Client Component yang tadi kita bikin
  return <ClientProdukDetail produk={produkDb} />;
}
