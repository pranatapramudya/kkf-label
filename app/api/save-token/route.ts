import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    // Upsert to ignore if it already exists
    const savedToken = await prisma.adminToken.upsert({
      where: { token },
      update: {},
      create: { token },
    });

    return NextResponse.json({ success: true, savedToken });
  } catch (error: any) {
    console.error("Save token error:", error);
    return NextResponse.json(
      { error: "Failed to save token", details: error.message },
      { status: 500 }
    );
  }
}
