import AdminDashboardClient from "./AdminDashboardClient";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  let initialAnalitik = null;
  let initialProduk = [];
  let pendingCount = 0;
  let unreadCount = 0;

  try {
    const sekarang = new Date();
    // Tarik analitik 7 hari terakhir (default)
    const tanggalMulai = new Date();
    tanggalMulai.setDate(sekarang.getDate() - 7);
    const tanggalAkhir = new Date();

    const orders = await prisma.order.findMany({
      where: {
        dibuatPada: { gte: tanggalMulai, lte: tanggalAkhir },
      },
      select: {
        total: true,
        dibuatPada: true,
        statusPesanan: true,
        item: { select: { produkId: true, jumlah: true } },
      },
    });

    const totalOmset = orders
      .filter((o) => o.statusPesanan === "SELESAI")
      .reduce((sum, order) => sum + order.total, 0);

    const totalPesanan = orders.length;

    initialAnalitik = {
      omset: totalOmset,
      pesanan: totalPesanan,
      detail: orders,
    };

    // Tarik data produk untuk peringatan stok
    const produk = await prisma.product.findMany({
      include: { varian: true, kategori: true },
      orderBy: { dibuatPada: "desc" },
    });
    initialProduk = produk;

    // Tarik angka pesanan pending dan ulasan unread
    pendingCount = await prisma.order.count({
      where: { statusPesanan: "MENUNGGU_PEMBAYARAN" },
    });

    unreadCount = await prisma.review.count({
      where: { OR: [{ adminReply: null }, { adminReply: "" }] },
    });
  } catch (error) {
    console.error("[AdminPage] Error fetching server data:", error);
  }

  return (
    <AdminDashboardClient
      initialAnalitik={initialAnalitik}
      initialProduk={initialProduk}
      pendingCount={pendingCount}
      unreadCount={unreadCount}
    />
  );
}