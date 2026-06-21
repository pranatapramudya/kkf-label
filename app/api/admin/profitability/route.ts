import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Ambil data penjualan yang selesai (atau sampai)
    // Untuk margin, kita bisa hitung berdasarkan OrderItem dari pesanan yang sukses.
    const completedOrders = await prisma.order.findMany({
      where: {
        statusPesanan: {
          in: ["SELESAI", "SAMPAI"],
        },
      },
      include: {
        item: {
          include: {
            produk: true, // Untuk ambil costPrice
          },
        },
      },
    });

    // Mengelompokkan data per produk
    const profitabilityMap: Record<string, any> = {};

    completedOrders.forEach((order) => {
      order.item.forEach((orderItem: any) => {
        const prodId = orderItem.produkId;
        const productName = orderItem.namaProduk;
        const quantity = orderItem.jumlah;
        const sellPrice = orderItem.harga;
        const costPrice = orderItem.produk?.costPrice || 0;

        const revenue = sellPrice * quantity;
        const totalHpp = costPrice * quantity;
        const margin = revenue - totalHpp;

        if (!profitabilityMap[prodId]) {
          profitabilityMap[prodId] = {
            id: prodId,
            nama: productName,
            totalTerjual: 0,
            revenue: 0,
            hppTotal: 0,
            margin: 0,
          };
        }

        profitabilityMap[prodId].totalTerjual += quantity;
        profitabilityMap[prodId].revenue += revenue;
        profitabilityMap[prodId].hppTotal += totalHpp;
        profitabilityMap[prodId].margin += margin;
      });
    });

    const data = Object.values(profitabilityMap).sort((a, b) => b.margin - a.margin);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching profitability:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
