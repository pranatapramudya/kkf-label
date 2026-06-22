# PRD: KKF Label Phase 2.11 - Admin Logout Redirect Destination Fix

## 1. Objective (Tujuan)
Memperbaiki perilaku pengalihan rute (*redirect*) pasca-keluar (*logout*) pada panel admin agar pengguna diarahkan kembali ke halaman masuk admin (`/admin`), bukan ke halaman beranda utama pelanggan (`/`).

## 2. Analisis Masalah & Solusi
- **Masalah:** Komponen *Sign Out* pada Clerk secara bawaan diatur untuk mengarahkan pengguna ke akar domain (`/`) setelah sesi diakhiri. Hal ini membuat aplikasi Android admin memuat halaman utama toko e-commerce.
- **Solusi:** Memodifikasi komponen pembungkus autentikasi atau tombol *Sign Out* khusus di area admin dengan menambahkan properti `afterSignOutUrl` (atau `redirectUrl`) yang dipaksa menuju rute `/admin`.

## 3. Spesifikasi Implementasi
1. Cari komponen *Sign Out* atau `UserButton` Clerk yang digunakan pada dasbor admin.
2. Tambahkan atau ubah parameter rute setelah keluar menjadi `afterSignOutUrl="/admin"`.