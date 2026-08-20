import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const rfmRaw = await prisma.order.groupBy({
      by: ['emailPenerima', 'namaPenerima'],
      where: {
        statusPesanan: {
          in: ["SELESAI", "SAMPAI"],
        },
      },
      _count: { _all: true },
      _sum: { total: true },
      _max: { dibuatPada: true },
    });

    const now = new Date();

    const rfmData = rfmRaw.map((customer) => {
      const email = customer.emailPenerima;
      const nama = customer.namaPenerima;
      const frequency = customer._count._all;
      const monetary = customer._sum.total || 0;
      const lastOrderDate = customer._max.dibuatPada ? new Date(customer._max.dibuatPada) : new Date(0);
      
      const diffTime = Math.abs(now.getTime() - lastOrderDate.getTime());
      const recencyDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      let segment = "Regular";

      if (frequency > 2 && monetary >= 1000000 && recencyDays <= 30) {
        segment = "VIP";
      } else if (recencyDays > 60) {
        segment = "Sleeping";
      } else if (frequency === 1) {
        segment = "New";
      }

      return {
        email,
        nama,
        frequency,
        monetary,
        lastOrderDate,
        recency: recencyDays,
        segment,
      };
    });

    // Sort by Monetary Descending as default
    rfmData.sort((a, b) => b.monetary - a.monetary);

    return NextResponse.json(rfmData, { status: 200 });
  } catch (error: any) {
    console.error("Error calculating RFM:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
