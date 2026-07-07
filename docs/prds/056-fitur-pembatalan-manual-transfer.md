# PRD 056: Arsitektur Fitur Pembatalan Pesanan (Manual Transfer) & Rollback Stok

## 1. Konteks & Tujuan
Terdapat celah operasional pada alur pembayaran transfer manual. Pengguna yang sudah melakukan *checkout* belum memiliki opsi untuk membatalkan pesanan secara mandiri. Hal ini dapat menyebabkan pesanan menggantung dengan status 'PENDING' dan menahan stok produk di *database*, sehingga pengguna lain tidak bisa membelinya.
Tujuan PRD ini adalah merancang antarmuka pembatalan pesanan untuk pelanggan, serta logika *backend* yang secara aman mengubah status pesanan dan mengembalikan (*rollback*) stok produk ke jumlah semula.

## 2. Instruksi Eksekusi Backend (API Pembatalan Pesanan)
AI Agent wajib membuat atau memodifikasi *endpoint* API khusus untuk menangani pembatalan (misal: `app/api/orders/[id]/cancel/route.ts`):

### A. Validasi Otorisasi & Status
- Pastikan *request* valid dan berasal dari pengguna yang memiliki pesanan tersebut.
- Cek status pesanan saat ini di *database*. Pesanan HANYA boleh dibatalkan jika statusnya masih `PENDING` atau `UNPAID`, dan metode pembayarannya adalah Transfer Manual. (Jika pesanan sudah diproses, dikirim, atau dibayar, tolak pembatalan).

### B. Transaksi Database (Prisma $transaction)
- Proses pembatalan wajib dibungkus dalam blok `prisma.$transaction` agar bersifat atomik (sukses semua atau gagal semua).
- **Langkah 1:** Ubah status pesanan (Order) menjadi `CANCELLED` atau `DIBATALKAN`.
- **Langkah 2 (Rollback Stok):** Lakukan iterasi pada setiap detail *item* di dalam pesanan tersebut. Kembalikan (tambahkan) jumlah kuantitas produk ke kolom stok di tabel `Product`. (Gunakan instruksi `increment: item.quantity`).

## 3. Instruksi Eksekusi Frontend (Halaman Detail Pesanan)
AI Agent wajib menambahkan antarmuka pengguna untuk memicu pembatalan:

### A. Tombol Pembatalan Dinamis
- Pada halaman Riwayat Pesanan atau Detail Pesanan pengguna (`app/(main)/pesanan/[id]/page.tsx`), tambahkan tombol "Batalkan Pesanan".
- Tombol ini harus bersifat dinamis: Hanya muncul/terender JIKA status pesanan adalah `PENDING` (Belum Dibayar). Warnai tombol dengan warna peringatan (misal: merah/garis tepi merah).

### B. Modal Konfirmasi & Umpan Balik
- Saat pengguna mengklik tombol tersebut, jangan langsung mengirimkan API *request*. Tampilkan *Modal* (Pop-up) konfirmasi terlebih dahulu: *"Apakah Anda yakin ingin membatalkan pesanan ini? Aksi ini tidak dapat diurungkan."*
- Jika pengguna mengonfirmasi, jalankan *request* ke API Backend, berikan *loading state* (tombol berputar/disabled), dan tampilkan notifikasi (*toast*) sukses jika pembatalan berhasil, lalu *refresh* halaman agar status pesanan dan opsi tombol diperbarui.

## 4. Kriteria Selesai (Acceptance Criteria)
- Pengguna dapat membatalkan pesanan transfer manual yang belum dibayar.
- Saat pesanan dibatalkan, stok produk yang sebelumnya terpotong akan kembali bertambah di katalog PostgreSQL secara akurat.
- Pesanan dengan status selain PENDING tidak memiliki akses ke tombol pembatalan.