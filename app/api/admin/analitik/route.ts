import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "7hari";

    const sekarang = new Date();
    let tanggalMulai = new Date();
    let tanggalAkhir = new Date();
    let isFilterTahun = false; // Penanda buat ubah grafik jadi Jan-Des

    if (filter === "hari") {
      tanggalMulai.setHours(0, 0, 0, 0);
    } else if (filter === "7hari") {
      tanggalMulai.setDate(sekarang.getDate() - 7);
    } else if (filter === "30hari") {
      tanggalMulai.setDate(sekarang.getDate() - 30);
    } else if (filter === "bulan") {
      tanggalMulai = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
    } else if (filter === "tahun") {
      tanggalMulai = new Date(sekarang.getFullYear(), 0, 1);
      isFilterTahun = true;
    } else if (!isNaN(Number(filter))) {
      // Kalau filter berupa angka tahun (Contoh: "2025")
      const tahunDipilih = Number(filter);
      tanggalMulai = new Date(tahunDipilih, 0, 1);
      tanggalAkhir = new Date(tahunDipilih, 11, 31, 23, 59, 59);
      isFilterTahun = true;
    }

    const queryWaktu =
      isFilterTahun && filter.length === 4
        ? { gte: tanggalMulai, lte: tanggalAkhir }
        : { gte: tanggalMulai };

    const produkAktif = await prisma.product.count({ where: { aktif: true } });
    const kategoriUnik = await prisma.category.findMany({
      select: { nama: true },
      distinct: ["nama"],
    });
    const daftarKategori = kategoriUnik.map((k) => k.nama);

    let pesananReal: any[] = [];
    try {
      pesananReal = await prisma.order.findMany({
        where: { dibuatPada: queryWaktu, statusPesanan: { not: "DIBATALKAN" } }, // Jangan hitung yang batal
        select: { total: true, dibuatPada: true },
      });
    } catch (e) {
      console.log("Belum ada data Order");
    }

    const totalPenjualan = pesananReal.reduce(
      (sum, order) => sum + order.total,
      0,
    );
    const pesananBaru = pesananReal.length;

    // --- LOGIKA GRAFIK DINAMIS REAL-TIME ---
    let grafikPenjualan = [];

    if (isFilterTahun) {
      // Grafik 12 Bulan (Januari - Desember)
      const mapBulan = new Map();
      pesananReal.forEach((order) => {
        const bulan = new Date(order.dibuatPada).getMonth(); // 0 = Jan, 1 = Feb
        mapBulan.set(bulan, (mapBulan.get(bulan) || 0) + order.total);
      });
      const namaBulan = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Ags",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ];
      grafikPenjualan = namaBulan.map((nama, index) => ({
        hari: nama,
        total: mapBulan.get(index) || 0,
      }));
    } else {
      // Grafik 7 Hari (Senin - Minggu)
      const mapHari = new Map();
      pesananReal.forEach((order) => {
        const hari = new Date(order.dibuatPada).getDay(); // 0 = Minggu, 1 = Senin
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

    // Tarik Top Terjual & Dilihat
    let topTerjual: any[] = [];
    try {
      const items = await prisma.orderItem.groupBy({
        by: ["produkId", "namaProduk"],
        _sum: { jumlah: true },
        orderBy: { _sum: { jumlah: "desc" } },
        take: 5,
      });
      topTerjual = items.map((item) => ({
        nama: item.namaProduk,
        jumlah: item._sum.jumlah || 0,
      }));
    } catch (e) {}

    let topDilihat: any[] = [];
    try {
      const prods = await prisma.product.findMany({
        orderBy: { viewCount: "desc" },
        take: 5,
        select: { nama: true, viewCount: true },
      });
      topDilihat = prods.map((p) => ({
        nama: p.nama,
        jumlah: p.viewCount || 0,
      }));
    } catch (e) {}

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
