import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { statusPesanan, ekspedisi, nomorResi } = body;

    const updateOrder = await prisma.order.update({
      where: { id: params.id },
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
