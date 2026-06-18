import { notFound } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import ClientProdukDetail from "./ClientProdukDetail";

const prisma = new PrismaClient();

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
    include: {
      kategori: true,
      varian: true,
      ulasan: true,
    },
  });

  if (!produkDb) {
    notFound();
  }

  // Lempar semua data dari server langsung ke Client Component yang tadi kita bikin
  return <ClientProdukDetail produk={produkDb} />;
}
