import { NextResponse } from "next/server";
import { buatKodePesanan } from "@/lib/format";

type ItemPembayaran = {
  id: string;
  nama: string;
  harga: number;
  jumlah: number;
};

type PermintaanPembayaran = {
  namaPenerima: string;
  emailPenerima: string;
  teleponPenerima: string;
  subtotal: number;
  ongkir: number;
  total: number;
  ekspedisi: string;
  item: ItemPembayaran[];
};

export async function POST(permintaan: Request) {
  const apiKeyPayment = process.env.PAYMENT_API_KEY;
  const apiKeyQrisly = process.env.QRISLY_API_KEY;

  if (!apiKeyPayment || !apiKeyQrisly) {
    return NextResponse.json(
      { pesan: "PAYMENT_API_KEY dan QRISLY_API_KEY wajib diatur di .env.local." },
      { status: 500 }
    );
  }

  const body = (await permintaan.json()) as PermintaanPembayaran;
  const kodePesanan = buatKodePesanan();

  if (!body.total || body.total <= 0 || body.item.length === 0) {
    return NextResponse.json(
      { pesan: "Data pesanan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const itemDetails = [
      ...body.item.map((item) => ({
        id: item.id,
        price: item.harga,
        quantity: item.jumlah,
        name: item.nama
      })),
      {
        id: "ongkir",
        price: body.ongkir,
        quantity: 1,
        name: `Ongkir ${body.ekspedisi}`
      }
    ];

    const payloadMidtrans = {
      transaction_details: {
        order_id: kodePesanan,
        gross_amount: body.total
      },
      customer_details: {
        first_name: body.namaPenerima,
        email: body.emailPenerima,
        phone: body.teleponPenerima
      },
      item_details: itemDetails,
      enabled_payments: ["credit_card", "bank_transfer", "gopay", "qris"]
    };

    const kredensial = Buffer.from(`${apiKeyPayment}:`).toString("base64");
    const respons = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        authorization: `Basic ${kredensial}`,
        "content-type": "application/json",
        "x-qrisly-key": apiKeyQrisly
      },
      body: JSON.stringify(payloadMidtrans)
    });

    const dataPembayaran = await respons.json();

    if (!respons.ok) {
      return NextResponse.json(
        {
          pesan: "Payment gateway menolak transaksi.",
          detail: dataPembayaran
        },
        { status: respons.status }
      );
    }

    return NextResponse.json({
      kodePesanan,
      token: dataPembayaran.token,
      redirectUrl: dataPembayaran.redirect_url,
      status: "MENUNGGU_PEMBAYARAN"
    });
  } catch (galat) {
    return NextResponse.json(
      {
        pesan: "Gagal membuat transaksi pembayaran.",
        detail: galat instanceof Error ? galat.message : "Terjadi kesalahan"
      },
      { status: 500 }
    );
  }
}
