import { PrismaClient } from "@prisma/client";
import ClientKatalog from "./ClientKatalog";

export const revalidate = 60;

const prisma = new PrismaClient();

export default async function HalamanKatalog({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>;
}) {
  const { sort } = await searchParams;

  let orderBy: any = { dibuatPada: "desc" };
  
  if (sort === "asc") {
    orderBy = { harga: "asc" };
  } else if (sort === "desc") {
    orderBy = { harga: "desc" };
  }

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
    orderBy,
  });

  return <ClientKatalog semuaProduk={semuaProduk} />;
}
