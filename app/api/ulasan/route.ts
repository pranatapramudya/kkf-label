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

export async function GET() {
  try {
    const ulasan = await prisma.review.findMany({
      orderBy: { dibuatPada: "desc" },
      take: 20, // Tampilkan maksimal 20 ulasan terbaru
      include: {
        pengguna: { select: { nama: true } },
      },
    });

    const data = ulasan.map((u) => ({
      id: u.id,
      nama: u.namaGuest || u.pengguna?.nama || "Anonim",
      rating: u.rating,
      teks: u.comment,
      lokasi: "Indonesia", // Lokasi default sementara karena ga disimpen di Review
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal mengambil data ulasan" },
      { status: 500 },
    );
  }
}

