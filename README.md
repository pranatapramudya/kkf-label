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
- **Progressive Web App (PWA):** `@ducanh2912/next-pwa` (Workbox)
- **Arsitektur Mobile:** PWA Standalone (menggantikan Capacitor)

## 📦 Fitur Utama

### 🛒 Klien (Customer Storefront)
- **AI Virtual Stylist (RAG & Gemini):** Asisten belanja cerdas bertenaga Gemini 2.5 Flash dan pola arsitektur RAG (Retrieval-Augmented Generation). AI mampu membaca katalog produk KKF Label dan memberikan rekomendasi gaya, dilengkapi UX interaktif (*Quick Reply Chips*) dan proteksi *Rate Limiting* ganda untuk keamanan *endpoint*.
- **Modern App-like Icon Grid Navigation:** Desain beranda (*Hero section*) mengadopsi UI "Super App" bergaya grid ikon minimalis. Menggantikan tombol tumpuk tradisional dengan modul navigasi horizontal yang elegan, responsif, hemat ruang vertikal, serta didukung animasi *hover* halus yang interaktif untuk meningkatkan pengalaman (*UX*) pengguna.
- **Dynamic Latest Products:** Beranda secara otomatis dan dinamis memuat rilisan produk terhangat langsung dari database secara *real-time*, memastikan etalase selalu relevan tanpa perlu intervensi manual dari *developer*.
- **Halaman Semua Katalog Khusus Mobile:** Menyajikan seluruh produk aktif dalam layout grid 2 kolom yang sangat responsif, dilengkapi sistem filter kategori dinamis dan fitur *Infinite Scroll/Pagination* (Load More per 10 produk) untuk navigasi yang ringan dan presisi di layar HP. Antarmuka telah disempurnakan dengan *Safe Area / Bottom Padding* khusus agar konten tidak tertutup elemen mengambang, serta perbaikan *state* presisi pada Bottom Navigation.
- **Infinite Auto-Scroll Carousel:** Menyajikan galeri kategori produk di halaman Beranda dengan efek *seamless loop marquee* super ringan (murni CSS Tailwind tanpa *library* eksternal), lengkap dengan durasi dinamis yang proporsional dan interaksi *pause-on-hover*.
- **Dynamic Social Proof (Rating & Sold Count):** Menampilkan data rating bintang dan jumlah terjual secara dinamis pada katalog produk sebagai bukti sosial nyata (*social proof*). Sistem ini mengagregasi data relasional ulasan dan transaksi sukses secara efisien dari Prisma untuk menumbuhkan *trust* pembeli.
- **Katalog & Variasi Produk:** Menampilkan detail produk lengkap dengan dukungan multi-varian (Warna, Ukuran) dan galeri foto. Sistem mendukung "Visual RGB Color Variants" untuk pengalaman UI yang lebih interaktif, termasuk rendering Visual RGB Color Badge pada halaman checkout, riwayat pesanan, dan cetak resi A6.
- **Cross-Selling Recommendation:** Halaman Detail Produk dilengkapi dengan section "Mungkin Anda Suka" di bagian bawah yang secara cerdas merekomendasikan produk lain berdasarkan kategori serupa, guna meningkatkan retensi dan *conversion rate*.
- **Sistem Keranjang Lokal:** Manajemen *shopping cart* yang cepat dan ringan menggunakan `localStorage` dan `React Context`.
- **Recently Viewed Products (Nol-Beban Database):** Menyimpan histori produk yang terakhir dilihat pengunjung langsung ke dalam *localStorage* browser. Pendekatan ini memungkinkan fitur "Terakhir Kamu Lihat" beroperasi seketika tanpa perlu membebani database dengan *query* berulang.
- **Dynamic Price Sorting:** Pengunjung dapat mengurutkan katalog berdasarkan harga (termurah ke termahal atau sebaliknya) secara mulus. *State* pengurutan dipertahankan melalui parameter URL (`?sort=asc/desc`) yang langsung diproses oleh Prisma ORM di level server.
- **Checkout & Kalkulasi Ongkir Cerdas (Biteship):** Penghitungan otomatis ongkos kirim secara dinamis (*debounced auto-fetch*) dengan penyesuaian payload *Array Items Mapping*. Mendukung perhitungan volumetrik untuk pengiriman reguler dan kalkulasi presisi *Distance-Based Pricing* beserta batasan muatan maksimum (20kg) untuk kurir Instan (Gojek).
- **Manajemen Stok Anti-Overselling:** Mengintegrasikan validasi kuantitas *real-time* secara hibrida di keranjang UI (penguncian limit otomatis) dan *backend* guna mengeleminasi risiko pesanan berlebih.
- **Pembatalan Pesanan Mandiri (Manual Order Cancellation):** Pengguna dapat membatalkan pesanan *Transfer Manual* yang berstatus *Pending* secara mandiri melalui dasbor akun. Aksi ini memicu eksekusi *Atomic Stock Rollback* via Prisma Transaction yang mengembalikan kuantitas barang ke dalam basis data gudang seketika itu juga, mengeleminasi kemungkinan penahanan stok akibat pesanan *Hit and Run*.
- **Pelacakan Pesanan:** Pelanggan dapat mengecek status pesanan dan melakukan *tracking* posisi perjalanan paket.
- **Ulasan (Review):** Pelanggan (baik pengguna terdaftar maupun *guest*) dapat memberikan ulasan dan rating produk.
- **Technical SEO Ready:** Penerapan *Dynamic Metadata* untuk setiap produk, *Semantic HTML*, serta *auto-generation* Sitemap (`sitemap.xml`) dan `robots.txt` secara dinamis dari database.
- **Open Graph (OG) & Social Media Share Ready:** Mengintegrasikan metadata Open Graph untuk memunculkan *link preview* (gambar, judul, deskripsi) yang sempurna saat dibagikan ke WhatsApp dan media sosial lainnya. Tombol "Bagikan" dioptimasi agar selalu menyalin *Clean URL*.
- **Progressive Web App (PWA):** Aplikasi dapat dipasang (*installable*) langsung dari browser ke layar utama perangkat, berjalan dalam mode *Standalone* layaknya aplikasi native tanpa *address bar*. Didukung oleh *Service Worker* berbasis Workbox untuk *aggressive caching* dan navigasi offline-ready.
- **Custom PWA Install & Notification Prompt (Glassmorphism Bottom-Sheet):** Menggantikan dialog browser bawaan yang kaku dengan antarmuka *bottom-sheet drawer* bergaya *glassmorphism* (`backdrop-blur`, `bg-white/95`) yang konsisten dengan identitas visual KKF Label. Sistem menerapkan *deferred prompting* (30 detik setelah kunjungan pertama) dan *anti-spam cooldown* (7 hari via `localStorage`) agar tidak mengganggu pengalaman belanja. Mendukung dua mode: instalasi native via `beforeinstallprompt` untuk Android/Chrome, dan panduan visual manual (*Share → Add to Home Screen*) khusus untuk pengguna iOS Safari.
- **Marketplace-Style UI:** Penambahan label lokasi statis ("Sumedang, Jawa Barat") pada kartu produk menggunakan strategi *truncate* Tailwind untuk meningkatkan kepercayaan pelanggan tanpa membebani query database.
- **Mobile-First PWA Layout:** Penyesuaian *clearance* komponen Footer agar tidak tertutup oleh *Bottom Navigation Bar* dan *Home Indicator* (iOS Safe Area) saat berjalan dalam mode PWA Standalone.


