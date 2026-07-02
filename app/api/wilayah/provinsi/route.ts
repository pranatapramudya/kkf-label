import { NextResponse } from "next/server";

export async function GET() {
  // Hardcode 34 Provinsi karena Biteship tidak menyediakan endpoint list provinsi statis
  const daftarProvinsi = [
    { id: "Aceh", nama: "Nanggroe Aceh Darussalam (NAD)" },
    { id: "Sumatera Utara", nama: "Sumatera Utara" },
    { id: "Sumatera Barat", nama: "Sumatera Barat" },
    { id: "Riau", nama: "Riau" },
    { id: "Jambi", nama: "Jambi" },
    { id: "Sumatera Selatan", nama: "Sumatera Selatan" },
    { id: "Bengkulu", nama: "Bengkulu" },
    { id: "Lampung", nama: "Lampung" },
    { id: "Kepulauan Bangka Belitung", nama: "Kepulauan Bangka Belitung" },
    { id: "Kepulauan Riau", nama: "Kepulauan Riau" },
    { id: "DKI Jakarta", nama: "DKI Jakarta" },
    { id: "Jawa Barat", nama: "Jawa Barat" },
    { id: "Jawa Tengah", nama: "Jawa Tengah" },
    { id: "DI Yogyakarta", nama: "DI Yogyakarta" },
    { id: "Jawa Timur", nama: "Jawa Timur" },
    { id: "Banten", nama: "Banten" },
    { id: "Bali", nama: "Bali" },
    { id: "Nusa Tenggara Barat", nama: "Nusa Tenggara Barat (NTB)" },
    { id: "Nusa Tenggara Timur", nama: "Nusa Tenggara Timur (NTT)" },
    { id: "Kalimantan Barat", nama: "Kalimantan Barat" },
    { id: "Kalimantan Tengah", nama: "Kalimantan Tengah" },
    { id: "Kalimantan Selatan", nama: "Kalimantan Selatan" },
    { id: "Kalimantan Timur", nama: "Kalimantan Timur" },
    { id: "Kalimantan Utara", nama: "Kalimantan Utara" },
    { id: "Sulawesi Utara", nama: "Sulawesi Utara" },
    { id: "Sulawesi Tengah", nama: "Sulawesi Tengah" },
    { id: "Sulawesi Selatan", nama: "Sulawesi Selatan" },
    { id: "Sulawesi Tenggara", nama: "Sulawesi Tenggara" },
    { id: "Gorontalo", nama: "Gorontalo" },
    { id: "Sulawesi Barat", nama: "Sulawesi Barat" },
    { id: "Maluku", nama: "Maluku" },
    { id: "Maluku Utara", nama: "Maluku Utara" },
    { id: "Papua", nama: "Papua" },
    { id: "Papua Barat", nama: "Papua Barat" }
  ];

  // Kembalikan dengan format Komerce/RajaOngkir agar frontend TIDAK patah
  return NextResponse.json({
    rajaongkir: {
      results: daftarProvinsi.map((p) => ({
        province_id: p.id, // ID menggunakan nama agar pencarian BiteShip selanjutnya mudah
        province: p.nama,
      }))
    }
  });
}
