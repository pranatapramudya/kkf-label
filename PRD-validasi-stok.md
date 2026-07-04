# Product Requirements Document (PRD) - Validasi Stok Habis (Out of Stock)

## 1. Konteks
Saat ini pelanggan masih bisa memasukkan produk ke dalam keranjang meskipun stok produk tersebut sudah habis (0). Hal ini berisiko menyebabkan *overselling*. Kita perlu menerapkan validasi di sisi antarmuka (UI) dan logika *backend* agar produk yang kehabisan stok tidak bisa dibeli, sampai admin menambahkan stoknya kembali.

## 2. Detail Tugas (Tasks)

**Task A: Modifikasi UI Tombol Keranjang (Frontend)**
- Buka komponen halaman detail produk yang menangani tombol "Masukkan ke Keranjang" (contoh: `AddToCartButton.tsx` atau sejenisnya).
- Buat pengecekan: JIKA `stok <= 0` (atau jika semua varian stoknya 0).
- **Perubahan Visual:**
  - Ubah teks tombol menjadi "Stok Habis".
  - Buat tombol menjadi warna abu-abu (disabled state), ubah kursor menjadi `cursor-not-allowed`.
  - Nonaktifkan fungsi klik (disable tombol secara HTML/React).

**Task B: Validasi Sisi Server (Backend/Server Action)**
- Cari fungsi API atau Server Action yang bertugas memasukkan data ke tabel keranjang (Cart).
- Tambahkan pengecekan stok langsung ke *database* (Prisma) di awal fungsi.
- JIKA stok produk/varian di database <= 0, kembalikan pesan *error* (contoh: "Gagal: Stok produk sudah habis") dan hentikan proses eksekusi (jangan lakukan `prisma.cartItem.create`).

## 3. Aturan Pengembangan (Strict Rules)
1. **NO PRODUCTION PUSH:** Dilarang keras melakukan eksekusi perintah terminal seperti `git push` atau `git commit`.
2. Semua *copywriting* UI, pesan error, dan dokumentasi kode harus menggunakan bahasa Indonesia.
3. Modifikasi kode langsung pada file yang bersangkutan di environment lokal agar developer bisa melakukan QA.