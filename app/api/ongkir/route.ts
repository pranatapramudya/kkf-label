import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(permintaan: Request) {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { pesan: "API Key kosong di .env" },
      { status: 500 },
    );

  try {
    const body = await permintaan.json();

    const parameter = new URLSearchParams({
      origin: process.env.RAJAONGKIR_ORIGIN_ID || "440", // Ambil dari env, default 440 (Sumedang)
      destination: body.kotaTujuan,
      weight: String(body.berat ?? 1000),
      courier: body.ekspedisi.toLowerCase(),
    });

    const respons = await fetch(
      "https://rajaongkir.komerce.id/api/v1/calculate/domestic-cost",
      {
        method: "POST",
        headers: {
          key: apiKey,
          "content-type": "application/x-www-form-urlencoded",
        },
        body: parameter.toString(),
        cache: "no-store",
      },
    );

    const data = await respons.json();

    if (data.meta?.status === false || data.meta?.status === "error" || data.meta?.code >= 400) {
      let errorMsg = data.meta?.message || "Gagal dari API Komerce";
      const lowerMsg = errorMsg.toLowerCase();
      if (lowerMsg.includes("limit")) {
        errorMsg = "Limit harian akses logistik telah habis.";
      } else if (lowerMsg.includes("courier")) {
        errorMsg = "Kurir tidak tersedia untuk rute atau berat ini.";
      } else if (lowerMsg.includes("destination") || lowerMsg.includes("origin")) {
        errorMsg = "Titik pengiriman atau kota tujuan tidak valid.";
      }
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    const results = data.data || [];

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
