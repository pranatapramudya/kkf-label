import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provinceId: string }> },
) {
  const apiKey = process.env.BITESHIP_API_KEY;
  const { provinceId } = await params;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // Mencari area berdasarkan nama provinsi yang dikirim dari dropdown pertama
    const respons = await fetch(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(provinceId)}`,
      {
        method: "GET",
        headers: { Authorization: apiKey },
        cache: "no-store",
      },
    );

    const data = await respons.json();

    if (!data.success) {
      return NextResponse.json(
        { pesan: data.error || "Gagal mengambil area dari Biteship" },
        { status: 400 }
      );
    }

    const results = data.areas || [];

    // Mengambil area unik agar dropdown tidak kepenuhan hasil kodepos ganda
    const uniqueAreas = [];
    const map = new Map();
    for (const item of results) {
      if (!map.has(item.name)) {
        map.set(item.name, true);
        uniqueAreas.push({
          city_id: item.id, // Ini adalah Area ID BiteShip (yang digunakan di API Ongkir)
          city_name: item.name, 
          type: item.administrative_division_level_3_type || "Area",
          postal_code: item.postal_code || "",
        });
      }
    }

    // Dibungkus ke dalam format RajaOngkir agar frontend dapat memetakan data dengan baik
    return NextResponse.json({
      rajaongkir: {
        results: uniqueAreas
      }
    });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat kabupaten dari Biteship", detail: galat.message },
      { status: 500 },
    );
  }
}
