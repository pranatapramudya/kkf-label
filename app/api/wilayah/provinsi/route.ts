import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // Tembak ke API Resmi RajaOngkir Starter
    const respons = await fetch("https://api.rajaongkir.com/starter/province", {
      method: "GET",
      headers: { key: apiKey },
      cache: "force-cache",
    });

    const data = await respons.json();

    if (data.rajaongkir?.status?.code !== 200) {
      return NextResponse.json(
        { pesan: data.rajaongkir?.status?.description || "Gagal mengambil provinsi dari RajaOngkir" },
        { status: 400 }
      );
    }

    const results = data.rajaongkir.results || [];
    const daftarProvinsi = results.map((p: any) => ({
      id: String(p.province_id),
      nama: p.province,
    }));

    return NextResponse.json(daftarProvinsi);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat provinsi dari RajaOngkir" },
      { status: 500 },
    );
  }
}
