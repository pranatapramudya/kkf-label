# PRD: KKF Label Phase 2.15 - Correct Auth Node Routing

## 1. Objective (Tujuan)
Memperbaiki alur pengalihan (*redirect*) pada sistem autentikasi pusat agar pengguna yang tidak memiliki sesi di rute `/admin` diarahkan ke rute otentikasi yang benar (`/sign-in`), bukan ke beranda utama (`/`).

## 2. Analisis Masalah & Solusi
- **Masalah:** Terjadi bentrokan logika karena pelindung rute memaksa penahanan di `/admin`, padahal komponen antarmuka masuk (UI Sign-In) berada di rute `/sign-in`. Kegagalan resolusi rute ini memicu aksi bawaan Clerk yang melempar pengguna ke akar domain (`/`). Kegagalan ini terkonfirmasi terjadi secara global (Web PC dan Android).
- **Solusi:** Memperbarui `clerkMiddleware` untuk secara eksplisit mencegat permintaan tak terautentikasi ke `/admin(.*)` dan mengarahkannya ke `new URL('/sign-in', req.url)`.