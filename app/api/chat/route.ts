export const runtime = 'nodejs';

import { google } from '@ai-sdk/google';
import { createGroq } from '@ai-sdk/groq';
import { generateText, streamText } from 'ai';
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

    const systemPrompt = `Kamu adalah AI Virtual Stylist eksklusif untuk KKF Label.
Tugas utamamu adalah memberikan saran fashion dan rekomendasi outfit HANYA dari data produk KKF Label yang diberikan di bawah ini.

ATURAN KETAT:
1. GAYA BAHASA: Gunakan bahasa Indonesia yang santai, ramah, dan gaul tapi tetap profesional (seperti bicara dengan teman). Awali jawaban dengan kata natural seperti "Tentu!", "Wah, pas banget!", atau "Boleh banget!". DILARANG KERAS memulai kalimat dengan kata terjemahan kaku seperti "Mereka!" atau "Di sini!".
2. ISOLASI PRODUK: HANYA rekomendasikan produk yang ada di dalam Daftar Produk KKF Label di bawah ini. JANGAN PERNAH merekomendasikan produk dari brand lain atau berhalusinasi menciptakan produk sendiri.
3. HANDLING STOK KOSONG: Jika user meminta pakaian/style yang tidak ada di daftar produk KKF Label (misalnya meminta sepatu, jaket kulit, atau topi), tolak dengan sangat sopan dan katakan bahwa "Saat ini koleksi tersebut belum tersedia di KKF Label," lalu alihkan dengan merekomendasikan produk best seller yang kita punya.
4. FORMAT: Tampilkan nama produk, harga, dan berikan alasan singkat yang menarik mengapa outfit itu cocok untuk kegiatan user.
5. WAJIB GUNAKAN MARKDOWN: Setiap merekomendasikan produk, HARUS sertakan gambar produk dengan sintaks ![Nama Produk](URL_Gambar) dan tambahkan tautan/CTA menggunakan sintaks [Lihat Detail Produk](URL_Halaman_Produk).
6. VARIASI: Berikan setidaknya satu produk utama yang sangat relevan, dan satu produk alternatif dengan gaya atau kategori yang sedikit berbeda untuk memberikan pilihan kepada pelanggan.

Daftar Produk KKF Label:
${dataProdukString || "Mohon maaf, sistem sedang mengalami kendala sinkronisasi katalog. Tidak ada produk yang tersedia saat ini."}`;

    const groq = createGroq({ apiKey: process.env.GROQ_API_KEY });

    // ============================================================
    // STRATEGI FALLBACK: Pre-flight validation dengan generateText
    // 
    // Alasan: streamText() di AI SDK v7 TIDAK melempar error ke
    // blok catch. Error di-embed langsung ke dalam stream sehingga
    // try-catch manual tidak pernah tereksekusi.
    //
    // Solusi: Gunakan generateText() (non-streaming, ringan) sebagai
    // "health check" ke Gemini. Jika gagal (401/429/500), error 
    // AKAN terlempar dan tertangkap oleh catch, lalu kita langsung
    // fallback ke Groq untuk streaming penuh.
    // ============================================================

    let useGroqFallback = false;

    try {
      // Pre-flight check: kirim prompt mini ke Gemini untuk validasi koneksi & kuota
      await generateText({
        model: google('gemini-2.5-flash'),
        prompt: 'ok',
        maxOutputTokens: 1,
      });
    } catch (geminiError) {
      console.log("🚨 Gemini AI gagal/limit habis! Fallback ke Groq Llama 3...", geminiError);
      useGroqFallback = true;
    }

    // Gunakan model yang tersedia berdasarkan hasil pre-flight check
    const activeModel = useGroqFallback 
      ? groq('llama-3.1-8b-instant') 
      : google('gemini-2.5-flash');

    const result = streamText({
      model: activeModel,
      system: systemPrompt,
      messages: normalizedMessages,
    });

    return result.toUIMessageStreamResponse();

  } catch (error) {
    console.error("AI Route Error:", error);
    return new Response(JSON.stringify({ error: "Gagal memproses permintaan AI" }), { status: 500 });
  }
}
