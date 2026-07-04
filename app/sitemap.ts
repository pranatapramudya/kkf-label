import { MetadataRoute } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // Ambil semua produk yang aktif dan tidak diarsipkan
  const products = await prisma.product.findMany({
    where: {
      aktif: true,
      isArchived: false,
    },
    select: {
      slug: true,
      diubahPada: true,
    },
  });

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/produk/${product.slug}`,
    lastModified: product.diubahPada,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const staticUrls = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/lacak-pesanan`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ];

  return [...staticUrls, ...productUrls];
}
