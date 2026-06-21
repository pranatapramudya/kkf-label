import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.order.count({
      where: {
        statusPesanan: "MENUNGGU_PEMBAYARAN",
      },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Gagal mengambil data pesanan pending:", error.message);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
