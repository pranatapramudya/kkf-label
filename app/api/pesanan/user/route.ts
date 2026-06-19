import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// FUNGSI NARIK DATA PESANAN PEMBELI + FOTO REALTIME
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const kontak = searchParams.get("kontak");

  if (!kontak)
    return NextResponse.json(
      { error: "Kontak tidak ditemukan" },
      { status: 400 },
    );

  try {
    const pesanan = await prisma.order.findMany({
      where: {
        OR: [{ emailPenerima: kontak }, { teleponPenerima: kontak }],
      },
      // 🔥 FIX: Ambil data item pesanan SEKALIGUS narik foto dari tabel Produk
      include: {
        item: {
          include: {
            produk: { select: { fotoUtama: true } },
          },
        },
      },
      orderBy: { dibuatPada: "desc" },
    });
    return NextResponse.json(pesanan);
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal menarik data pesanan" },
      { status: 500 },
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const { idPesanan, status } = await req.json();
    const updatePesanan = await prisma.order.update({
      where: { id: idPesanan },
      data: { statusPesanan: status },
    });
    return NextResponse.json({ sukses: true, data: updatePesanan });
  } catch (error) {
    return NextResponse.json(
      { error: "Gagal update pesanan" },
      { status: 500 },
    );
  }
}
