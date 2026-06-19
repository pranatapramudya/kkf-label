import { NextResponse } from "next/server";

// Biteship akan nembak data pakai metode POST
export async function POST(req: Request) {
  try {
    // Tangkap data mentah (karena pas pertama kali verifikasi, Biteship suka ngirim data kosong)
    const textBody = await req.text();

    if (textBody) {
      const data = JSON.parse(textBody);
      console.log("🔔 Laporan Paket dari Biteship:", data);

      // NANTI: Di sini kita bakal masukin logika buat ngubah status di database
      // sesuai laporan dari kurir (Misal: dari DIKIRIM jadi SAMPAI)
    }

    // 🔥 INI YANG PALING PENTING: Wajib balas dengan status 200 OK
    return NextResponse.json(
      { success: true, message: "Pintu Webhook KKF Label Terbuka!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error Webhook Biteship:", error);
    // Tetep kasih 200 OK biar Biteship gak ngambek pas instalasi
    return NextResponse.json({ success: true }, { status: 200 });
  }
}
