import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Cari semua pesanan yang statusnya SELESAI
    const pesananSelesai = await prisma.order.findMany({
      where: {
        statusPesanan: "SELESAI",
      },
      select: {
        namaPenerima: true,
        teleponPenerima: true,
        emailPenerima: true,
        dibuatPada: true,
        total: true,
      },
      orderBy: {
        dibuatPada: "desc",
      },
    });

    // Ambil pelanggan unik berdasarkan nomor telepon
    const pelangganMap = new Map();
    for (const p of pesananSelesai) {
      if (!pelangganMap.has(p.teleponPenerima)) {
        pelangganMap.set(p.teleponPenerima, {
          nama: p.namaPenerima,
          telepon: p.teleponPenerima,
          email: p.emailPenerima,
          totalBelanja: p.total,
          pesananTerakhir: p.dibuatPada,
          jumlahPesanan: 1,
        });
      } else {
        const exist = pelangganMap.get(p.teleponPenerima);
        exist.totalBelanja += p.total;
        exist.jumlahPesanan += 1;
      }
    }

    const daftarPelanggan = Array.from(pelangganMap.values());

    return NextResponse.json(daftarPelanggan);
  } catch (error) {
    console.error("Error Promosi API:", error);
    return NextResponse.json(
      { pesan: "Gagal mengambil data pelanggan loyal." },
      { status: 500 }
    );
  }
}
