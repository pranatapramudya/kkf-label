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

    const parameter = new URLSearchParams({
      origin: process.env.RAJAONGKIR_ORIGIN_ID || "440", // 440 = Sumedang
      destination: body.kotaTujuan,
      weight: String(body.berat ?? 1000),
      courier: body.ekspedisi.toLowerCase(),
    });

    // Tembak ke API Resmi RajaOngkir Starter
    const respons = await fetch("https://api.rajaongkir.com/starter/cost", {
      method: "POST",
      headers: {
        key: apiKey,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: parameter.toString(),
    });

    const data = await respons.json();

    // Cek error dari RajaOngkir
    if (data.rajaongkir?.status?.code !== 200) {
      return NextResponse.json(
        { pesan: data.rajaongkir?.status?.description || "Gagal mengambil ongkir dari RajaOngkir" },
        { status: 400 },
      );
    }

    const results = data.rajaongkir.results || [];
    
    // Transformasi data agar sesuai dengan format yang diharapkan oleh frontend
    const daftarBiaya: any[] = [];

    if (results.length > 0 && results[0].costs) {
      results[0].costs.forEach((layanan: any) => {
        if (layanan.cost && layanan.cost.length > 0) {
          const detailBiaya = layanan.cost[0];
          daftarBiaya.push({
            ekspedisi: body.ekspedisi.toUpperCase(),
            layanan: layanan.service,
            namaLayanan: layanan.description || layanan.service,
            biaya: Number(detailBiaya.value || 0),
            estimasi: detailBiaya.etd || "-",
          });
        }
      });
    }

    // Urutkan biaya dari yang termurah
    daftarBiaya.sort((a: any, b: any) => a.biaya - b.biaya);

    return NextResponse.json({ daftarBiaya });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Terjadi kesalahan saat menghitung ongkir", detail: galat.message },
      { status: 500 },
    );
  }
}
