# Update PRD: Fitur Notifikasi "Abandoned Cart" (Keranjang Tertinggal) via Firebase

## 1. Latar Belakang
- Banyak pembeli yang memasukkan barang ke keranjang namun lupa atau menunda proses checkout.
- Sistem sudah memiliki konfigurasi Firebase Admin SDK yang sebelumnya digunakan untuk notifikasi pesanan masuk ke admin.
- Dibutuhkan fitur otomatisasi *marketing* yang mengingatkan pelanggan melalui *Push Notification* di perangkat mereka jika keranjang dibiarkan lebih dari 24 jam.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Database (Prisma):**
  - Tambahkan kolom `fcmToken` (tipe String, opsional/nullable) pada tabel `User` atau entitas pelanggan. Kolom ini berfungsi menyimpan token notifikasi dari perangkat pelanggan.
- **Frontend (Klien):**
  - Buat mekanisme untuk meminta izin notifikasi (*Notification Permission*) kepada pengguna yang sedang *login* atau berinteraksi di toko.
  - Ambil FCM Token menggunakan Firebase Client SDK, lalu kirimkan token tersebut ke *backend* untuk disimpan di *database* (di-bind dengan data user).
- **Backend (Cron Job / API Route):**
  - Buat endpoint baru khusus cron job di `app/api/cron/abandoned-cart/route.ts`.
  - Endpoint ini bertugas menarik data dari tabel `Cart` (Keranjang) yang memenuhi kriteria:
    1. Memiliki item di dalamnya.
    2. Status keranjang belum di-*checkout*.
    3. `updatedAt` (terakhir diubah) sudah lebih dari 24 jam yang lalu.
    4. Pengguna/User pemilik keranjang memiliki `fcmToken` yang tidak *null*.
  - *Looping* data tersebut dan kirimkan notifikasi massal melalui Firebase Admin SDK.
- **Konfigurasi Vercel:**
  - Siapkan file `vercel.json` di *root directory* untuk menjadwalkan *trigger* endpoint cron job ini (misal: berjalan setiap hari jam 12.00 siang).
  - Teks notifikasi wajib menggunakan bahasa Indonesia yang persuasif.