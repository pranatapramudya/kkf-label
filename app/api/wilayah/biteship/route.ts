import { NextResponse } from "next/server";

export const revalidate = 2592000; // Cache 30 hari

export async function GET(req: Request) {
  const apiKey = process.env.BITESHIP_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ pesan: "API Key BiteShip kosong" }, { status: 500 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const input = searchParams.get("input") || "";

    if (!input || input.length < 3) {
      return NextResponse.json({ areas: [] });
    }

    const respons = await fetch(
      `https://api.biteship.com/v1/maps/areas?countries=ID&input=${encodeURIComponent(input)}&type=single`,
      {
        method: "GET",
        headers: {
          "Authorization": apiKey,
        },
        next: { revalidate: 2592000 },
      }
    );

    const data = await respons.json();

    if (!respons.ok || !data.success) {
      return NextResponse.json(
        { pesan: data.error || "Gagal mencari area di BiteShip" },
        { status: 400 }
      );
    }

    return NextResponse.json({ areas: data.areas || [] });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Terjadi kesalahan server", detail: galat.message },
      { status: 500 }
    );
  }
}
