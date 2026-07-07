# PRD 040: Injeksi Konteks Database (RAG) ke System Prompt AI

## 1. Konteks & Tujuan
Saat ini, *backend* telah berhasil menarik data produk dari *database* PostgreSQL menggunakan Prisma, dan model LLM (Gemini 2.5 Flash) telah berhasil mengembalikan *stream response*. Namun, LLM tidak merekomendasikan produk karena hasil *query* dari Prisma tidak disuntikkan ke dalam *context window* model AI. Tujuan PRD ini adalah mengimplementasikan pola RAG sederhana dengan mengonversi data produk menjadi string dan menggabungkannya ke dalam *System Prompt*.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
AI Agent wajib menerapkan logika injeksi konteks berikut sebelum pemanggilan `streamText`:

### A. Serialisasi Data Produk
- Tepat setelah blok *query* `prisma.product.findMany`, buat logika untuk mengubah array `products` menjadi format teks yang mudah dibaca oleh LLM (misalnya menggunakan `JSON.stringify` atau pemetaan *string* sederhana yang menampilkan nama, kategori, harga, dan deskripsi produk).

### B. Modifikasi System Prompt (Injeksi Konteks)
- Temukan bagian inisialisasi `streamText`.
- Ubah *hardcoded string* pada parameter `system` menjadi sebuah *Template Literal* (backticks) yang dinamis.
- Gabungkan instruksi *System Prompt* awal dengan data produk yang sudah diserialisasi pada langkah A.
- Tambahkan instruksi eksplisit dalam bahasa Indonesia kepada AI untuk:
  1. HANYA merekomendasikan produk yang terdapat dalam daftar data yang disuntikkan tersebut.
  2. Menyebutkan nama produk dan harganya secara jelas kepada pengguna.
  3. Tetap menggunakan gaya bahasa yang ramah sebagai Virtual Stylist.

## 3. Kriteria Selesai (Acceptance Criteria)
- Variabel hasil *query* Prisma tidak lagi menganggur, melainkan masuk sebagai bagian dari instruksi *system* AI.
- Saat pengguna meminta rekomendasi (misal: "baju untuk ke pantai"), AI membalas dengan menyebutkan spesifik nama barang dan harga yang benar-benar ada di dalam *database* PostgreSQL.