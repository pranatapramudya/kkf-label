import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// 🔥 INI KUNCINYA BIAR REAL-TIME & GAK DI-CACHE SAMA NEXT.JS 🔥
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const take = 20;
    const skip = (page - 1) * take;

    const [pesanan, total] = await Promise.all([
      prisma.order.findMany({
        orderBy: { dibuatPada: "desc" },
        include: { item: true },
        take,
        skip,
      }),
      prisma.order.count(),
    ]);

    return NextResponse.json({
      data: pesanan,
      total,
      page,
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    return NextResponse.json(
      { pesan: "Gagal menarik data pesanan" },
      { status: 500 },
    );
  }
}
