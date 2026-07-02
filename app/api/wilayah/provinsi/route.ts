import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    const respons = await fetch(
      "https://rajaongkir.komerce.id/api/v1/destination/province",
      {
        method: "GET",
        headers: { key: apiKey },
        cache: "no-store",
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
    
    // Bungkus ke format RajaOngkir agar frontend tidak patah
    return NextResponse.json({
      rajaongkir: {
        results: results.map((p: any) => ({
          province_id: String(p.id),
          province: p.name,
        }))
      }
    });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat provinsi Komerce", detail: galat.message },
      { status: 500 },
    );
  }
}
