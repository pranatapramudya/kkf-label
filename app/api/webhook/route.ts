import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const laporanPembayaran = await request.json();

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hashData = `${laporanPembayaran.order_id}${laporanPembayaran.status_code}${laporanPembayaran.gross_amount}${serverKey}`;
    const calculatedSignature = crypto.createHash("sha512").update(hashData).digest("hex");

    if (calculatedSignature !== laporanPembayaran.signature_key) {
      return Response.json({ sukses: false, pesan: "Invalid signature" }, { status: 403 });
    }

    if (laporanPembayaran.transaction_status === "settlement" || laporanPembayaran.transaction_status === "capture") {
      const pesanan = await prisma.order.findUnique({
        where: { kodePesanan: laporanPembayaran.order_id },
        include: { item: true },
      });

      // PENGAMAN: Kalau pesanannya ternyata nggak ada di database, langsung stop!
      if (!pesanan) {
        return Response.json(
          { sukses: false, pesan: "Pesanan tidak ditemukan" },
          { status: 404 },
        );
      }
      
      if (pesanan.statusPesanan === 'DIBAYAR') { 
        return Response.json({ message: 'Already processed' }, { status: 200 }); 
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
