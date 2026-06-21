import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // 1. Ambil semua profil affiliate (bersama user-nya jika ada)
    const affiliates = await prisma.affiliate.findMany({
      include: {
        user: true, // Berdasarkan instruksi PRD
      },
      orderBy: {
        dibuatPada: 'desc'
      }
    });

    // 2. Jika admin belum punya affiliate terdaftar, kembalikan kosong
    if (!affiliates || affiliates.length === 0) {
      return NextResponse.json([]);
    }

    // 3. Tarik agregasi pesanan yang sukses untuk melihat performa mereka
    const orderStats = await prisma.order.groupBy({
      by: ["affiliateId"],
      _count: {
        id: true,
      },
      _sum: {
        total: true,
      },
      where: {
        affiliateId: { in: affiliates.map(a => a.id) },
        statusPesanan: {
          in: ["SELESAI", "SAMPAI"],
        },
      },
    });

    // Buat map pencarian cepat untuk statistik
    const statMap = new Map();
    orderStats.forEach(stat => {
      statMap.set(stat.affiliateId, {
        totalPesanan: stat._count.id,
        totalPendapatan: stat._sum.total || 0,
      });
    });

    // 4. Gabungkan data
    const data = affiliates.map((af) => {
      const stats = statMap.get(af.id) || { totalPesanan: 0, totalPendapatan: 0 };
      
      return {
        affiliateId: af.id,
        nama: af.namaLengkap,
        whatsapp: af.whatsapp,
        totalPesanan: stats.totalPesanan,
        totalPendapatan: stats.totalPendapatan,
      };
    });

    // Urutkan berdasarkan total pendapatan tertinggi
    data.sort((a, b) => b.totalPendapatan - a.totalPendapatan);

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("🔥 Error Fetch Affiliate:", error);
    return NextResponse.json(
      { pesan: "Gagal mengambil data Affiliate" },
      { status: 500 }
    );
  }
}
