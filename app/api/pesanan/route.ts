import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Baca Affiliate cookie
    const cookieStore = await cookies();
    const affiliateRef = cookieStore.get("affiliate_ref")?.value || null;

    // Bikin nomor invoice otomatis ala startup (Contoh: KKF-24068912)
    const tanggal = new Date();
    const tahun = tanggal.getFullYear().toString().slice(-2);
    const bulan = (tanggal.getMonth() + 1).toString().padStart(2, "0");
    const acak = Math.floor(1000 + Math.random() * 9000);
    const kodeInvoice = `KKF-${tahun}${bulan}${acak}`;

    // Simpan pesanan dan kurangi stok menggunakan Prisma Transaction
    const orderBaru = await prisma.$transaction(async (tx) => {
      // 1. PRE-FLIGHT CHECK: Validasi stok semua item
      for (const itm of body.items) {
        // Cek stok produk utama
        const produkDb = await tx.product.findUnique({
          where: { id: itm.idProduk },
          select: { stokTotal: true, nama: true }
        });
        if (!produkDb || produkDb.stokTotal < itm.jumlah) {
          throw new Error(`Stok produk ${produkDb?.nama || itm.nama} tidak mencukupi (Tersedia: ${produkDb?.stokTotal || 0}).`);
        }

        // Cek stok varian jika ada
        if (itm.idVarian && itm.idVarian !== itm.idProduk) {
          const varianDb = await tx.productVariant.findUnique({
            where: { id: itm.idVarian },
            select: { stok: true, ukuran: true, warna: true }
          });
          if (!varianDb || varianDb.stok < itm.jumlah) {
            throw new Error(`Stok varian ${varianDb?.ukuran} - ${varianDb?.warna} tidak mencukupi (Tersedia: ${varianDb?.stok || 0}).`);
          }
        }
      }

      // 2. Buat Order
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
          source: affiliateRef ? "AFFILIATE" : "ORGANIC",
          affiliateId: affiliateRef,
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

      // 3. Pemotongan Stok Otomatis
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
      { pesan: error.message || "Gagal memproses pesanan." },
      { status: 400 },
    );
  }
}
