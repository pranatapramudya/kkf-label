import AkunClient from "./AkunClient";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export default async function AkunPage({
  searchParams,
}: {
  searchParams: Promise<{ kontak?: string }>;
}) {
  const resolvedParams = await searchParams;
  const kontak = resolvedParams?.kontak;
  let initialData = null;

  if (kontak) {
    // Koki mengambil data dari kulkas (database) secara aman di server
    try {
      const pesanan = await prisma.order.findMany({
        where: {
          OR: [
            { teleponPenerima: { contains: kontak } },
            { emailPenerima: { contains: kontak } },
          ],
        },
        include: {
          item: {
            include: {
              produk: true, // Untuk ambil fotoUtama dll
            },
          },
        },
        orderBy: {
          dibuatPada: "desc",
        },
      });
      initialData = pesanan;
    } catch (error) {
      console.error("[AkunPage] Error fetching pesanan:", error);
    }
  }

  // Lempar ke pelayan untuk disajikan dan merespon klik user
  return <AkunClient initialData={initialData} />;
}