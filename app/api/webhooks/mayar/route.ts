import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { config } from "@/lib/env";

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-mayar-signature");
    const rawBody = await req.text();

    const webhookSecret = config.mayar.webhookSecret;

    // Verifikasi Signature (Hanya jika webhook secret diset)
    if (webhookSecret && signature) {
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (signature !== expectedSignature) {
        console.error("❌ [Mayar Webhook] Invalid Signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
    } else if (!webhookSecret) {
      console.warn("⚠️ [Mayar Webhook] MAYAR_WEBHOOK_SECRET belum diset di .env, melewatkan verifikasi signature!");
    }

    const payload = JSON.parse(rawBody);

    // Endpoint webhook Mayar biasanya mengirim data dengan struktur:
    // payload.status = "SUCCESS" / "PAID"
    // payload.data.external_id = "KKF-xxx" (Order ID kita)
    // Sesuaikan field ini dengan dokumentasi payload Mayar terbaru

    const status = payload?.status || payload?.data?.status;
    const orderId = payload?.data?.external_id || payload?.external_id;

    if (!orderId) {
      return NextResponse.json({ error: "Missing external_id" }, { status: 400 });
    }

    if (status === "SUCCESS" || status === "PAID" || status === "SETTLED") {
      await prisma.order.update({
        where: { kodePesanan: orderId },
        data: {
          statusPesanan: "DIBAYAR", // Sesuai schema
          diubahPada: new Date(),
        },
      });

      console.log(`✅ [Mayar Webhook] Pesanan ${orderId} berhasil diupdate menjadi DIBAYAR.`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("❌ [Mayar Webhook] Error processing webhook:", error.message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
