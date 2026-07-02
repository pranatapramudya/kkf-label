import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // Tembak murni ke API Resmi RajaOngkir Starter
    const respons = await fetch("https://api.rajaongkir.com/starter/province", {
      method: "GET",
      headers: { key: apiKey },
      cache: "no-store", // Hindari cache error saat build/runtime
    });

    const data = await respons.json();

    // Validasi Limit Harian / Error dari RajaOngkir
    if (data.rajaongkir?.status?.code !== 200) {
      return NextResponse.json(
        { pesan: data.rajaongkir?.status?.description || "Gagal mengambil provinsi. Kemungkinan limit harian RajaOngkir habis." },
        { status: 400 }
      );
    }

    // Kembalikan struktur asli JSON RajaOngkir agar kompatibel dengan frontend (data.rajaongkir.results)
    return NextResponse.json(data);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat provinsi dari RajaOngkir", detail: galat.message },
      { status: 500 },
    );
  }
}
