import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import "@/lib/firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  
  // Validasi Cron Secret
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Ambil Order yang statusnya MENUNGGU_PEMBAYARAN
    // dan dibuatPada lebih dari 1 jam yang lalu tapi kurang dari 24 jam yang lalu
    const satuJamLalu = new Date(Date.now() - 1 * 60 * 60 * 1000);
    const duaPuluhEmpatJamLalu = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const abandonedOrders = await prisma.order.findMany({
      where: {
        statusPesanan: "MENUNGGU_PEMBAYARAN",
        diubahPada: {
          gt: duaPuluhEmpatJamLalu,
          lt: satuJamLalu
        },
        pengguna: {
          fcmToken: { not: null }
        }
      },
      include: {
        pengguna: true
      }
    });

    if (abandonedOrders.length === 0) {
      return NextResponse.json({ success: true, message: "Tidak ada abandoned order yang perlu dinotifikasi." });
    }

    const messages = abandonedOrders.map(order => ({
      token: order.pengguna!.fcmToken!,
      notification: {
        title: "Selesaikan Pembayaranmu! 💳",
        body: "Pesanan KKF Label kamu sudah siap nih, tapi sepertinya belum dibayar. Yuk selesaikan pembayarannya sekarang sebelum pesanannya kedaluwarsa atau kehabisan stok!"
      },
      data: {
        orderId: order.kodePesanan,
        url: `/pembayaran/${order.kodePesanan}`
      }
    }));

    // 2. Kirim Notifikasi via Firebase Admin
    const response = await getMessaging().sendEach(messages);

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil mengirim ${response.successCount} notifikasi push FCM untuk abandoned orders.`,
      failedCount: response.failureCount
    });

  } catch (error) {
    console.error("Cron Error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan internal server." }, { status: 500 });
  }
}
