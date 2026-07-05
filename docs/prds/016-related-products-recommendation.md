# Product Requirements Document (PRD) - Algoritma Produk Terkait (Cross-selling)

## 1. Konteks
Untuk meningkatkan retensi dan konversi, halaman Detail Produk (Product Detail Page / PDP) memerlukan bagian "Produk Lainnya" atau "Rekomendasi untuk Anda" di bagian paling bawah setelah deskripsi dan ulasan. Fitur ini mengadopsi pola UX e-commerce besar dengan menampilkan daftar produk dalam layout grid 2 kolom (mobile).

## 2. Detail Tugas (Tasks)

**Task A: Pembuatan Fungsi Fetching Rekomendasi (Backend/Prisma)**
- Buat fungsi query Prisma baru (atau modifikasi yang ada) untuk mengambil data produk terkait.
- Logika Algoritma (Content-Based):
  1. Wajib mengecualikan ID produk yang sedang dilihat (`id: { not: currentProductId }`).
  2. Ambil maksimal 10 produk dengan prioritas `kategori_id` yang sama dengan produk saat ini.
  3. Jika hasilnya kurang dari 10, ambil sisa kekurangannya dari produk terbaru secara acak/berurutan dari kategori lain.

**Task B: Integrasi UI di Halaman Detail Produk (Frontend)**
- Buka komponen halaman Detail Produk Klien (`app/(main)/produk/[slug]/page.tsx` atau sejenisnya).
- Di bagian paling bawah (sebelum footer/bottom nav), tambahkan section baru dengan judul "Mungkin Anda Suka" atau "Produk Lainnya".
- Re-use (gunakan kembali) komponen `ProductCard` atau `Grid` 2 kolom yang sama persis seperti yang digunakan di halaman `/katalog`.

**Task C: Penyesuaian Responsif & Padding**
- Pastikan grid 2 kolom ini rapi di tampilan mobile.
- Berikan padding bawah (`pb-28` atau lebih) yang memadai agar deretan produk paling bawah tidak tertutup oleh tombol "Masukkan Keranjang" yang biasanya *sticky/fixed* di bagian bawah layar.

## 3. Aturan Pengembangan (Strict Rules)
1. **REUSABILITY:** Gunakan komponen UI yang sudah ada untuk mempercepat pengembangan dan menjaga konsistensi desain.
2. **NO GIT PUSH/COMMIT:** Lakukan perubahan HANYA di lingkungan localhost.