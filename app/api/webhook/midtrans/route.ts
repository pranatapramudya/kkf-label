import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status } = body;

    if (!order_id || !signature_key || !status_code || !gross_amount) {
      return NextResponse.json({ message: "Invalid payload" }, { status: 400 });
    }

    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    const hash = crypto.createHash("sha512").update(order_id + status_code + gross_amount + serverKey).digest("hex");

    if (hash !== signature_key) {
      return NextResponse.json({ message: "Invalid Signature" }, { status: 403 });
    }

    const order = await prisma.order.findUnique({
      where: { kodePesanan: order_id },
      include: { item: true }
    });

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    if (transaction_status === 'capture' || transaction_status === 'settlement') {
      // Jika pembayaran berhasil
      if (order.statusPesanan === "MENUNGGU_PEMBAYARAN") {
        await prisma.order.update({
          where: { kodePesanan: order_id },
          data: { statusPesanan: "DIBAYAR" }
        });
      }
    } else if (
      transaction_status === 'cancel' ||
      transaction_status === 'deny' ||
      transaction_status === 'expire'
    ) {
      // Hanya kembalikan stok jika pesanan sebelumnya bukan DIBATALKAN (mencegah double restore)
      if (order.statusPesanan !== "DIBATALKAN") {
        await prisma.$transaction(async (tx) => {
          // Update status
          await tx.order.update({
            where: { kodePesanan: order_id },
            data: { statusPesanan: "DIBATALKAN" }
          });

          // Kembalikan stok
          for (const itm of order.item) {
            await tx.product.update({
              where: { id: itm.produkId },
              data: { stokTotal: { increment: itm.jumlah } }
            });

            if (itm.varianId) {
              await tx.productVariant.update({
                where: { id: itm.varianId },
                data: { stok: { increment: itm.jumlah } }
              });
            }
          }
        });
      }
    }

    return NextResponse.json({ status: "OK" });
  } catch (error: any) {
    console.error("🔥 Webhook Midtrans Error:", error.message);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
