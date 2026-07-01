import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import ClientPembayaran from "./ClientPembayaran";

const prisma = new PrismaClient();

export default async function HalamanPembayaran(props: {
  params: Promise<{ invoice: string }>
}) {
  const params = await props.params;
  const invoice = params.invoice;

  const order = await prisma.order.findUnique({
    where: { kodePesanan: invoice },
  });

  if (!order) {
    notFound();
  }

  return <ClientPembayaran order={order} />;
}
