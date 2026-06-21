import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { affiliateId, namaLengkap, whatsapp, namaBank, noRekening } = body;

    if (!affiliateId || !namaLengkap || !whatsapp) {
      return NextResponse.json({ error: "Data wajib belum lengkap" }, { status: 400 });
    }

    const upserted = await prisma.affiliate.upsert({
      where: { id: affiliateId },
      update: {
        namaLengkap,
        whatsapp,
        namaBank,
        noRekening
      },
      create: {
        id: affiliateId,
        namaLengkap,
        whatsapp,
        namaBank,
        noRekening
      }
    });

    return NextResponse.json({ success: true, data: upserted });
  } catch (error: any) {
    console.error("🔥 Error Upsert Affiliate Profile:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan profil" },
      { status: 500 }
    );
  }
}
