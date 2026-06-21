import { NextResponse } from "next/server";

export async function POST(permintaan: Request) {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { pesan: "API Key kosong di .env" },
      { status: 500 },
    );

  try {
    const body = await permintaan.json();

    // Format pengiriman data Komerce V2
    const parameter = new URLSearchParams({
      origin: process.env.RAJAONGKIR_ORIGIN_ID || "440", // Ambil dari env, default 440 (Sumedang)
      destination: body.kotaTujuan,
      weight: String(body.berat ?? 1000),
      courier: body.ekspedisi.toLowerCase(),
    });

    // 🚀 TEMBAK KE KOMERCE V2
    const respons = await fetch(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      {
        method: "POST",
        headers: {
          key: apiKey,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: parameter.toString(),
      },
    );

    const data = await respons.json();

    // Cek kalau Komerce nolak (misal ID kota salah)
    if (data.meta?.status === false) {
      return NextResponse.json(
        { pesan: data.meta.message || "Gagal dari API Komerce" },
        { status: 400 },
      );
    }

    const results = data.data || [];

    // Mapping hasil biaya Komerce
    const daftarBiaya = results.map((layanan: any) => ({
      ekspedisi: body.ekspedisi.toUpperCase(),
      layanan: layanan.service || layanan.name,
      namaLayanan: layanan.description || layanan.service || "Reguler",
      biaya: Number(layanan.cost || layanan.price || 0),
      estimasi: layanan.etd || layanan.estimation || "-",
    }));

    daftarBiaya.sort((a: any, b: any) => a.biaya - b.biaya);

    return NextResponse.json({ daftarBiaya });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal menghitung ongkir", detail: galat.message },
      { status: 500 },
    );
  }
}
