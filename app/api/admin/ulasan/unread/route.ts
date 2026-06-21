import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const count = await prisma.review.count({
      where: {
        OR: [
          { adminReply: null },
          { adminReply: "" }
        ]
      },
    });

    return NextResponse.json({ count });
  } catch (error: any) {
    console.error("Gagal mengambil data ulasan unread:", error.message);
    return NextResponse.json({ count: 0 }, { status: 500 });
  }
}
