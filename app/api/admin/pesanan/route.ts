import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

// 🔥 INI KUNCINYA BIAR REAL-TIME & GAK DI-CACHE SAMA NEXT.JS 🔥
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const month = searchParams.get("month");
    const year = searchParams.get("year");
    
    const take = 20;
    const skip = (page - 1) * take;

    let where: any = {};
    if (month && month !== "semua" && year && year !== "semua") {
      const startDate = new Date(parseInt(year), parseInt(month), 1);
      const endDate = new Date(parseInt(year), parseInt(month) + 1, 1);
      where.dibuatPada = { gte: startDate, lt: endDate };
    } else if (year && year !== "semua") {
      const startDate = new Date(parseInt(year), 0, 1);
      const endDate = new Date(parseInt(year) + 1, 0, 1);
      where.dibuatPada = { gte: startDate, lt: endDate };
    }

    const [pesanan, total] = await Promise.all([
      prisma.order.findMany({
        where,
        orderBy: { dibuatPada: "desc" },
        include: { item: true },
        take,
        skip,
      }),
      prisma.order.count({ where }),
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
