import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(permintaan: Request) {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey)
    return NextResponse.json(
      { pesan: "API Key BiteShip kosong di .env" },
      { status: 500 },
    );

  try {
    const body = await permintaan.json();

    if (!body.areaIdTujuan) {
      return NextResponse.json(
        { pesan: "Area tujuan tidak ditemukan. Silakan cari dan pilih ulang kecamatan Anda." },
        { status: 400 }
      );
    }

    const payload = {
      origin_area_id: "IDNP9IDNC430IDND5356", // Area ID untuk Cimalaka, Sumedang (KKF Label)
      destination_area_id: body.areaIdTujuan,
      couriers: body.ekspedisi.toLowerCase(),
      items: [
        {
          name: "Produk KKF",
          description: "Pesanan Pakaian KKF Label",
          value: 100000,
          length: 10,
          width: 10,
          height: 10,
          weight: body.berat ?? 1000,
          quantity: 1
        }
      ]
    };

    const respons = await fetch(
      "https://api.biteship.com/v1/rates/couriers",
      {
        method: "POST",
        headers: {
          "Authorization": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        cache: "no-store",
      },
    );

    const data = await respons.json();

    if (!respons.ok || !data.success) {
      const errorMsg = data.error || data.message || "Gagal mengambil tarif pengiriman dari BiteShip";
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    const results = data.pricing || [];

    const daftarBiaya = results.map((layanan: any) => ({
      ekspedisi: layanan.courier_name || body.ekspedisi.toUpperCase(),
      layanan: layanan.courier_service_code || layanan.courier_service_name,
      namaLayanan: layanan.courier_service_name || "Reguler",
      biaya: Number(layanan.price || 0),
      estimasi: layanan.duration || "-",
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
