import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const laporanPembayaran = await request.json();

    if (laporanPembayaran.transaction_status === "settlement") {
      const pesanan = await prisma.order.findUnique({
        where: { id: laporanPembayaran.order_id },
        include: { item: true },
      });

      // PENGAMAN: Kalau pesanannya ternyata nggak ada di database, langsung stop!
      // Ini yang bikin error TypeScript lu tadi hilang.
      if (!pesanan) {
        return Response.json(
          { sukses: false, pesan: "Pesanan tidak ditemukan" },
          { status: 404 },
        );
      }

      // Potong stok real-time
      for (const barang of pesanan.item) {
        await prisma.product.update({
          where: { id: barang.produkId },
          data: {
            stokTotal: {
              decrement: barang.jumlah,
            },
          },
        });
      }

      // Ubah status pesanan
      await prisma.order.update({
        where: { id: pesanan.id },
        data: { statusPesanan: "DIBAYAR" },
      });
    }

    return Response.json({ sukses: true });
  } catch (error) {
    return Response.json(
      { sukses: false, pesan: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
