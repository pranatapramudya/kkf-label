"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";

const prisma = new PrismaClient();

export async function hapusProduk(idProduk: string) {
  try {
    const produk = await prisma.product.findUnique({
      where: { id: idProduk },
      include: { itemPesanan: true },
    });

    if (!produk) {
      return { sukses: false, pesan: "Produk tidak ditemukan." };
    }

    if (produk.itemPesanan && produk.itemPesanan.length > 0) {
      // Soft Delete: Ada relasi transaksi
      await prisma.product.update({
        where: { id: idProduk },
        data: { isArchived: true },
      });
      revalidatePath("/admin/produk");
      return { sukses: true, pesan: "Produk diarsipkan (Soft Delete) karena terhubung dengan transaksi pesanan." };
    } else {
      // Hard Delete: Aman, hapus dari database
      await prisma.product.delete({
        where: { id: idProduk },
      });

      // Kumpulkan gambar dan video untuk dihapus dari Supabase
      const filesToDelete: string[] = [];
      const getFilename = (url: string) => url.split("/").pop();

      if (produk.fotoUtama) {
        const file = getFilename(produk.fotoUtama);
        if (file) filesToDelete.push(file);
      }
      
      if (produk.galeriFoto && produk.galeriFoto.length > 0) {
        produk.galeriFoto.forEach((foto) => {
          const file = getFilename(foto);
          if (file) filesToDelete.push(file);
        });
      }
      
      if (produk.videoUrl) {
        const file = getFilename(produk.videoUrl);
        if (file) filesToDelete.push(file);
      }

      // Eksekusi penghapusan di Supabase
      if (filesToDelete.length > 0) {
        const { error } = await supabase.storage.from("produk").remove(filesToDelete);
        if (error) {
          console.error("Gagal hapus media Supabase:", error);
        }
      }

      revalidatePath("/admin/produk");
      return { sukses: true, pesan: "Produk dan medianya berhasil dihapus permanen." };
    }
  } catch (error) {
    console.error("Error Hapus Produk:", error);
    return {
      sukses: false,
      pesan: "Gagal memproses penghapusan produk.",
    };
  }
}

export async function pulihkanProduk(idProduk: string) {
  try {
    await prisma.product.update({
      where: { id: idProduk },
      data: { isArchived: false },
    });
    revalidatePath("/admin/produk");
    return { sukses: true, pesan: "Produk berhasil dipulihkan." };
  } catch (error) {
    console.error("Error Pulihkan Produk:", error);
    return {
      sukses: false,
      pesan: "Gagal memulihkan produk.",
    };
  }
}
