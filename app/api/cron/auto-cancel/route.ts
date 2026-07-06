import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  // Validasi Cron Secret jika di-set di environment variables
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Cari pesanan yang usianya lebih dari 24 jam
    const duaPuluhEmpatJamLalu = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const expiredOrders = await prisma.order.findMany({
      where: {
        statusPesanan: "MENUNGGU_PEMBAYARAN",
        dibuatPada: {
          lt: duaPuluhEmpatJamLalu
        }
      },
      include: {
        item: true
      }
    });

    if (expiredOrders.length === 0) {
      return NextResponse.json({ success: true, message: "Tidak ada pesanan kedaluwarsa (Ghost Stock) yang perlu dibatalkan." });
    }

    let totalCanceled = 0;

    // Menjaga integritas data (ACID) menggunakan Prisma Transaction
    await prisma.$transaction(async (tx) => {
      await Promise.all(expiredOrders.map(async (order) => {
        // 1. Ubah status pesanan menjadi DIBATALKAN
        await tx.order.update({
          where: { id: order.id },
          data: { statusPesanan: "DIBATALKAN" }
        });

        // 2. Kembalikan (increment) stok produk dan varian yang dibeli
        await Promise.all(order.item.map(async (item) => {
          const updates = [];
          
          // Increment stok utama produk
          updates.push(
            tx.product.update({
              where: { id: item.produkId },
              data: { stokTotal: { increment: item.jumlah } }
            })
          );

          // Increment stok varian jika ada varian
          if (item.varianId) {
            updates.push(
              tx.productVariant.update({
                where: { id: item.varianId },
                data: { stok: { increment: item.jumlah } }
              })
            );
          }
          
          return Promise.all(updates);
        }));

        totalCanceled++;
      }));
    }, {
      maxWait: 10000,
      timeout: 20000
    });

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil membatalkan ${totalCanceled} pesanan kedaluwarsa dan memulihkan stok.`,
      canceledOrders: expiredOrders.map(o => o.kodePesanan)
    });

  } catch (error: any) {
    console.error("🔥 Cron Auto Cancel Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan saat mengeksekusi Auto-Cancel.", details: error.message }, { status: 500 });
  }
}
