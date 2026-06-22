# PRD: KKF Label Phase 2.16 - Clerk V5 Global Sign-Out Redirect

## 1. Objective (Tujuan)
Memaksa sistem Clerk V5 untuk mengarahkan pengguna ke halaman otentikasi (`/sign-in`) setelah proses keluar (*logout*), mengesampingkan pengalihan paksa ke rute bawaan (`/`).

## 2. Analisis Masalah & Solusi
- **Masalah:** Komponen `<UserButton>` pada versi Clerk V5/Core 2 telah mencabut properti pengalihan individual, sehingga pengakhiran sesi akan selalu dikembalikan ke beranda (`/`), dan mengabaikan *Environment Variables*.
- **Solusi:** Menambahkan properti `afterSignOutUrl="/sign-in"` secara global pada komponen pelapis utama `<ClerkProvider>`.