import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

let cachedOriginAreaId: string | null = null;

async function getOriginAreaId(apiKey: string) {
  if (cachedOriginAreaId) return cachedOriginAreaId;
  try {
    const res = await fetch("https://api.biteship.com/v1/maps/areas?countries=ID&input=Cimalaka&type=single", {
      headers: { "Authorization": apiKey }
    });
    const data = await res.json();
    if (data.success && data.areas && data.areas.length > 0) {
      const cimalaka = data.areas.find((a: any) => 
        a.administrative_division_level_3_name?.toLowerCase() === "cimalaka" &&
        a.administrative_division_level_2_name?.toLowerCase() === "sumedang"
      ) || data.areas[0];
      
      if (cimalaka?.id) {
        cachedOriginAreaId = cimalaka.id;
        return cachedOriginAreaId;
      }
    }
  } catch (err) {
    console.error("Gagal memuat origin area id otomatis", err);
  }
  return "IDNP9IDNC430IDND5356"; // Fallback darurat
}

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

    const defaultItems = [
      {
        name: "Produk KKF Label",
        value: 150000,
        quantity: 1,
        weight: 250
      }
    ];

    const originId = await getOriginAreaId(apiKey);

    const payload: any = {
      origin_area_id: originId,
      destination_area_id: body.areaIdTujuan,
      couriers: body.ekspedisi.toLowerCase(),
      items: body.items && body.items.length > 0 ? body.items : defaultItems
    };

    // FIX: Kurir Instant Gojek sering membutuhkan koordinat pasti agar tidak error "No courier available"
    if (payload.couriers === 'gojek') {
      // Hardcode default origin/dest koordinat untuk sementara jika belum dinamis
      payload.origin_latitude = -6.8398;
      payload.origin_longitude = 107.9405;
      payload.destination_latitude = -6.8188;
      payload.destination_longitude = 107.9472;
    }

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
      let errorMsg = data.error || data.message || "Gagal mengambil tarif pengiriman dari BiteShip";
      if (payload.couriers === 'gojek') {
        errorMsg = "Maaf, pengiriman Instan (Gojek) saat ini hanya melayani wilayah Sumedang dan sekitarnya (Maks 40km). Silakan pilih ekspedisi Reguler.";
      }
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    const results = data.pricing || [];

    const filteredPricing = results.filter((layanan: any) => {
      const courier = (layanan.courier_name || body.ekspedisi).toLowerCase();
      const service = (layanan.courier_service_code || layanan.courier_service_name).toLowerCase();
      
      if (courier === 'jnt' || courier === 'j&t') return service === 'ez';
      if (courier === 'jne') return service === 'reg' || service.includes('reguler');
      if (courier === 'sicepat') return service === 'reg' || service === 'best';
      if (courier === 'pos' || courier === 'pos indonesia') return service === 'pos reguler' || service === 'reg' || service.includes('reguler');
      if (courier === 'gojek') return service.includes('instant') || service.includes('same day') || service.includes('sameday');
      return false;
    });

    const daftarBiaya = filteredPricing.map((layanan: any) => ({
      ekspedisi: layanan.courier_name || body.ekspedisi.toUpperCase(),
      layanan: layanan.courier_service_code || layanan.courier_service_name,
      namaLayanan: layanan.courier_service_name || "Reguler",
      biaya: Number(layanan.price || 0),
      estimasi: layanan.duration || "-",
    }));

    if (daftarBiaya.length === 0) {
      let errorMsg = "Layanan pengiriman tidak tersedia untuk rute ini.";
      if (payload.couriers === 'gojek') {
        errorMsg = "Maaf, pengiriman Instan (Gojek) saat ini hanya melayani wilayah Sumedang dan sekitarnya (Maks 40km). Silakan pilih ekspedisi Reguler.";
      }
      return NextResponse.json({ pesan: errorMsg }, { status: 400 });
    }

    daftarBiaya.sort((a: any, b: any) => a.biaya - b.biaya);

    return NextResponse.json({ daftarBiaya });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal menghitung ongkir", detail: galat.message },
      { status: 500 },
    );
  }
}
