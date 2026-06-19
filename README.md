# 🛍️ KKF Label - Premium E-Commerce SaaS Platform

![Next.js](https://img.shields.io/badge/Next.js-14%2B-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)
![Midtrans](https://img.shields.io/badge/Midtrans-Payment_Gateway-00A6DF?style=for-the-badge)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-success?style=for-the-badge&logo=vercel)

Platform _e-commerce_ modern, _ultra-fast_, dan responsif yang dirancang dengan arsitektur **SaaS Premium**. KKF Label tidak hanya berfungsi sebagai etalase digital, tetapi juga sebagai mesin kasir otomatis dengan integrasi _payment gateway_ langsung dan panel manajemen berbasis _Cloud_ untuk kemudahan operasional tingkat lanjut.

## 🚀 Teknologi Pendukung (Tech Stack)

- **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript (Strict Type-Safe)
- **Styling:** Tailwind CSS + Lucide Icons
- **Database ORM:** Prisma
- **Database & Storage:** Supabase (PostgreSQL)
- **Authentication:** Clerk (Standar Keamanan Enterprise)
- **Payment Gateway:** Midtrans (QRIS, GoPay, Virtual Account)

## ✨ Fitur Unggulan

- **Checkout Mulus & Pembayaran Langsung:** Sistem _checkout_ cerdas dengan perhitungan harga otomatis yang terintegrasi langsung dengan **Midtrans (Live Production)**. Mendukung pembayaran QRIS dan _e-wallet_ melalui _pop-up snap_ tanpa meninggalkan halaman web.
- **Etalase Interaktif & Auto-Play Media:** Katalog produk dinamis dengan dukungan _Auto-Play Video_ (iOS/Android _Ready_) yang teroptimasi, serta galeri foto cerdas (resolusi tinggi tanpa _layout shift_).
- **Mobile-First UX (Standar Industri):** Antarmuka yang beradaptasi sempurna di layar _mobile_, dilengkapi _Bottom Sheet Modal_ instan saat proses _Add to Cart_ dan navigasi mulus ala aplikasi _native_.
- **Admin Dashboard Eksklusif:** Panel manajemen pro (_Layout_ Tabel & Kartu) yang diamankan oleh sistem autentikasi Clerk. Kebal dari injeksi dan _bypass_, hanya dapat diakses oleh _Owner_.
- **Sistem Manajemen Produk Lanjutan (CRUD):** Kontrol penuh atas produk, stok, dan Varian (Ukuran/Warna). Mendukung integrasi multi-media langsung ke Supabase Storage.

## 📌 Status Pengembangan (Roadmap)

- [x] **Sistem Autentikasi Admin:** Pengamanan _dashboard_ menggunakan Clerk.
- [x] **Deployment Vercel:** Konfigurasi _build_ dan peluncuran kode ke _server production_.
- [x] **Integrasi Payment Gateway:** Menyambungkan API **Midtrans (Live)** untuk pemrosesan pembayaran otomatis via QRIS & GoPay.
- [ ] **Integrasi API Ongkir:** Menyambungkan sistem dengan layanan tarif pengiriman pihak ketiga secara _real-time_.
- [ ] **Automasi Notifikasi WhatsApp:** Pengiriman _invoice_ ke pelanggan melalui bot pihak ketiga.

## 🛠️ Panduan Instalasi (Lokal)

Ingin menjalankan proyek ini di mesin lokal Anda? Ikuti panduan berikut:

**1. Clone repositori & Install dependensi**

```bash
git clone [https://github.com/username/kkf-label.git](https://github.com/username/kkf-label.git)
cd kkf-label
npm install
2. Pengaturan Environment Variables
Buat file .env di root direktori proyek dan masukkan kredensial berikut:

Cuplikan kode
# Database & Storage (Supabase)
DATABASE_URL="postgresql://postgres.[PROYEK_SUPABASE]:[PASSWORD]@[aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true](https://aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true)"
DIRECT_URL="postgresql://postgres.[PROYEK_SUPABASE]:[PASSWORD]@[aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres](https://aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres)"
NEXT_PUBLIC_SUPABASE_URL="https://[PROYEK_SUPABASE].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="kunci_anon_supabase"

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/admin
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/admin

# Payment Gateway (Midtrans)
MIDTRANS_MERCHANT_ID="M..."
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY="Mid-client-..."
MIDTRANS_SERVER_KEY="Mid-server-..."
3. Sinkronisasi Database (Prisma)
Generate client Prisma dan dorong skema ke database Supabase Anda:

Bash
npx prisma generate
npx prisma db push
4. Jalankan Server Development

Bash
npm run dev
Buka http://localhost:3000 di browser untuk melihat etalase publik, atau arahkan ke /admin untuk masuk ke Dashboard Manajemen.

📄 Lisensi
Hak Cipta © 2026 KKF Label. Seluruh hak dilindungi. Sistem SaaS E-Commerce eksklusif yang dikembangkan khusus untuk kelancaran operasional bisnis.
```
