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
    // 🚀 TEMBAK KE KOMERCE V2
    const respons = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`,
      {
        method: "GET",
        headers: { key: apiKey },
        cache: "force-cache",
      },
    );

    const data = await respons.json();
    const results = data.data || [];

    const daftarKabupaten = results.map((c: any) => ({
      id: String(c.id),
      nama: c.name,
      kodepos: c.postal_code || "",
    }));

    return NextResponse.json(daftarKabupaten);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat kabupaten Komerce" },
      { status: 500 },
    );
  }
}
