# Product Requirements Document (PRD) - KKF Label
**Platform**: E-Commerce B2C & Admin Dashboard (Web & Android APK via Capacitor)
**Bahasa Pengantar Code & UI**: Bahasa Indonesia

## 1. Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: Clerk (Multi-role: Admin & Customer)
- **Payment Gateway**: Midtrans API (QRIS, E-Wallet, Virtual Account)
- **Logistics API**: Biteship (Cek Ongkir & Generate Resi/Waybill)

## 2. Arsitektur Database Utama (Prisma Schema Context)
Sistem memiliki tabel pesanan (Order) yang menyimpan riwayat transaksi. Parameter yang krusial untuk fitur logistik adalah nomor resi pengiriman.
- Model `Order` berelasi dengan `User` dan `Product`.
- Status pesanan biasanya: `PENDING`, `PAID`, `PROCESSED`, `SHIPPED`, `COMPLETED`.
- Kolom untuk menyimpan nomor resi dari Biteship adalah `trackingNumber` (String, opsional/nullable).

## 3. Alur Kerja Modul "Pesanan" (Admin Dashboard)
- **Lokasi UI**: Menu "Pesanan" pada dashboard admin.
- **Tujuan Utama**: Admin memproses pesanan yang sudah dibayar (`PAID`).
- **Fitur Cetak & Resi**: Pada detail pesanan, terdapat fitur "Cetak". Saat ini, nomor resi masih berstatus *hardcode* teks "resi menyusul".
- **Target Integrasi Biteship**: Saat pesanan diproses atau dicetak, sistem harus melakukan POST request ke API Biteship menggunakan `BITESHIP_API_KEY` untuk melakukan `Create Order / Waybill`. Respon resi dari Biteship harus disimpan ke database (Prisma) dan langsung dirender menggantikan teks "resi menyusul".

## 4. Panduan untuk AI Agent
- Pastikan semua error handling menampilkan notifikasi UI yang jelas (misal menggunakan toast) dalam Bahasa Indonesia.
- Jangan mengubah flow autentikasi Clerk yang sudah berjalan di Edge/Server components.
- Lakukan validasi ketersediaan `BITESHIP_API_KEY` di server sebelum mengeksekusi request.