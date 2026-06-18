import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Bikin nomor invoice otomatis ala startup (Contoh: KKF-24068912)
    const tanggal = new Date();
    const tahun = tanggal.getFullYear().toString().slice(-2);
    const bulan = (tanggal.getMonth() + 1).toString().padStart(2, "0");
    const acak = Math.floor(1000 + Math.random() * 9000);
    const kodeInvoice = `KKF-${tahun}${bulan}${acak}`;

    // Simpan semua data pelanggan dan keranjangnya ke database PostgreSQL lu
    const orderBaru = await prisma.order.create({
      data: {
        kodePesanan: kodeInvoice,
        namaPenerima: body.nama,
        emailPenerima: body.email,
        teleponPenerima: body.telepon,
        alamatLengkap: body.alamatLengkap,
        provinsi: body.provinsi,
        kota: body.kota,
        ekspedisi: body.ekspedisi,
        subtotal: body.subtotal,
        ongkir: body.ongkir,
        total: body.total,
        statusPesanan: "MENUNGGU_PEMBAYARAN",
        // Masukin daftar belanjaannya ke tabel OrderItem sekaligus
        item: {
          create: body.items.map((itm: any) => ({
            produkId: itm.idProduk,
            namaProduk: itm.nama,
            ukuran: itm.ukuran,
            warna: itm.warna,
            harga: itm.hargaCoret || itm.harga, // Harga asli
            jumlah: itm.jumlah,
            total: itm.harga * itm.jumlah,
          })),
        },
      },
    });

    return NextResponse.json({
      sukses: true,
      pesan: "Orderan berhasil masuk bos!",
      invoice: kodeInvoice,
    });
  } catch (error: any) {
    console.error("🔥 Error Checkout:", error.message);
    return NextResponse.json(
      { pesan: "Gagal memproses pesanan." },
      { status: 500 },
    );
  }
}
