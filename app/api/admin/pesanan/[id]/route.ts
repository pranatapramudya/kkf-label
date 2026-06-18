import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  // 🔥 FIX 1: Ubah tipe params menjadi Promise
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await request.json();
    const { statusPesanan, ekspedisi, nomorResi } = body;

    // 🔥 FIX 2: Kita "tunggu" (await) params-nya kebuka dulu sebelum diambil id-nya
    const resolvedParams = await params;

    const updateOrder = await prisma.order.update({
      // 🔥 FIX 3: Gunakan id dari params yang sudah di-await
      where: { id: resolvedParams.id },
      data: {
        statusPesanan,
        ekspedisi: ekspedisi || null,
        nomorResi: nomorResi || null,
      },
    });

    return NextResponse.json({
      pesanan: "Mantap bos! Status pesanan berhasil diupdate.",
      data: updateOrder,
    });
  } catch (galat: any) {
    console.error("🔥 Error Update Pesanan:", galat.message);
    return NextResponse.json(
      { pesan: "Gagal update pesanan: " + galat.message },
      { status: 500 },
    );
  }
}
