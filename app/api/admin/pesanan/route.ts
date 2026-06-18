import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// 🔥 INI KUNCINYA BIAR REAL-TIME & GAK DI-CACHE SAMA NEXT.JS 🔥
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const pesanan = await prisma.order.findMany({
      orderBy: { dibuatPada: "desc" },
      include: { item: true },
    });
    return NextResponse.json(pesanan);
  } catch (error) {
    return NextResponse.json(
      { pesan: "Gagal menarik data pesanan" },
      { status: 500 },
    );
  }
}
