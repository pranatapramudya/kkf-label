import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
    const kontakLower = kontak.trim().toLowerCase();

    const pesanan = await prisma.order.findMany({
      where: {
        OR: [
          { emailPenerima: { equals: kontakLower, mode: "insensitive" } },
          { teleponPenerima: kontak.trim() },
        ],
      },
      include: {
        item: {
          include: {
            produk: { select: { fotoUtama: true, harga: true, hargaCoret: true, diskonPersen: true } },
          },
        },
      },
      orderBy: { dibuatPada: "desc" },
    });

    console.log(`[API Pesanan User] Kontak: "${kontak}" | Hasil: ${pesanan.length} pesanan ditemukan`);

    return NextResponse.json(pesanan);
  } catch (error) {
    console.error("[API Pesanan User] ERROR:", error);
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
