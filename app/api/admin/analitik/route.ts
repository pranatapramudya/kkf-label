import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "7hari";
    const bulan = searchParams.get("bulan");
    const tahun = searchParams.get("tahun");

    const sekarang = new Date();
    let tanggalMulai = new Date();
    let tanggalAkhir = new Date();
    let isFilterTahun = false;
    let isFilterBulan = false;

    if (filter === "hari") {
      tanggalMulai.setHours(0, 0, 0, 0);
    } else if (filter === "7hari" || filter === "minggu") {
      tanggalMulai.setDate(sekarang.getDate() - 7);
    } else if (filter === "bulanan") {
      let tBulan = bulan ? parseInt(bulan) : sekarang.getMonth();
      let tTahun = tahun ? parseInt(tahun) : sekarang.getFullYear();
      
      if (tBulan === -1) {
        // Semua Bulan (1 Tahun)
        tanggalMulai = new Date(tTahun, 0, 1);
        tanggalAkhir = new Date(tTahun, 11, 31, 23, 59, 59);
        isFilterTahun = true;
      } else {
        // Spesifik Bulan
        tanggalMulai = new Date(tTahun, tBulan, 1);
        tanggalAkhir = new Date(tTahun, tBulan + 1, 0, 23, 59, 59);
        isFilterBulan = true;
      }
    } else if (!isNaN(Number(filter))) {
      const tahunDipilih = Number(filter);
      tanggalMulai = new Date(tahunDipilih, 0, 1);
      tanggalAkhir = new Date(tahunDipilih, 11, 31, 23, 59, 59);
      isFilterTahun = true;
    }

    const queryWaktu =
      (isFilterTahun || isFilterBulan)
        ? { gte: tanggalMulai, lte: tanggalAkhir }
        : { gte: tanggalMulai };

    const [
      produkAktif,
      kategoriUnik,
      pesananReal,
      items,
      prods
    ] = await Promise.all([
      prisma.product.count({ where: { aktif: true } }).catch(() => 0),
      prisma.category.findMany({ select: { nama: true }, distinct: ["nama"] }).catch(() => []),
      prisma.order.findMany({
        where: { dibuatPada: queryWaktu, statusPesanan: { not: "DIBATALKAN" } },
        select: { total: true, dibuatPada: true },
      }).catch(() => {
        console.log("Belum ada data Order");
        return [];
      }),
      prisma.orderItem.groupBy({
        by: ["produkId", "namaProduk"],
        _sum: { jumlah: true },
        orderBy: { _sum: { jumlah: "desc" } },
        take: 5,
      }).catch(() => []),
      prisma.product.findMany({
        orderBy: { viewCount: "desc" },
        take: 5,
        select: { nama: true, viewCount: true },
      }).catch(() => [])
    ]);

    const daftarKategori = kategoriUnik.map((k: any) => k.nama);
    const totalPenjualan = pesananReal.reduce((sum: number, order: any) => sum + order.total, 0);
    const pesananBaru = pesananReal.length;

    let grafikPenjualan = [];
    if (isFilterTahun) {
      const mapBulan = new Map();
      pesananReal.forEach((order: any) => {
        const bulan = new Date(order.dibuatPada).getMonth();
        mapBulan.set(bulan, (mapBulan.get(bulan) || 0) + order.total);
      });
      const namaBulan = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"];
      grafikPenjualan = namaBulan.map((nama, index) => ({
        hari: nama,
        total: mapBulan.get(index) || 0,
      }));
    } else if (isFilterBulan) {
      const mapTanggal = new Map();
      pesananReal.forEach((order: any) => {
        const tanggal = new Date(order.dibuatPada).getDate();
        mapTanggal.set(tanggal, (mapTanggal.get(tanggal) || 0) + order.total);
      });
      const tBulan = bulan ? parseInt(bulan) : sekarang.getMonth();
      const tTahun = tahun ? parseInt(tahun) : sekarang.getFullYear();
      const maxHari = new Date(tTahun, tBulan + 1, 0).getDate();
      grafikPenjualan = Array.from({ length: maxHari }, (_, i) => ({
        hari: (i + 1).toString(),
        total: mapTanggal.get(i + 1) || 0,
      }));
    } else {
      const mapHari = new Map();
      pesananReal.forEach((order: any) => {
        const hari = new Date(order.dibuatPada).getDay();
        mapHari.set(hari, (mapHari.get(hari) || 0) + order.total);
      });
      grafikPenjualan = [
        { hari: "Sen", total: mapHari.get(1) || 0 },
        { hari: "Sel", total: mapHari.get(2) || 0 },
        { hari: "Rab", total: mapHari.get(3) || 0 },
        { hari: "Kam", total: mapHari.get(4) || 0 },
        { hari: "Jum", total: mapHari.get(5) || 0 },
        { hari: "Sab", total: mapHari.get(6) || 0 },
        { hari: "Min", total: mapHari.get(0) || 0 },
      ];
    }

    const topTerjual = items.map((item: any) => ({
      nama: item.namaProduk,
      jumlah: item._sum.jumlah || 0,
    }));

    const topDilihat = prods.map((p: any) => ({
      nama: p.nama,
      jumlah: p.viewCount || 0,
    }));

    const dataResponse = {
      totalPenjualan,
      pesananBaru,
      produkAktif,
      daftarKategori,
      grafikPenjualan, // Lempar array yang udah dinamis
      grafikProdukTerjual:
        topTerjual.length > 0
          ? topTerjual
          : [{ nama: "Belum ada penjualan", jumlah: 0 }],
      grafikProdukDilihat:
        topDilihat.length > 0
          ? topDilihat
          : [{ nama: "Belum ada views", jumlah: 0 }],
    };

    return NextResponse.json(dataResponse);
  } catch (error) {
    console.error("Error Analitik:", error);
    return NextResponse.json({ pesan: "Gagal menarik data." }, { status: 500 });
  }
}
