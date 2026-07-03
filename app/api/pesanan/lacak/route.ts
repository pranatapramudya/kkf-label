import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const kode = searchParams.get("kode");

    if (!kode) {
      return NextResponse.json(
        { error: "Kode ID Pesanan wajib diisi" },
        { status: 400 },
      );
    }

    // Bersihkan spasi atau tanda pagar (#) jika tidak sengaja terketik oleh user
    const kodeBersih = kode.replace("#", "").trim();

    // Cari pesanan berdasarkan kodePesanan unik di database
    const dataPesanan = await prisma.order.findUnique({
      where: { kodePesanan: kodeBersih },
      select: {
        kodePesanan: true,
        statusPesanan: true,
        ekspedisi: true,
        namaPenerima: true,
        total: true,
        dibuatPada: true,
        nomorResi: true,
        buktiTransferUrl: true,
      },
    });

    if (!dataPesanan) {
      return NextResponse.json(
        {
          error:
            "Kode pesanan tidak ditemukan. Periksa kembali penulisan huruf besar/kecilnya.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({ sukses: true, data: dataPesanan });
  } catch (error) {
    return NextResponse.json(
      { error: "Terjadi kesalahan internal pada server" },
      { status: 500 },
    );
  }
}
