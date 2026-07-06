# PRD: 022 Automasi Pembatalan Pesanan & Pengembalian Stok (Ghost Stock Fix)

## 1. Konteks
Saat ini KKF Label menggunakan sistem pembayaran transfer bank manual. Ketika pelanggan melakukan checkout, stok produk langsung dipotong untuk menghindari overselling. Namun, sistem belum memiliki mekanisme otomatis untuk mengembalikan stok jika pelanggan melakukan "hit and run" (tidak mentransfer dana setelah lebih dari 24 jam). Hal ini menimbulkan risiko "Ghost Stock" (stok habis di sistem, tetapi barang fisik masih ada).

## 2. Tujuan
- Membuat atau memodifikasi cron job API route yang berjalan secara berkala untuk mengecek pesanan kedaluwarsa.
- Membatalkan pesanan secara otomatis jika statusnya `MENUNGGU_PEMBAYARAN` dan usianya sudah melewati 24 jam.
- Mengembalikan (increment) stok produk dan varian yang terkait dengan pesanan batal tersebut agar bisa dibeli oleh pelanggan lain.

## 3. Persyaratan Fungsional (Requirements)
- **Target Data:** Cari semua `Pesanan` dengan status `MENUNGGU_PEMBAYARAN` dimana `createdAt` < (Waktu Sekarang - 24 Jam).
- **Database Transaction (Prisma):** Proses ini wajib menggunakan `prisma.$transaction` agar data tetap konsisten. Jika proses pengembalian stok gagal di tengah jalan, status pesanan tidak boleh berubah menjadi batal.
- **Logika Pengembalian Stok:** 
  - Loop/iterasi setiap `OrderItem` di dalam pesanan yang kedaluwarsa.
  - Lakukan `increment` pada field `stok` di model `Product` (dan `ProductVariant` jika menggunakan varian ukuran/warna) sesuai dengan `quantity` yang dibeli.
- **Update Status:** Ubah status pesanan menjadi `DIBATALKAN`.

## 4. Pembaruan Dokumentasi (Wajib)
Setelah logika cron job selesai, developer (AI) wajib memperbarui dua file dokumentasi:
- `README.md`: Tambahkan fitur "Automated Ghost Stock Recovery" atau sejenisnya di bagian fitur unggulan.
- `SYSTEM_ARCHITECTURE.md`: Tambahkan penjelasan teknis bagaimana cron job menangani pengembalian stok tanpa mengorbankan performa database (menggunakan Prisma Transactions).