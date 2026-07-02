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
    const respons = await fetch(
      `https://rajaongkir.komerce.id/api/v1/destination/city/${provinceId}`,
      {
        method: "GET",
        headers: { key: apiKey },
        cache: "no-store",
      },
    );

    const data = await respons.json();

    if (data.meta?.status === false || data.meta?.status === "error" || data.meta?.code >= 400) {
      let errorMsg = data.meta?.message || "Gagal mengambil kabupaten dari Komerce";
      if (errorMsg.toLowerCase().includes("limit")) {
        errorMsg = "Gagal memuat wilayah: Limit harian API Komerce telah habis.";
      }
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    const results = data.data || [];

    // Bungkus ke format RajaOngkir agar frontend tidak patah
    return NextResponse.json({
      rajaongkir: {
        results: results.map((c: any) => ({
          city_id: String(c.id),
          city_name: c.name,
          type: c.type || "",
          postal_code: c.postal_code || "",
        }))
      }
    });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal memuat kabupaten Komerce", detail: galat.message },
      { status: 500 },
    );
  }
}
