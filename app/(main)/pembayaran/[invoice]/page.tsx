import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ClientPembayaran from "./ClientPembayaran";

const prisma = new PrismaClient();

export default async function HalamanPembayaran(props: {
  params: Promise<{ invoice: string }> | { invoice: string }
}) {
  // Dukungan untuk Next.js 14 dan 15 (params as Promise)
  const params = await Promise.resolve(props.params);
  const invoice = params.invoice;

  const order = await prisma.order.findUnique({
    where: { kodePesanan: invoice },
  });

  if (!order) {
    notFound();
  }

  return <ClientPembayaran order={order} />;
}
