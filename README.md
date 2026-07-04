# KKF Label - E-Commerce Platform

KKF Label adalah platform e-commerce full-stack modern yang dibangun untuk menangani transaksi penjualan, manajemen inventaris, dan pelacakan pesanan secara real-time. Aplikasi ini dilengkapi dengan *Customer Storefront* untuk pembeli dan *Admin Dashboard* untuk pengelolaan toko secara menyeluruh.

## 🚀 Tech Stack Utama
- **Framework:** Next.js 15 (App Router)
- **Bahasa Pemrograman:** TypeScript
- **Styling:** Tailwind CSS
- **Database & ORM:** PostgreSQL + Prisma ORM
- **Autentikasi:** Clerk
- **Penyimpanan Berkas (Storage):** Supabase Storage
- **Notifikasi Push:** Firebase Cloud Messaging (FCM)
- **Integrasi Pihak Ketiga:**
  - **Payment Gateway:** Midtrans (saat ini dinonaktifkan sementara/tahap pengembangan)
  - **Pengiriman (Ongkir & Resi):** Biteship API. namun untuk API nembak no resi masih di off kan dari fitur admin menu pada tombol proses
  - **Pemantauan Performa:** Vercel Speed Insights (@vercel/speed-insights)
- **Mobile Wrapper:** Capacitor (Android & iOS)

## 📦 Fitur Utama

### 🛒 Klien (Customer Storefront)
- **Katalog & Variasi Produk:** Menampilkan detail produk lengkap dengan dukungan multi-varian (Warna, Ukuran) dan galeri foto.
- **Sistem Keranjang Lokal:** Manajemen *shopping cart* yang cepat dan ringan menggunakan `localStorage` dan `React Context`.
- **Checkout Dinamis:** Penghitungan otomatis subtotal, ongkos kirim (Biteship), dan integrasi opsi pembayaran.
- **Validasi Stok Otomatis:** Mencegah pembelian (*overselling*) secara *real-time* dengan mematikan tombol di sisi UI dan melakukan validasi mutlak di sisi server saat pesanan dibuat.
- **Pelacakan Pesanan:** Pelanggan dapat mengecek status pesanan dan melakukan *tracking* posisi perjalanan paket.
- **Ulasan (Review):** Pelanggan (baik pengguna terdaftar maupun *guest*) dapat memberikan ulasan dan rating produk.
- **Technical SEO Ready:** Penerapan *Dynamic Metadata* untuk setiap produk, *Semantic HTML*, serta *auto-generation* Sitemap (`sitemap.xml`) dan `robots.txt` secara dinamis dari database.
- **Open Graph (OG) & Social Media Share Ready:** Mengintegrasikan metadata Open Graph untuk memunculkan *link preview* (gambar, judul, deskripsi) yang sempurna saat dibagikan ke WhatsApp dan media sosial lainnya. Tombol "Bagikan" dioptimasi agar selalu menyalin *Clean URL*.

### 🛡️ Admin Dashboard
- **Manajemen Produk (CRUD):** Kontrol penuh untuk tambah, edit, dan pengarsipan produk.
- **Hybrid Delete System:** Proteksi integritas data dengan sistem penghapusan ganda (*Hard Delete* + Hapus gambar di Supabase untuk produk baru; *Soft Delete/isArchived* untuk produk yang memiliki riwayat transaksi).
- **Manajemen Pesanan:** Memproses pesanan dari status *Pending* (menunggu pembayaran/verifikasi bukti transfer) hingga *Selesai*, termasuk input nomor resi pengiriman.
- **Analitik Dasbor:** Grafik interaktif performa penjualan bulanan, pantauan jumlah kunjungan produk, dan kalkulasi profitabilitas menggunakan Recharts.
- **Sistem Penyiaran Notifikasi:** Modul khusus admin untuk memancarkan (*broadcast*) notifikasi *push* ke seluruh pelanggan via FCM.

## 💻 Cara Menjalankan Proyek (Localhost)

1. **Clone Repositori**
   Pastikan Anda telah melakukan *clone* pada repositori ini di perangkat komputer Anda.

2. **Instalasi Dependensi**
   Buka terminal di dalam folder utama proyek, lalu jalankan:
   ```bash
   npm install
   ```

3. **Konfigurasi Environment Variables (`.env`)**
   Salin file `.env.example` menjadi `.env` (atau buat file baru). Lengkapi konfigurasi variabel rahasia yang dibutuhkan:
   - `DATABASE_URL` dan `DIRECT_URL` (PostgreSQL)
   - Kredensial `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan `CLERK_SECRET_KEY`
   - Kredensial Firebase, Supabase, Midtrans, dan Biteship
   *(Ingat: Jangan pernah menempatkan awalan `NEXT_PUBLIC_` pada kunci rahasia/backend untuk mencegah kebocoran).*

4. **Migrasi / Sinkronisasi Database (Prisma)**
   Sinkronkan skema Prisma dengan database PostgreSQL Anda untuk membuat tabel-tabel yang diperlukan:
   ```bash
   npx prisma db push
   ```

5. **Jalankan Development Server**
   ```bash
   npm run dev
   ```
   Akses aplikasi secara lokal melalui browser di `http://localhost:3000`.

---
*Dikelola oleh Tim Pengembangan KKF Label.*
