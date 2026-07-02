import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provinceId: string }> },
) {
  const apiKey = process.env.RAJAONGKIR_API_KEY;
  const { provinceId } = await params;
  if (!apiKey)
    return NextResponse.json({ pesan: "API Key kosong" }, { status: 500 });

  try {
    // Tembak ke API Resmi RajaOngkir Starter
    const respons = await fetch(
      `https://api.rajaongkir.com/starter/city?province=${provinceId}`,
      {
        method: "GET",
        headers: { key: apiKey },
        cache: "force-cache",
      },
    );

    const data = await respons.json();
    
    if (data.rajaongkir?.status?.code !== 200) {
       return NextResponse.json(
        { pesan: data.rajaongkir?.status?.description || "Gagal mengambil kabupaten dari RajaOngkir" },
        { status: 400 }
      );
    }

    const results = data.rajaongkir.results || [];

    const daftarKabupaten = results.map((c: any) => ({
      id: String(c.city_id),
      nama: c.type ? `${c.type} ${c.city_name}` : c.city_name,
      kodepos: c.postal_code || "",
    }));

    return NextResponse.json(daftarKabupaten);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat kabupaten dari RajaOngkir" },
      { status: 500 },
    );
  }
}
