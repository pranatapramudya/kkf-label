import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [ulasanRaw, totalUlasan] = await Promise.all([
      prisma.review.findMany({
        orderBy: { dibuatPada: "desc" },
        take: 20,
        select: {
          id: true,
          produkId: true,
          rating: true,
          comment: true,
          dibuatPada: true,
          adminReply: true,
          namaGuest: true,
          produk: { select: { nama: true } },
          pengguna: { select: { nama: true, email: true } },
        },
      }).catch(() => []),
      prisma.review.count().catch(() => 0),
    ]);
    const ulasan = ulasanRaw as any[];

    const dataTampil = ulasan.map((u) => ({
      id: u.id,
      produkId: u.produkId,
      namaProduk: u.produk?.nama || "Produk Dihapus",
      rating: u.rating,
      comment: u.comment,
      dibuatPada: u.dibuatPada,
      adminReply: u.adminReply,
      // Prioritaskan namaGuest jika ada, kalau tidak pakai nama akun
      namaReviewer: u.namaGuest || u.pengguna?.nama || "Anonim",
    }));

    return NextResponse.json({ data: dataTampil, total: totalUlasan });
  } catch (error: any) {
    console.error("🔥 Error Fetch Ulasan:", error.message);
    return NextResponse.json(
      { pesan: "Gagal menarik data ulasan" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, adminReply } = await req.json();
    if (!id) return NextResponse.json({ pesan: "ID Ulasan diperlukan" }, { status: 400 });

    const ulasan = await prisma.review.update({
      where: { id },
      data: { adminReply },
    });

    return NextResponse.json({ pesan: "Balasan berhasil disimpan", ulasan });
  } catch (error: any) {
    console.error("🔥 Error Balas Ulasan:", error.message);
    return NextResponse.json(
      { pesan: "Gagal menyimpan balasan ulasan" },
      { status: 500 }
    );
  }
}
