# PRD 029: Implementasi AI Virtual Stylist Berbasis RAG & Rate Limiting

## 1. Konteks & Tujuan
Sistem e-commerce KKF Label membutuhkan fitur "AI Virtual Stylist" untuk memberikan rekomendasi outfit yang dipersonalisasi kepada pelanggan. Untuk mencegah pembengkakan biaya API dan mencegah AI berhalusinasi (merekomendasikan barang fiktif), fitur ini akan dibangun menggunakan arsitektur RAG (Retrieval-Augmented Generation) sederhana dan dibatasi dengan ketat menggunakan Rate Limiting.

## 2. Arsitektur & Tech Stack
- **AI Provider:** Google Gemini Flash API (gratis/high-tier) atau Groq API (Llama 3) untuk respons cepat dan biaya serverless.
- **SDK:** Vercel AI SDK (untuk UI Chat dan streaming respons).
- **Keamanan (Rate Limiting):** Upstash Redis (Ratelimit) middleware untuk membatasi jumlah chat per user/IP.
- **Data Context (RAG):** Prisma ORM untuk mengambil data produk aktif dari PostgreSQL dan menyisipkannya ke dalam System Prompt AI.

## 3. Alur Kerja (Workflow)
1. **Trigger:** User mengklik tombol "Rekomendasi Outfit" di halaman beranda. Toast alert yang ada saat ini akan diganti dengan memunculkan komponen Chat Drawer/Modal dari bawah atau samping layar.
2. **Rate Limit Check:** Saat user mengirim pesan, API endpoint (misal `/api/chat`) akan mengecek IP user via Upstash Redis. Jika melebihi batas (misal: 5 request/menit), tolak dengan pesan error yang ramah.
3. **Data Retrieval (RAG):** Jika aman, backend mengambil daftar ringkas produk yang tersedia (Nama, Kategori, Harga, Deskripsi Singkat) dari database via Prisma.
4. **Prompt Injection:** Gabungkan pesan user dengan System Prompt khusus: *"Anda adalah AI Stylist KKF Label. Jawab ramah. HANYA rekomendasikan produk dari daftar berikut: [JSON Data Produk]."*
5. **Streaming Response:** Kembalikan jawaban AI ke frontend secara real-time (streaming) menggunakan Vercel AI SDK.

## 4. Kriteria Selesai (Acceptance Criteria)
- UI Chat (Drawer/Modal) tampil estetik dan responsif di mobile.
- AI hanya merekomendasikan produk yang benar-benar ada di database KKF Label.
- Rate Limiting berfungsi menahan serangan spam chat.
- Token/API Key tersimpan aman di `.env.local` dan tidak bocor ke frontend.