### ⚡ Keamanan & Performa Tingkat Lanjut (Premium SaaS Grade)
- **Automated Inventory Recovery (Anti-Hit & Run):** Melindungi ketersediaan stok barang (menghindari fenomena *Ghost Stock*) dengan membatalkan pesanan secara otomatis dan memulihkan stok yang dipesan jika pembeli tidak melakukan transfer dalam kurun waktu 24 jam menggunakan Cron Job.
- **Keamanan Lapis Baja (Dual-Layer Anti-Bot):** Melindungi integritas platform dari serangan *spam* dan eksploitasi otomatis menggunakan formulir ber-DNA **Cloudflare Turnstile (Invisible Mode)** yang beroperasi tanpa merusak pengalaman pengguna (UX). Dilengkapi pula dengan tameng pelindung **API Rate Limiting** untuk memblokir anomali lonjakan *traffic* berbahaya dari satu alamat IP.
- **Navigasi Zero-Delay (Kecepatan Native):** Perpindahan antar-menu dan modul data dioperasikan tanpa hambatan visual sedikit pun (*Zero-Delay*), memanfaatkan kolaborasi *Stale-While-Revalidate* (SWR) dan teknologi *Aggressive Prefetching*. Next.js secara proaktif menelan data di latar belakang hanya dengan sorotan kursor (*hover*), memunahkan kebutuhan *Loading Spinner* berlarut-larut.
- **Optimasi Backend & Kueri Paralel (Prisma):** Arsitektur pangkalan data telah diperas ke level tertingginya. Operasi masif dan agregasi analitik tidak lagi mengantri secara sekuensial; melainkan diterjang secara serentak via `Promise.all`. Kueri tabel juga dibatasi ketat menggunakan seleksi parsial (*Selective Fields Payload*) dan *Row Limitation* demi mencegah kebocoran RAM dan memangkas waktu *Total Blocking Time (TBT)* lebih dari separuh.
- **Inklusivitas & Aksesibilitas Web (A11y):** Berpedoman pada standar audit global, setiap sisi antarmuka (*UI*) kini dijamin kompatibel bagi pengguna disabilitas. Hal ini dicapai melalui penyetelan rasio kontras warna sekunder yang lebih tegas, penerapan atribut ARIA (`aria-label`) komprehensif, pelebaran zona sentuh interaktif, dan kebebasan konfigurasi perbesaran layar (*Viewport Scaling*).

