import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { produkId } = await request.json();

    if (!produkId) {
      return NextResponse.json(
        { error: "ID Produk wajib dikirim" },
        { status: 400 },
      );
    }

    // Tambah viewCount +1 di database
    const produkDiperbarui = await prisma.product.update({
      where: { id: produkId },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ sukses: true, data: produkDiperbarui });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal memperbarui analitik" },
      { status: 500 },
    );
  }
}
