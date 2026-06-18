import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    // 1. Cari user yang riwayat pesanannya sudah "SELESAI"
    const pelangganSetia = await prisma.user.findMany({
      where: {
        pesanan: {
          some: { statusPesanan: "SELESAI" },
        },
      },
      select: { nama: true, email: true },
    });

    // 2. Simulasi pengiriman email (Mock-up)
    console.log(
      `Mempersiapkan broadcast promo ke ${pelangganSetia.length} pelanggan...`,
    );

    pelangganSetia.forEach((pelanggan) => {
      console.log(
        `Mengirim email ke: ${pelanggan.email} (Hai ${pelanggan.nama}, ada promo baru nih!)`,
      );
    });

    return NextResponse.json({
      pesan: "Broadcast berhasil dikirim",
      jumlahPenerima: pelangganSetia.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal mengirim broadcast" },
      { status: 500 },
    );
  }
}
