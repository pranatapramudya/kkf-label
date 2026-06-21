import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import FormEditClient from "./FormEditClient";

const prisma = new PrismaClient();

export default async function HalamanEditProduk({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Narik data produk lama beserta kategori & variannya
  const produk = await prisma.product.findUnique({
    where: { id },
    include: {
      kategori: true,
      varian: true,
    },
  });

  if (!produk) {
    notFound();
  }

  return (
    <div className="bg-zinc-50/50 min-h-screen p-4 md:p-8 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Lempar datanya ke komponen Form */}
        <FormEditClient produkAwal={produk} />
      </div>
    </div>
  );
}
