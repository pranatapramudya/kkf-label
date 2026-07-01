# Update PRD: Bug Fix Client-Side Routing (useRouter)

## 1. Latar Belakang Masalah
- **Next.js Error Overlay:** Muncul *error* "1 Issue" pada saat pengguna menekan tombol "Lihat Pesanan Saya" atau "Kembali ke Beranda" di dalam modal sukses pembayaran.
- **Penyebab:** Kesalahan implementasi *hook* navigasi di Next.js App Router (kemungkinan besar karena *import path* yang salah atau inisialisasi yang tertinggal).

## 2. Kebutuhan Solusi Logika (Requirement)
- **App Router Navigation:**
  - Pastikan komponen yang merender tombol tersebut menggunakan direktif `"use client"`.
  - Impor *hook* secara eksplisit: `import { useRouter } from 'next/navigation'`. (TIDAK BOLEH menggunakan `next/router`).
  - Inisialisasi *hook* di dalam komponen utama sebelum fungsi *return*: `const router = useRouter();`.
  - Bungkus pemanggilan di dalam fungsi *handler* yang benar (contoh: `onClick={() => router.push('/saya')}`).