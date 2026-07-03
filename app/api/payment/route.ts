import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";
import "@/lib/firebase-admin";
import { getMessaging } from "firebase-admin/messaging";

const prisma = new PrismaClient();

export async function POST(permintaan: Request) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;

  if (!serverKey) {
    return NextResponse.json(
      { pesan: "Server Key Midtrans belum diatur di Vercel!" },
      { status: 500 },
    );
  }

  try {
    const body = await permintaan.json();

    // Baca Affiliate cookie
    const cookieStore = await cookies();
    const affiliateRef = cookieStore.get("affiliate_ref")?.value || null;

    // Bikin nomor invoice otomatis ala startup yang terjamin unik
    const uniqueKodePesanan = 'KKF-' + Date.now().toString() + '-' + Math.floor(Math.random() * 1000).toString();
    const kodePesanan = uniqueKodePesanan;

    // Wajib dibulatkan, Midtrans bakal error kalau ada angka desimal/koma
    const grossAmount = Math.round(body.total);

    // 🔥 SIMPAN KE DATABASE DULU SEBELUM MINTA TOKEN MIDTRANS 🔥
    await prisma.$transaction(async (tx) => {
      // 1. PRE-FLIGHT CHECK: Validasi stok semua item
      for (const itm of body.items) {
        const idProduk = itm.idProduk || itm.id;
        const idVarian = itm.idVarian || itm.id; // Di checkout page kadangkala pakai idVarian atau id

        // Cek stok produk utama
        const produkDb = await tx.product.findUnique({
          where: { id: idProduk },
          select: { stokTotal: true, nama: true, harga: true, diskonPersen: true }
        });
        if (!produkDb || produkDb.stokTotal < itm.jumlah) {
          throw new Error(`Stok produk ${produkDb?.nama || itm.nama} tidak mencukupi (Tersedia: ${produkDb?.stokTotal || 0}).`);
        }

        // Kalkulasi harga diskon yang valid dari DB
        const diskonPersen = produkDb.diskonPersen || 0;
        itm.hargaValid = Math.round(produkDb.harga - (produkDb.harga * (diskonPersen / 100)));

        // Cek stok varian jika ada
        if (idVarian && idVarian !== idProduk) {
          const varianDb = await tx.productVariant.findUnique({
            where: { id: idVarian },
            select: { stok: true, ukuran: true, warna: true }
          });
          if (!varianDb || varianDb.stok < itm.jumlah) {
            throw new Error(`Stok varian ${varianDb?.ukuran} - ${varianDb?.warna} tidak mencukupi (Tersedia: ${varianDb?.stok || 0}).`);
          }
        }
      }

      // 1.5. Upsert Pengguna untuk menyimpan FCM Token (Guest Checkout)
      let penggunaId = null;
      if (body.email) {
        const user = await tx.user.upsert({
          where: { email: body.email },
          update: { 
            nama: body.nama,
            telepon: body.telepon,
            alamat: body.alamatLengkap,
            kota: body.kota,
            provinsi: body.provinsi,
            ...(body.fcmToken ? { fcmToken: body.fcmToken } : {})
          },
          create: {
            nama: body.nama,
            email: body.email,
            kataSandi: Math.random().toString(36).slice(-8), // random dummy pass
            telepon: body.telepon,
            alamat: body.alamatLengkap,
            kota: body.kota,
            provinsi: body.provinsi,
            fcmToken: body.fcmToken || null,
          }
        });
        penggunaId = user.id;
      }

      // 2. Buat Order
      await tx.order.create({
        data: {
          kodePesanan: kodePesanan,
          penggunaId: penggunaId,
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
          metodePembayaran: body.metodePembayaran || "MIDTRANS",
          source: affiliateRef ? "AFFILIATE" : "ORGANIC",
          affiliateId: affiliateRef,
          item: {
            create: body.items.map((itm: any) => ({
              produkId: itm.idProduk || itm.id,
              namaProduk: itm.nama,
              ukuran: itm.ukuran,
              warna: itm.warna,
              harga: itm.hargaValid || itm.harga,
              jumlah: itm.jumlah,
              total: (itm.hargaValid || itm.harga) * itm.jumlah,
              varianId: (itm.idVarian && itm.idVarian !== (itm.idProduk || itm.id)) ? itm.idVarian : null,
            })),
          },
        },
      });

      // 3. Pemotongan Stok Otomatis
      for (const itm of body.items) {
        const idProduk = itm.idProduk || itm.id;
        const idVarian = itm.idVarian || itm.id;

        // Kurangi stok total di tabel Produk
        await tx.product.update({
          where: { id: idProduk },
          data: { stokTotal: { decrement: itm.jumlah } },
        });

        // Kurangi stok di tabel ProductVariant jika ada
        if (idVarian && idVarian !== idProduk) {
          await tx.productVariant.update({
            where: { id: idVarian },
            data: { stok: { decrement: itm.jumlah } },
          });
        }
      }

      // 4. Buat Notifikasi untuk Admin
      await tx.notification.create({
        data: {
          title: "Pesanan Baru Masuk",
          message: `Pesanan baru masuk dengan kode ${kodePesanan} senilai Rp ${body.total.toLocaleString("id-ID")}`,
          orderId: kodePesanan,
        },
      });
    });

    // 5. Kirim Push Notification ke semua Admin Devices via FCM
    try {
      const adminTokens = await prisma.adminToken.findMany();
      if (adminTokens.length > 0) {
        const tokens = adminTokens.map(t => t.token);
        await getMessaging().sendEachForMulticast({
          tokens,
          notification: {
            title: "Pesanan Baru KKF Label!",
            body: `Ada order masuk senilai Rp ${body.total.toLocaleString("id-ID")}`,
          },
          data: {
            orderId: kodePesanan,
          }
        });
      }
    } catch (pushErr) {
      console.error("Gagal mengirim Push Notification via FCM:", pushErr);
    }

    // Jika metode pembayaran manual, kembalikan kode pesanan langsung tanpa buat token Midtrans
    if (body.metodePembayaran && body.metodePembayaran !== "MIDTRANS") {
      return NextResponse.json({ sukses: true, kodePesanan });
    }

    // Menyusun daftar belanjaan buat ditampilin di nota Midtrans
    const itemDetails = [
      ...body.items.map((item: any) => ({
        id: item.idVarian || item.id,
        price: Math.round(item.harga),
        quantity: item.jumlah,
        name: item.nama.substring(0, 50),
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

    return NextResponse.json({ token: data.token, kodePesanan });
  } catch (galat: any) {
    console.error("🔥 Error Checkout:", galat.message);
    return NextResponse.json(
      { pesan: galat.message || "Kesalahan internal server saat memproses checkout." },
      { status: 500 },
    );
  }
}
