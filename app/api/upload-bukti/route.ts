import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@supabase/supabase-js";

const prisma = new PrismaClient();

// Inisialisasi Supabase Admin Client dengan Service Role Key untuk membypass RLS
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const invoice = formData.get("invoice") as string | null;

    if (!file || !invoice) {
      return NextResponse.json(
        { success: false, message: "File dan nomor invoice wajib disertakan." },
        { status: 400 }
      );
    }

    // 1. Ekstrak file menjadi Buffer agar kompatibel dengan Node.js & Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const fileExt = file.name.split(".").pop();
    const fileName = `bukti-${invoice}-${Date.now()}.${fileExt}`;

    // 2. Upload ke Supabase Storage menggunakan Admin Client
    const { error: uploadError } = await supabaseAdmin.storage
      .from("bukti-transfer")
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error("ERROR SUPABASE UPLOAD:", uploadError);
      return NextResponse.json(
        { success: false, message: `Gagal upload ke Supabase: ${uploadError.message}` },
        { status: 500 }
      );
    }

    // 3. Dapatkan Public URL menggunakan Admin Client
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("bukti-transfer")
      .getPublicUrl(fileName);

    const publicUrl = publicUrlData.publicUrl;

    if (!publicUrl) {
      return NextResponse.json(
        { success: false, message: "Berhasil upload, namun gagal mendapatkan URL publik Supabase." },
        { status: 500 }
      );
    }

    // 4. Update Database Prisma
    try {
      const orderUpdated = await prisma.order.update({
        where: { kodePesanan: invoice },
        data: {
          buktiTransferUrl: publicUrl,
          statusPesanan: "MENUNGGU_VERIFIKASI",
        },
      });

      return NextResponse.json({
        success: true,
        message: "Bukti transfer berhasil diunggah.",
        data: orderUpdated,
      });
    } catch (prismaError: any) {
      console.error("ERROR PRISMA UPDATE:", prismaError);
      return NextResponse.json(
        { success: false, message: `Gagal update status di database: ${prismaError.message}` },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error("=== FATAL ERROR API ===", error);
    return NextResponse.json(
      { success: false, message: `Kesalahan internal server: ${error.message}` },
      { status: 500 }
    );
  }
}
