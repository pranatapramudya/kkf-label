import { NextResponse } from "next/server";

export const revalidate = 2592000; // Cache 30 hari

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // 🚀 TEMBAK KE KOMERCE V2
    const respons = await fetch(
      "https://rajaongkir.komerce.id/api/v1/destination/province",
      {
        method: "GET",
        headers: { Key: apiKey },
        next: { revalidate: 2592000 },
      },
    );

    const data = await respons.json();

    if (data.meta?.status === false || data.meta?.status === "error" || data.meta?.code >= 400) {
      let errorMsg = data.meta?.message || "Gagal mengambil provinsi dari Komerce";
      if (errorMsg.toLowerCase().includes("limit")) {
        errorMsg = "Gagal memuat wilayah: Limit harian API Komerce telah habis.";
      }
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    const results = data.data || [];
    
    const daftarProvinsi = results.map((p: any) => ({
      id: String(p.id),
      nama: p.name,
    }));

    return NextResponse.json({ data: daftarProvinsi });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat provinsi Komerce", detail: galat.message },
      { status: 500 },
    );
  }
}
