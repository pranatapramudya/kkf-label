import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    // Menggunakan agregasi groupBy di level database
    const groupedItems = await prisma.orderItem.groupBy({
      by: ["produkId", "namaProduk"],
      where: {
        pesanan: {
          statusPesanan: {
            in: ["SELESAI", "SAMPAI"],
          },
        },
      },
      _sum: {
        jumlah: true,
        total: true, // ini adalah revenue per order item
      },
    });

    // Tarik costPrice terpisah
    const productIds = groupedItems.map(item => item.produkId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, costPrice: true },
    });

    const costPriceMap = new Map();
    products.forEach(p => costPriceMap.set(p.id, p.costPrice));

    const profitabilityMap: Record<string, any> = {};

    groupedItems.forEach((item) => {
      const prodId = item.produkId;
      const productName = item.namaProduk;
      const quantity = item._sum.jumlah || 0;
      const revenue = item._sum.total || 0;
      const costPrice = costPriceMap.get(prodId) || 0;

      const totalHpp = costPrice * quantity;
      const margin = revenue - totalHpp;

      profitabilityMap[prodId] = {
        id: prodId,
        nama: productName,
        totalTerjual: quantity,
        revenue: revenue,
        hppTotal: totalHpp,
        margin: margin,
      };
    });

    const data = Object.values(profitabilityMap).sort((a, b) => b.margin - a.margin);

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching profitability:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
