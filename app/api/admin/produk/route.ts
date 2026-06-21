import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const bikinSlug = (teks: string) =>
  teks
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function GET() {
  try {
    const dataProduk = await prisma.product.findMany({
      include: { varian: true, kategori: true },
      orderBy: { dibuatPada: "desc" },
    });
    return NextResponse.json(dataProduk);
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal mengambil data produk." },
      { status: 500 },
    );
  }
}

export async function POST(permintaan: Request) {
  try {
    const body = await permintaan.json();
    // TANGKAP videoUrl
    const {
      judul,
      kategori,
      hargaNormal,
      costPrice,
      diskon,
      deskripsi,
      daftarVarian,
      fotoUtama,
      galeriFoto,
      videoUrl,
    } = body;

    if (!judul || !kategori || !hargaNormal) {
      return NextResponse.json(
        { pesan: "Info dasar produk tidak lengkap." },
        { status: 400 },
      );
    }

    const slugProduk = bikinSlug(judul) + "-" + Date.now();
    const hitungStokTotal = daftarVarian.reduce(
      (total: number, v: any) => total + Number(v.stok || 0),
      0,
    );

    const produkBaru = await prisma.product.create({
      data: {
        nama: judul,
        slug: slugProduk,
        harga: Number(hargaNormal),
        costPrice: Number(costPrice || 0),
        diskonPersen: Number(diskon || 0),
        deskripsi: deskripsi,
        stokTotal: hitungStokTotal,

        // SIMPAN URL VIDEO & FOTO
        fotoUtama: fotoUtama || "/logo-kkf.jpeg",
        galeriFoto: galeriFoto || [],
        videoUrl: videoUrl || null, // <--- MASUK DB SINI!

        kategori: {
          connectOrCreate: {
            where: { nama: kategori },
            create: { nama: kategori, slug: bikinSlug(kategori) },
          },
        },
        varian: {
          create: daftarVarian.map((v: any, index: number) => ({
            ukuran: v.ukuran,
            warna: v.warna,
            stok: Number(v.stok || 0),
            sku: `SKU-${slugProduk.toUpperCase()}-${index}`,
          })),
        },
      },
    });

    return NextResponse.json({
      pesan: "Produk berhasil disimpan!",
      data: produkBaru,
    });
  } catch (galat: any) {
    return NextResponse.json(
      { pesan: "Gagal menyimpan produk.", detail: galat.message },
      { status: 500 },
    );
  }
}
