import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  // 🔥 FIX 1: Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { statusPesanan, ekspedisi, nomorResi } = body;

    const resolvedParams = await params;

    const existingOrder = await prisma.order.findUnique({
      where: { id: resolvedParams.id },
      include: { item: true },
    });

    if (!existingOrder) {
      throw new Error("Pesanan tidak ditemukan");
    }

    // 🔥 FIX 3 & 4: Logika pengembalian stok jika DIBATALKAN
    if (statusPesanan === "DIBATALKAN" && existingOrder.statusPesanan !== "DIBATALKAN") {
      const updateOrder = await prisma.$transaction(async (tx) => {
        // 1. Update status pesanan
        const order = await tx.order.update({
          where: { id: resolvedParams.id },
          data: {
            statusPesanan,
            ekspedisi: ekspedisi || null,
            nomorResi: nomorResi || null,
          },
        });

        // 2. Kembalikan stok untuk setiap item yang dibeli
        for (const it of existingOrder.item) {
          if (it.varianId) {
            await tx.productVariant.update({
              where: { id: it.varianId },
              data: { stok: { increment: it.jumlah } },
            });
          }
          await tx.product.update({
            where: { id: it.produkId },
            data: { stokTotal: { increment: it.jumlah } },
          });
        }

        return order;
      });

      return NextResponse.json({
        pesanan: "Mantap bos! Pesanan dibatalkan dan stok berhasil dikembalikan.",
        data: updateOrder,
      });
    }

    // Jika bukan DIBATALKAN, update biasa tanpa ubah stok
    const updateOrder = await prisma.order.update({
      where: { id: resolvedParams.id },
      data: {
        statusPesanan,
        ekspedisi: ekspedisi || null,
        nomorResi: nomorResi || null,
      },
    });

    return NextResponse.json({
      pesanan: "Mantap bos! Status pesanan berhasil diupdate.",
      data: updateOrder,
    });
  } catch (galat: any) {
    console.error("🔥 Error Update Pesanan:", galat.message);
    return NextResponse.json(
      { pesan: "Gagal update pesanan: " + galat.message },
      { status: 500 },
    );
  }
}
