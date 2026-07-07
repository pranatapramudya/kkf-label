export const runtime = 'nodejs';

import { google } from '@ai-sdk/google';
import { streamText } from 'ai';
import { prisma } from '@/lib/prisma';

// Memperpanjang waktu eksekusi agar AI tidak timeout (Vercel standard)
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const userMessageCount = messages.filter((m: any) => m.role === 'user').length;
    if (userMessageCount > 3) {
      return new Response(JSON.stringify({ error: "Batas konsultasi harian habis." }), { 
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const normalizedMessages = messages.map((msg: any) => {
      let content = msg.content;
      if (msg.parts && Array.isArray(msg.parts) && msg.parts.length > 0) {
        content = msg.parts[0].text;
      }
      return {
        role: msg.role,
        content: content || "",
      };
    });

    let dataProdukString = "[]";
    
    // BENTENG PRISMA: Cegah fatal crash (500) jika koneksi database terputus atau skema tidak sinkron
    try {
      const products = await prisma.product.findMany({
        where: { stokTotal: { gt: 0 } },
        take: 40,
        select: { nama: true, kategori: { select: { nama: true } }, harga: true, deskripsi: true, slug: true, fotoUtama: true }
      });
      
      const shuffledProducts = products.sort(() => Math.random() - 0.5).slice(0, 15);

      if (shuffledProducts.length > 0) {
        dataProdukString = shuffledProducts.map((p: any) => 
          `- Nama: ${p.nama}\n  Kategori: ${p.kategori?.nama || 'Umum'}\n  Harga: Rp ${Number(p.harga).toLocaleString('id-ID')}\n  Deskripsi: ${p.deskripsi}\n  URL_Gambar: ${p.fotoUtama}\n  URL_Halaman_Produk: /produk/${p.slug}`
        ).join('\n\n');
      } else {
        dataProdukString = "";
      }
    } catch (dbError) {
      console.error("Prisma Error: Gagal mengambil data produk, melanjutkan tanpa data.", dbError);
      dataProdukString = "";
    }

    const systemPrompt = `Anda adalah AI Virtual Stylist KKF Label. Berikan rekomendasi outfit dengan ramah dan selalu gunakan bahasa Indonesia yang baik.

INSTRUKSI PENTING:
1. HANYA rekomendasikan produk yang terdapat dalam daftar data yang disuntikkan di bawah ini.
2. Sebutkan nama produk dan harganya secara jelas kepada pengguna.
3. Tetap menggunakan gaya bahasa yang ramah sebagai Virtual Stylist.
4. WAJIB GUNAKAN MARKDOWN: Setiap merekomendasikan produk, Anda HARUS menyertakan gambar produk dengan sintaks ![Nama Produk](URL_Gambar) dan menambahkan tautan/CTA menggunakan sintaks [Lihat Detail Produk](URL_Halaman_Produk).
5. Saat memberikan rekomendasi, berikan opsi yang bervariasi. Berikan setidaknya satu produk utama yang sangat relevan, dan satu produk alternatif dengan gaya atau kategori yang sedikit berbeda untuk memberikan pilihan kepada pelanggan.

Daftar Produk Tersedia:
${dataProdukString || "Mohon maaf, sistem sedang mengalami kendala sinkronisasi katalog. Tidak ada produk yang tersedia saat ini."}`;

    const result = streamText({
      model: google('gemini-2.5-flash'),
      system: systemPrompt,
      messages: normalizedMessages,
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(JSON.stringify({ error: "Gagal memproses permintaan AI" }), { status: 500 });
  }
}
