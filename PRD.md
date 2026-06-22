# PRD: KKF Label Phase 2.13 - Middleware Clerk V5 Restoration

## 1. Objective (Tujuan)
Mengembalikan `clerkMiddleware` sebagai mesin utama autentikasi untuk mencegah pengalihan liar ke beranda pelanggan (`/`), dan menyelesaikan kesalahan TypeScript (*Type Error*) tanpa mengorbankan keamanan rute.

## 2. Analisis Masalah & Solusi
- **Masalah:** Agen AI sebelumnya menghapus `clerkMiddleware`, yang mengakibatkan kegagalan pembacaan sesi di sisi peladen. Komponen klien Clerk tidak dapat memvalidasi token dan memicu pengalihan mundur ke *frontend* (`/`).
- **Solusi:** Memulihkan struktur `clerkMiddleware` resmi dan mengekstrak `userId` secara langsung dari objek sinkron `auth()` untuk menghindari galat pemanggilan metode `.protect()` pada Clerk V5.

## 3. Spesifikasi Implementasi
1. Timpa seluruh isi `middleware.ts` dengan konfigurasi `clerkMiddleware`.
2. Gunakan pengecekan `if (isAdminRoute(req) && !userId)` dengan pengecualian pada rute dasar `/admin` agar halaman masuk (*sign-in*) tetap dapat diakses oleh pengguna yang belum terautentikasi.