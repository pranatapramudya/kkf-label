import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = { params: Promise<{ id: string }> };

export async function POST(
  req: Request,
  props: RouteParams
) {
  try {
    const { id } = await props.params;
    const orderId = id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { item: true }
    });

    if (!order) {
      return NextResponse.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
    }

    if (order.statusPesanan !== "MENUNGGU_PEMBAYARAN") {
      return NextResponse.json({ error: "Pesanan tidak dapat dibatalkan pada tahap ini." }, { status: 400 });
    }
    
    // Prisma Transaction untuk membatalkan dan rollback stok
    await prisma.$transaction(async (tx) => {
      // 1. Ubah status pesanan
      await tx.order.update({
        where: { id: orderId },
        data: { statusPesanan: "DIBATALKAN" }
      });

      // 2. Rollback stok
      for (const item of order.item) {
        if (item.varianId) {
           await tx.productVariant.update({
             where: { id: item.varianId },
             data: { stok: { increment: item.jumlah } }
           });
        }
        await tx.product.update({
           where: { id: item.produkId },
           data: { stokTotal: { increment: item.jumlah } }
        });
      }
    });

    return NextResponse.json({ message: "Pesanan berhasil dibatalkan dan stok telah dikembalikan." });
  } catch (error: any) {
    console.error("Cancel Order Error:", error);
    return NextResponse.json({ error: "Gagal membatalkan pesanan." }, { status: 500 });
  }
}
