# PRD 042: Pengayaan Konteks Visual & Tautan Produk (Rich Media RAG)

## 1. Konteks & Tujuan
Sistem RAG (Retrieval-Augmented Generation) telah berhasil menginjeksikan data teks ke dalam model LLM, dan AI telah merekomendasikan produk dengan akurat pada UI. Langkah strategis selanjutnya adalah meningkatkan *User Experience* (UX) agar rekomendasi tersebut bersifat *actionable*. Tujuan PRD ini adalah memperkaya data yang ditarik dari PostgreSQL (menambahkan URL gambar dan Slug/ID produk) serta memodifikasi *System Prompt* agar AI mengembalikan balasan dengan format Markdown yang berisi gambar visual dan tautan langsung ke halaman produk.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
AI Agent wajib memodifikasi alur pengambilan data dan instruksi sistem tanpa merusak logika yang sudah berjalan:

### A. Pengayaan Query Database (Prisma)
- Temukan blok eksekusi `prisma.product.findMany`.
- Tambahkan kolom yang menyimpan URL gambar (misalnya `gambar`, `imageUrl`, atau `foto`) dan kolom identifier untuk URL (misalnya `id` atau `slug`) ke dalam objek `select`.

### B. Pembaruan Serialisasi Data
- Modifikasi fungsi pemetaan (`.map()`) yang sebelumnya hanya menggabungkan Nama, Kategori, dan Harga.
- Sisipkan URL Gambar dan struktur URL halaman produk (misalnya `https://domain.com/produk/{slug}`) ke dalam teks yang diserialisasi untuk setiap produk.

### C. Pembaruan System Prompt (Instruksi Markdown)
- Tambahkan satu blok instruksi wajib di dalam *System Prompt* yang memaksa AI untuk selalu menggunakan sintaks Markdown saat merekomendasikan produk.
- **Format Wajib AI:** Saat menyebutkan produk, AI HARUS menyertakan gambar menggunakan sintaks `![Nama Produk](URL_Gambar)` dan memberikan tautan CTA menggunakan sintaks `[Lihat Detail Produk](URL_Halaman_Produk)`.

## 3. Instruksi Eksekusi Frontend (`app/(main)/rekomendasi/page.tsx`)
**Fokus: Dukungan Rendering Markdown pada Chat Bubble**
- AI Agent harus memastikan bahwa komponen *chat bubble* yang merender `message.content` memiliki kapabilitas untuk mem- *parsing* Markdown.
- Jika proyek ini belum memiliki *library* Markdown, AI Agent diizinkan untuk menginstal dan mengimplementasikan pustaka standar ringan seperti `react-markdown` (dan plugin pendukungnya jika perlu, seperti `remark-gfm`) pada komponen pesan UI.
- Pastikan elemen gambar yang dirender melalui Markdown memiliki gaya (CSS/Tailwind) penyesuaian ukuran maksimal (`max-w-full`, `rounded-md`, dll) agar tidak merusak *layout* obrolan.

## 4. Kriteria Selesai (Acceptance Criteria)
- AI mengembalikan balasan yang mencakup sintaks gambar dan *link* Markdown.
- UI *frontend* berhasil merender sintaks tersebut menjadi gambar produk sungguhan dan teks yang dapat diklik, mengarahkan pengguna ke halaman detail produk terkait.