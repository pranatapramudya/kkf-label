import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { waybill, courier } = await req.json();
    const apiKey = process.env.BITESHIP_API_KEY;

    if (!waybill || !courier) {
      return NextResponse.json({ error: "Nomor resi dan kurir wajib diisi" }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: "Konfigurasi server tidak lengkap" }, { status: 500 });
    }

    const response = await fetch(`https://api.biteship.com/v1/trackings/${waybill}/couriers/${courier.toLowerCase()}`, {
      method: 'GET',
      headers: {
        'Authorization': apiKey,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Gagal melacak resi via Biteship");
    }

    return NextResponse.json({ success: true, tracking: data });
  } catch (error: any) {
    console.error("🔥 Error Tracking Biteship:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
