import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.SHIPPING_API_KEY;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // 🚀 TEMBAK KE KOMERCE V2
    const respons = await fetch(
      "https://rajaongkir.komerce.id/api/v1/destination/province",
      {
        method: "GET",
        headers: { key: apiKey },
        cache: "force-cache",
      },
    );

    const data = await respons.json();

    // Struktur data Komerce ada di dalam "data"
    const results = data.data || [];
    const daftarProvinsi = results.map((p: any) => ({
      id: String(p.id),
      nama: p.name,
    }));

    return NextResponse.json(daftarProvinsi);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat provinsi Komerce" },
      { status: 500 },
    );
  }
}
