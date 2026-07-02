import { NextResponse } from "next/server";

export async function POST(permintaan: Request) {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { pesan: "API Key Biteship kosong di .env" },
      { status: 500 },
    );

  try {
    const body = await permintaan.json();

    const payload = {
      // Default menggunakan ID Area Sumedang Selatan, bisa diganti sesuai alamat toko 
      origin_area_id: process.env.BITESHIP_ORIGIN_ID || "IDNP9IDNC430IDND5371", 
      destination_area_id: body.kotaTujuan, // Berasal dari city_id BiteShip dari dropdown kedua
      couriers: body.ekspedisi.toLowerCase(),
      items: [
        {
          name: "Barang Pesanan",
          value: 100000,
          weight: Number(body.berat ?? 1000),
          quantity: 1
        }
      ]
    };

    const respons = await fetch(
      "https://api.biteship.com/v1/rates/couriers",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      },
    );

    const data = await respons.json();

    if (!data.success) {
      return NextResponse.json(
        { pesan: data.error || "Gagal menghitung ongkir dari API Biteship" },
        { status: 400 },
      );
    }

    const results = data.pricing || [];

    // Map array Biteship "pricing" ke struktur frontend "daftarBiaya"
    const daftarBiaya = results.map((layanan: any) => ({
      ekspedisi: layanan.courier_name.toUpperCase(),
      layanan: layanan.courier_service_name,
      namaLayanan: layanan.courier_service_name,
      biaya: Number(layanan.price || 0),
      estimasi: layanan.duration || "-",
    }));

    daftarBiaya.sort((a: any, b: any) => a.biaya - b.biaya);

    return NextResponse.json({ daftarBiaya });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal menghitung tarif logistik", detail: galat.message },
      { status: 500 },
    );
  }
}
