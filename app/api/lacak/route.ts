import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(permintaan: Request) {
  const apiKey = process.env.SHIPPING_API_KEY;

  try {
    const { kodeInvoice } = await permintaan.json();

    if (!kodeInvoice) {
      return NextResponse.json(
        { pesan: "Masukkan nomor invoice dulu bos!" },
        { status: 400 },
      );
    }

    // 🔥 FIX: Pakai prisma.order dan cari berdasarkan kodePesanan
    const dataPesanan = await prisma.order.findFirst({
      where: { kodePesanan: kodeInvoice },
      include: { item: true }, // Sekalian bawa data item belanjaan
    });

    if (!dataPesanan) {
      return NextResponse.json(
        { pesan: "Pesanan tidak ditemukan. Cek lagi nomor invoicenya." },
        { status: 404 },
      );
    }

    let riwayatPelacakan = null;
    let statusPengiriman = null;

    // 🔥 FIX: Pakai nomorResi yang baru aja lu tambahin di schema
    if (dataPesanan.nomorResi && dataPesanan.ekspedisi) {
      const parameter = new URLSearchParams({
        waybill: dataPesanan.nomorResi,
        courier: dataPesanan.ekspedisi.toLowerCase(),
      });

      const respons = await fetch(
        "https://rajaongkir.komerce.id/api/v1/waybill",
        {
          method: "POST",
          headers: {
            key: apiKey || "",
            "content-type": "application/x-www-form-urlencoded",
          },
          body: parameter.toString(),
        },
      );

      const text = await respons.text();
      let dataKomerce;
      
      try {
        dataKomerce = JSON.parse(text);
      } catch (e) {
        console.error("Gagal parse JSON API Kurir:", text.substring(0, 100));
        return NextResponse.json(
          { pesan: "Gagal melacak resi dari server kurir." },
          { status: 502 }
        );
      }

      if (dataKomerce.meta?.status === true) {
        riwayatPelacakan = dataKomerce.data?.manifest || [];
        statusPengiriman = dataKomerce.data?.summary?.status || "PROSES";
      }
    }

    return NextResponse.json({
      pesanan: dataPesanan,
      lacak: {
        status: statusPengiriman,
        riwayat: riwayatPelacakan,
      },
    });
  } catch (galat: any) {
    console.error("🔥 Error Lacak:", galat.message);
    return NextResponse.json(
      { pesan: "Terjadi kesalahan sistem saat melacak." },
      { status: 500 },
    );
  }
}
