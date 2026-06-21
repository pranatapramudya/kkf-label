import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const ulasan = await prisma.review.findMany({
      orderBy: { dibuatPada: "desc" },
      include: {
        produk: {
          select: { nama: true },
        },
        pengguna: {
          select: { nama: true, email: true },
        },
      },
    });

    const dataTampil = ulasan.map((u) => ({
      id: u.id,
      produkId: u.produkId,
      namaProduk: u.produk?.nama || "Produk Dihapus",
      rating: u.rating,
      comment: u.comment,
      dibuatPada: u.dibuatPada,
      balasanAdmin: u.balasanAdmin,
      // Prioritaskan namaGuest jika ada, kalau tidak pakai nama akun
      namaReviewer: u.namaGuest || u.pengguna?.nama || "Anonim",
    }));

    return NextResponse.json(dataTampil);
  } catch (error: any) {
    console.error("🔥 Error Fetch Ulasan:", error.message);
    return NextResponse.json(
      { pesan: "Gagal menarik data ulasan" },
      { status: 500 }
    );
  }
}
