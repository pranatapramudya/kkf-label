"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function hapusProduk(idProduk: string) {
  try {
    await prisma.product.delete({
      where: { id: idProduk },
    });
    // Refresh otomatis data di halaman admin setelah dihapus
    revalidatePath("/admin/produk");
    return { sukses: true, pesan: "Produk berhasil dihapus!" };
  } catch (error) {
    return {
      sukses: false,
      pesan: "Gagal menghapus produk. Mungkin masih ada relasi data.",
    };
  }
}
