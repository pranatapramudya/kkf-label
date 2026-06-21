import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    // 1. Dapatkan Server Key
    const serverKey = process.env.MIDTRANS_SERVER_KEY || "";
    if (!serverKey) {
      return NextResponse.json(
        { sukses: false, pesan: "Midtrans Server Key tidak dikonfigurasi." },
        { status: 500 },
      );
    }
    
    const encodedKey = Buffer.from(serverKey + ":").toString("base64");

    // Tentukan URL berdasar tipe key (sandbox atau production)
    const isProduction = !serverKey.includes("SB-");
    const baseUrl = isProduction
      ? "https://api.midtrans.com/v2"
      : "https://api.sandbox.midtrans.com/v2";

    // 2. Fetch ke Midtrans
    const midtransRes = await fetch(`${baseUrl}/${id}/status`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
    });

    const data = await midtransRes.json();

    if (data.status_code === "404") {
      return NextResponse.json(
        { sukses: false, pesan: "Belum ada transaksi pembayaran di Midtrans." },
        { status: 404 },
      );
    }

    const transactionStatus = data.transaction_status;
    
    let newStatusPesanan = undefined;
    let newStatusTransaksi = undefined;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      newStatusPesanan = "DIBAYAR";
      newStatusTransaksi = "SETTLEMENT";
    } else if (
      transactionStatus === "deny" ||
      transactionStatus === "cancel" ||
      transactionStatus === "expire"
    ) {
      newStatusPesanan = "DIBATALKAN";
      newStatusTransaksi = transactionStatus.toUpperCase();
    } else if (transactionStatus === "pending") {
      // Nothing changes but valid check
      return NextResponse.json({
        sukses: true,
        pesan: "Status di Midtrans masih PENDING. Belum dibayar.",
        statusTransaksi: transactionStatus,
      });
    } else {
       return NextResponse.json({
        sukses: true,
        pesan: `Status Midtrans saat ini: ${transactionStatus}`,
        statusTransaksi: transactionStatus,
      });
    }

    // 3. Update Database
    if (newStatusPesanan && newStatusTransaksi) {
      await prisma.order.update({
        where: { id: id },
        data: {
          statusPesanan: newStatusPesanan as any,
          statusTransaksi: newStatusTransaksi as any,
        },
      });

      return NextResponse.json({
        sukses: true,
        pesan: `Sinkronisasi berhasil! Status pesanan diupdate jadi ${newStatusPesanan}.`,
        statusPesanan: newStatusPesanan,
      });
    }

    return NextResponse.json({
      sukses: true,
      pesan: "Tidak ada perubahan status.",
    });
  } catch (error: any) {
    console.error("Error Sync Midtrans:", error);
    return NextResponse.json(
      { sukses: false, pesan: error.message || "Gagal sinkronisasi dengan Midtrans" },
      { status: 500 },
    );
  }
}
