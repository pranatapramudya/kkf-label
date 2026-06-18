import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const idProduk = body.id || body.produkId;

    if (!idProduk) {
      return NextResponse.json(
        { error: "ID Produk wajib dikirim" },
        { status: 400 },
      );
    }

    // 🔥 FIX: Pakai 'product' dan 'viewCount' sesuai schema Prisma lu
    const produkDiperbarui = await prisma.product.update({
      where: { id: idProduk },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ sukses: true, data: produkDiperbarui });
  } catch (error) {
    console.error("Gagal update views:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui analitik" },
      { status: 500 },
    );
  }
}
