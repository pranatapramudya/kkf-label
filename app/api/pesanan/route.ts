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

    // Simpan pesanan dan kurangi stok menggunakan Prisma Transaction
    const orderBaru = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
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
          item: {
            create: body.items.map((itm: any) => ({
              produkId: itm.idProduk,
              namaProduk: itm.nama,
              ukuran: itm.ukuran,
              warna: itm.warna,
              harga: itm.hargaCoret || itm.harga,
              jumlah: itm.jumlah,
              total: itm.harga * itm.jumlah,
              varianId: itm.idVarian !== itm.idProduk ? itm.idVarian : null,
            })),
          },
        },
      });

      // Pemotongan Stok Otomatis
      for (const itm of body.items) {
        // Kurangi stok total di tabel Produk
        await tx.product.update({
          where: { id: itm.idProduk },
          data: { stokTotal: { decrement: itm.jumlah } },
        });

        // Kurangi stok di tabel ProductVariant jika ada
        if (itm.idVarian && itm.idVarian !== itm.idProduk) {
          await tx.productVariant.update({
            where: { id: itm.idVarian },
            data: { stok: { decrement: itm.jumlah } },
          });
        }
      }

      return order;
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
