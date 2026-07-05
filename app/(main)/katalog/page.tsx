import { PrismaClient } from "@prisma/client";
import ClientKatalog from "./ClientKatalog";

export const revalidate = 60;

const prisma = new PrismaClient();

export default async function HalamanKatalog() {
  const semuaProduk = await prisma.product.findMany({
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
  });

  return <ClientKatalog semuaProduk={semuaProduk} />;
}
