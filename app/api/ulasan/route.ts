import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { produkId, pesananId, rating, comment, namaGuest } =
      await req.json();

    // Cek apakah udah pernah kasih ulasan biar ga dobel
    const ulasanAda = await prisma.review.findFirst({
      where: { produkId, pesananId },
    });

    if (ulasanAda) {
      return NextResponse.json(
        { error: "Produk ini sudah kamu ulas!" },
        { status: 400 },
      );
    }

    // Masukin ulasan ke database
    const ulasanBaru = await prisma.review.create({
      data: { produkId, pesananId, rating, comment, namaGuest },
    });

    return NextResponse.json({ sukses: true, data: ulasanBaru });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengirim ulasan" },
      { status: 500 },
    );
  }
}
