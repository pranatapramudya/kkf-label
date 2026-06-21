import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Ambil semua pesanan yang berhasil (Selesai/Sampai)
    const orders = await prisma.order.findMany({
      where: {
        statusPesanan: {
          in: ["SELESAI", "SAMPAI"],
        },
      },
      orderBy: {
        dibuatPada: "desc",
      },
      select: {
        emailPenerima: true,
        namaPenerima: true,
        total: true,
        dibuatPada: true,
      },
    });

    const now = new Date();
    const customerMap: Record<string, any> = {};

    // Hitung Recency, Frequency, Monetary
    orders.forEach((order) => {
      const email = order.emailPenerima;
      if (!customerMap[email]) {
        customerMap[email] = {
          email: email,
          nama: order.namaPenerima,
          frequency: 0,
          monetary: 0,
          lastOrderDate: order.dibuatPada,
        };
      }
      
      customerMap[email].frequency += 1;
      customerMap[email].monetary += order.total;
      
      // Update last order date if this order is more recent
      if (new Date(order.dibuatPada) > new Date(customerMap[email].lastOrderDate)) {
        customerMap[email].lastOrderDate = order.dibuatPada;
      }
    });

    const rfmData = Object.values(customerMap).map((customer) => {
      const lastOrder = new Date(customer.lastOrderDate);
      const diffTime = Math.abs(now.getTime() - lastOrder.getTime());
      const recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      customer.recency = recencyDays;

      // Logika Segmentasi RFM
      // VIP: Frequency > 2 AND Monetary > 1.000.000 AND Recency < 30 hari
      // Sleeping: Recency > 60 hari
      // New: Frequency == 1
      // Regular: sisanya
      let segment = "Regular";

      if (customer.frequency > 2 && customer.monetary >= 1000000 && customer.recency <= 30) {
        segment = "VIP";
      } else if (customer.recency > 60) {
        segment = "Sleeping";
      } else if (customer.frequency === 1) {
        segment = "New";
      }

      customer.segment = segment;
      return customer;
    });

    // Sort by Monetary Descending as default
    rfmData.sort((a, b) => b.monetary - a.monetary);

    return NextResponse.json(rfmData, { status: 200 });
  } catch (error: any) {
    console.error("Error calculating RFM:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