### 🛡️ Admin Dashboard
- **Auto-Compress Upload:** Gambar produk yang diunggah dikompresi otomatis secara *Client-Side* memanfaatkan HTML5 Canvas API (resize proporsional maksimal 1200px dan kualitas JPEG 70%) demi menghemat *bandwidth* server dan kapasitas Supabase Storage.
- **Manajemen Produk (CRUD):** Kontrol penuh untuk tambah, edit, dan pengarsipan produk. Dilengkapi dengan "Client-Side Dominant Color Scanner" di mana admin dapat mengekstrak warna dominan (Hex) secara otomatis dari foto hanya dengan mengklik tombol "Scan Warna" pada setiap baris varian.
- **Hybrid Delete System:** Proteksi integritas data dengan sistem penghapusan ganda (*Hard Delete* + Hapus gambar di Supabase untuk produk baru; *Soft Delete/isArchived* untuk produk yang memiliki riwayat transaksi).
- **Manajemen Pesanan:** Memproses pesanan dari status *Pending* (menunggu pembayaran/verifikasi bukti transfer) hingga *Selesai*, termasuk input nomor resi pengiriman.
- **Analitik Dasbor:** Grafik interaktif performa penjualan bulanan, pantauan jumlah kunjungan produk, dan kalkulasi profitabilitas menggunakan Recharts.
- **Sistem Penyiaran Notifikasi:** Modul khusus admin untuk memancarkan (*broadcast*) notifikasi *push* ke seluruh pelanggan via FCM.
- **PWA Admin Shortcut (Easter Egg):** Akses pintu belakang (*backdoor*) yang sama sekali tidak kasat mata bagi pelanggan umum. Tahun hak cipta ("2026") di *Footer* seluruh halaman pelanggan berfungsi sebagai tautan ajaib menuju panel `/admin` saat diklik/di-tap. Fitur ini sengaja disamarkan (`outline-none text-inherit`) agar admin bisa masuk sistem langsung dari PWA *Standalone* dengan satu sentuhan tanpa perlu mengetik URL.
- **Optimasi Aksesibilitas (A11y) Penuh pada Dashboard Admin:** Aksesibilitas tingkat tinggi yang memastikan navigasi dan operasional dashboard ramah disabilitas.
- **Security: Cloudflare Turnstile Anti-Bot & Rate Limiting:** Melindungi *endpoint* dari serangan spam bot menggunakan verifikasi *invisible* Turnstile di sisi klien dan perlindungan *rate limiting* in-memory di sisi server.

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

## 🚀 Panduan Deployment & Transisi Production (Web & PWA)

Ketika platform KKF Label beralih dari fase **Development** ke **Production**, ada penyesuaian khusus yang sangat krusial:

1. **Isolasi Database User (Clerk)**
   Lingkungan Development dan Production di Clerk memiliki pangkalan data (database) *user* yang terisolasi total. Semua *user* yang terdaftar saat pengembangan tidak akan terbawa ke tahap *live*. Oleh karena itu, Admin **WAJIB melakukan registrasi ulang (Sign Up)** di domain production menggunakan email yang telah terdaftar dalam *Whitelist* (seperti `kkflabel@gmail.com`) agar dapat kembali mengakses menu `/admin`.
2. **Environment Variables Vercel vs Localhost**
   Kunci rahasia Production (`pk_live_...` & `sk_live_...`) dilarang diletakkan pada file `.env` lokal (localhost) untuk mencegah *error* atau penolakan akses oleh Clerk. Kunci Production ini harus murni diinjeksi melalui panel *Environment Variables* di dashboard Vercel.
3. **Google OAuth Custom Credentials**
   Fitur "Continue with Google" yang sebelumnya dipinjamkan oleh Clerk secara otomatis di mode pengembangan akan diblokir di Production. Sistem wajib diatur secara mandiri menggunakan kredensial kustom (*Client ID* & *Client Secret*) dari Google Cloud Console. Alternatif tercepatnya adalah menonaktifkan Social Login via Google dan hanya mengizinkan *Email/OTP Login* dari dashboard Clerk.
4. **Deployment PWA (Service Worker & Manifest)**
   Service Worker (`sw.js`) dan file Workbox pendukungnya di-*generate* secara otomatis oleh `@ducanh2912/next-pwa` saat proses `next build`. File-file ini di-*output* ke folder `public/` dan telah terdaftar di `.gitignore` agar tidak masuk *repository*. Vercel akan secara otomatis menjalankan proses *build* dan menyajikan Service Worker tanpa konfigurasi tambahan. Pastikan `manifest.json` dan file ikon PNG (`icon-192x192.png`, `icon-512x512.png`) sudah berada di folder `public/`.

> **Catatan Migrasi (PRD-058):** Arsitektur *Mobile Wrapper* Capacitor dan direktori `/android` telah sepenuhnya dihapus dari *repository*. Aplikasi mobile kini dilayani murni melalui PWA yang dapat dipasang langsung dari browser. Repositori Next.js ini berfokus pada Web & Backend API, menyiapkan fondasi bersih untuk ekspansi aplikasi mobile native (Flutter) di masa mendatang.

---
*Dikelola oleh Tim Pengembangan KKF Label.*
