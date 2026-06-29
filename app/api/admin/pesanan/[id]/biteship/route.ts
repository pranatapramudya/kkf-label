import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    // Cek API Key Biteship
    const biteshipKey = process.env.BITESHIP_API_KEY;
    if (!biteshipKey) {
      throw new Error("BITESHIP_API_KEY belum dikonfigurasi di server.");
    }

    // Ambil data pesanan beserta item-nya
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        item: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { pesan: "Pesanan tidak ditemukan." },
        { status: 404 }
      );
    }

    if (order.nomorResi) {
      return NextResponse.json(
        { pesan: "Pesanan ini sudah memiliki nomor resi.", resi: order.nomorResi },
        { status: 400 }
      );
    }

    // Pemetaan ekspedisi, misalnya "JNE - REG" -> "jne"
    // Tangani juga kasus J&T
    let courierCompany = order.ekspedisi.split(" - ")[0].toLowerCase();
    if (courierCompany === "j&t") {
      courierCompany = "jnt";
    }

    // Konversi items ke format Biteship
    const biteshipItems = order.item.map((itm) => ({
      name: (itm as any).namaProduk || "Pakaian KKF Label",
      description: `Warna: ${(itm as any).warna || "-"}, Ukuran: ${(itm as any).ukuran || "-"}`,
      value: Math.floor(order.subtotal / order.item.length), // Estimasi harga per item
      quantity: (itm as any).jumlah || 1,
      weight: 250, // Estimasi berat per item: 250 gram
    }));

    // Payload untuk create order biteship (waybill)
    const payload = {
      shipper_contact_name: "KKF Label",
      shipper_contact_phone: "085117490449",
      shipper_contact_email: "admin@kkflabel.com",
      shipper_organization: "KKF Label",
      origin_contact_name: "KKF Label",
      origin_contact_phone: "085117490449",
      origin_address: "Sumedang, Jawa Barat",
      destination_contact_name: order.namaPenerima,
      destination_contact_phone: order.teleponPenerima,
      destination_contact_email: order.emailPenerima,
      destination_address: `${order.alamatLengkap}, ${order.kota}, ${order.provinsi}`,
      courier_company: courierCompany,
      courier_type: "standard",
      delivery_type: "now",
      order_note: "Mohon di-pickup",
      items: biteshipItems,
    };

    console.log("🔥 Mengirim request ke Biteship API...", JSON.stringify(payload));

    const response = await fetch("https://api.biteship.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: biteshipKey,
      },
      body: JSON.stringify(payload),
    });

    const resData = await response.json();

    if (!response.ok) {
      console.error("🔥 Biteship API Error:", resData);
      throw new Error(resData.error || resData.message || "Gagal membuat resi di Biteship");
    }

    const nomorResi = resData.courier?.waybill_id || resData.id;

    if (!nomorResi) {
       throw new Error("Respon Biteship sukses tetapi nomor resi tidak ditemukan di payload response.");
    }

    // Update nomor resi di database
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        nomorResi: nomorResi,
      },
    });

    return NextResponse.json({
      pesan: "Resi berhasil dibuat via Biteship!",
      resi: nomorResi,
      data: updatedOrder,
    });

  } catch (galat: any) {
    console.error("🔥 Error Generate Resi Biteship:", galat.message);
    return NextResponse.json(
      { pesan: "Gagal generate resi: " + galat.message },
      { status: 500 },
    );
  }
}
