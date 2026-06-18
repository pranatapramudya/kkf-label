import { NextResponse } from "next/server";

export async function POST(permintaan: Request) {
  // 🔥 Murni pakai Kunci Server asli yang tadi lu simpan
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return NextResponse.json(
      { pesan: "Server Key Midtrans belum diatur di Vercel!" },
      { status: 500 },
    );
  }

  try {
    const body = await permintaan.json();

    // Bikin invoice acak khusus untuk Midtrans
    const kodePesanan = `KKF-${Date.now()}`;

    // Wajib dibulatkan, Midtrans bakal error kalau ada angka desimal/koma
    const grossAmount = Math.round(body.total);

    // Menyusun daftar belanjaan buat ditampilin di nota Midtrans
    const itemDetails = [
      ...body.items.map((item: any) => ({
        id: item.idVarian || item.id,
        price: Math.round(item.harga),
        quantity: item.jumlah,
        name: item.nama.substring(0, 50), // Nama barang dibatasi 50 huruf dari sananya
      })),
      {
        id: "ongkir",
        price: Math.round(body.ongkir),
        quantity: 1,
        name: `Ongkir ${body.ekspedisi}`.substring(0, 50),
      },
    ];

    const payloadMidtrans = {
      transaction_details: {
        order_id: kodePesanan,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: body.nama,
        email: body.email,
        phone: body.telepon,
      },
      item_details: itemDetails,
    };

    // Encode kunci rahasia jadi Base64 sesuai standar mereka
    const kredensial = Buffer.from(`${serverKey}:`).toString("base64");

    // 🔥 LINK PRODUCTION (DUIT ASLI) 🔥
    const respons = await fetch(
      "https://app.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Basic ${kredensial}`,
        },
        body: JSON.stringify(payloadMidtrans),
      },
    );

    const data = await respons.json();

    if (!respons.ok) {
      console.error("Gagal Midtrans:", data);
      return NextResponse.json(
        { pesan: "Gagal membuat tiket pembayaran", detail: data },
        { status: 400 },
      );
    }

    // Balikin tiket/token-nya ke Frontend biar bisa buka popup
    return NextResponse.json({ token: data.token, kodePesanan });
  } catch (galat) {
    return NextResponse.json(
      { pesan: "Kesalahan internal server." },
      { status: 500 },
    );
  }
}
