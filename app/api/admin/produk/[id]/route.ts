import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Nangkep tambahan fotoUtama, galeriFoto, dan videoUrl dari form frontend
    const {
      judul,
      kategori,
      hargaNormal,
      diskon,
      deskripsi,
      daftarVarian,
      fotoUtama,
      galeriFoto,
      videoUrl, // <--- TAMBAHAN VIDEO BUAT EDIT
    } = body;

    const slugKategori = kategori.toLowerCase().replace(/ /g, "-");
    const kategoriDb = await prisma.category.upsert({
      where: { nama: kategori },
      update: {},
      create: {
        nama: kategori,
        slug: slugKategori,
      },
    });

    const stokTotal = daftarVarian.reduce(
      (acc: number, curr: any) => acc + curr.stok,
      0,
    );

    // Update Data Induk Produk + FOTONYA + VIDEONYA
    await prisma.product.update({
      where: { id: id },
      data: {
        nama: judul,
        deskripsi: deskripsi,
        harga: hargaNormal,
        diskonPersen: diskon,
        stokTotal: stokTotal,
        kategoriId: kategoriDb.id,
        fotoUtama: fotoUtama, // Simpan URL foto baru/lama ke DB
        galeriFoto: galeriFoto, // Simpan URL galeri ke DB
        videoUrl: videoUrl, // Simpan URL video baru/lama ke DB
      },
    });

    const idVarianValid = daftarVarian
      .map((v: any) => v.id)
      .filter((id: any) => id !== undefined && id !== "");

    await prisma.productVariant.deleteMany({
      where: {
        produkId: id,
        id: { notIn: idVarianValid },
      },
    });

    for (const varian of daftarVarian) {
      if (varian.id) {
        await prisma.productVariant.update({
          where: { id: varian.id },
          data: {
            ukuran: varian.ukuran,
            warna: varian.warna,
            stok: varian.stok,
          },
        });
      } else {
        const randomCode = Math.floor(Math.random() * 1000);
        await prisma.productVariant.create({
          data: {
            produkId: id,
            ukuran: varian.ukuran,
            warna: varian.warna,
            stok: varian.stok,
            sku: `KKF-${Date.now()}-${randomCode}`,
          },
        });
      }
    }

    return NextResponse.json({
      sukses: true,
      pesan: "Produk berhasil diperbarui!",
    });
  } catch (error: any) {
    console.error("Error Update Produk:", error);
    return NextResponse.json(
      { sukses: false, pesan: error.message || "Gagal memperbarui produk" },
      { status: 500 },
    );
  }
}
