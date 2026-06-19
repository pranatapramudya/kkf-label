import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");

    if (!bulan || !tahun) {
      return NextResponse.json({ pesan: "Bulan dan Tahun wajib diisi" }, { status: 400 });
    }

    const tBulan = parseInt(bulan);
    const tTahun = parseInt(tahun);

    let tanggalMulai, tanggalAkhir;

    if (tBulan === -1) {
      // Semua Bulan
      tanggalMulai = new Date(tTahun, 0, 1);
      tanggalAkhir = new Date(tTahun, 11, 31, 23, 59, 59);
    } else {
      tanggalMulai = new Date(tTahun, tBulan, 1);
      tanggalAkhir = new Date(tTahun, tBulan + 1, 0, 23, 59, 59);
    }

    // Ambil pesanan SELESAI
    const pesananSelesai = await prisma.order.findMany({
      where: {
        dibuatPada: {
          gte: tanggalMulai,
          lte: tanggalAkhir,
        },
        statusPesanan: "SELESAI",
      },
      select: { total: true },
    });

    const totalPendapatan = pesananSelesai.reduce((sum, order) => sum + order.total, 0);

    return NextResponse.json({ totalPendapatan });
  } catch (error) {
    console.error("Error Kalkulator:", error);
    return NextResponse.json({ pesan: "Gagal menghitung profit." }, { status: 500 });
  }
}
