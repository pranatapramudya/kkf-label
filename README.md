# 🛍️ KKF Label E-Commerce Platform

Platform e-commerce modern, cepat, dan responsif yang dirancang khusus untuk memanajemen penjualan dan inventaris toko KKF Label. Dibangun dengan antarmuka berkelas _SaaS premium_ untuk kemudahan operasional admin melalui berbagai perangkat (PC maupun Mobile/iOS).

## 🚀 Teknologi yang Digunakan

- **Framework:** Next.js (App Router)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS + Lucide Icons
- **Database ORM:** Prisma
- **Database & Penyimpanan:** Supabase (PostgreSQL & Storage)
- **Authentication:** Clerk (Sistem Auth Premium & Aman)

## ✨ Fitur Utama (Terbaru)

- **Etalase & Galeri Interaktif:** Katalog produk dinamis dengan sistem _Auto-Play Video_ produk (Maks 15MB) dan galeri foto cerdas yang otomatis berubah mengikuti varian yang dipilih pengguna.
- **Mobile-First UX (Ala Shopee):** Dilengkapi fitur _Bottom Sheet Modal_ yang mulus saat pengguna menekan tombol Keranjang/Beli di perangkat HP, serta fitur _Read More_ untuk deskripsi produk yang panjang.
- **Keranjang Belanja Cerdas & Diskon Otomatis:** Manajemen _state_ keranjang yang akurat dengan sistem kalkulasi Harga Coret (Diskon) otomatis. Dilengkapi notifikasi _toast_ interaktif.
- **Admin Dashboard Premium:** Panel manajemen dengan tampilan UI/UX yang _ultra-responsive_ (Layout Tabel untuk PC dan Layout Kartu untuk Mobile).
- **Sistem Autentikasi Super Aman:** Dashboard `/admin` dikunci menggunakan Clerk. Hanya _Owner_ yang dapat mengakses panel manajemen, kebal dari injeksi dan bypass.
- **Sistem Manajemen Produk Lanjutan (CRUD):** Pembuatan, pengeditan, dan penghapusan produk beserta Varian (Ukuran & Warna). Admin dapat menambah atau menimpa Foto dan Video secara langsung di halaman Edit.
- **Upload Multi-Media:** Integrasi mulus dengan Supabase Storage untuk mengunggah lebih dari satu foto dan video berdurasi pendek secara bersamaan langsung dari PC atau Galeri HP.

## 📌 Roadmap Selanjutnya (To-Do List)

- [x] **Sistem Autentikasi Admin:** Menambahkan pengamanan login (Auth) menggunakan Clerk.
- [ ] **Deployment Vercel:** Persiapan dan peluncuran kode ke server _production_ (Sedang Berjalan 🚀).
- [ ] **Integrasi API Ongkir Asli:** Menyambungkan sistem dengan layanan (seperti RajaOngkir/BinderByte) untuk tarif pengiriman _real-time_.
- [ ] **Integrasi Payment Gateway:** Mengaktifkan API **Midtrans** agar pelanggan dapat membayar via QRIS, GoPay, atau Virtual Account.

## 🛠️ Panduan Instalasi (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di mesin lokal Anda:

**1. Clone repositori & Install dependensi**
\`\`\`bash
npm install
\`\`\`

**2. Pengaturan Environment Variables**
Buat file `.env` di _root_ direktori dan masukkan konfigurasi Database, Clerk, serta API eksternal Anda:
\`\`\`env

# Database & Storage

DATABASE_URL="postgresql://postgres.[PROYEK_SUPABASE]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROYEK_SUPABASE]:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[PROYEK_SUPABASE].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="kunci_anon_supabase_anda_di_sini"

# Authentication (Clerk)

NEXT*PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test*..."
CLERK*SECRET_KEY="sk_test*..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
\`\`\`

**3. Sinkronisasi Database (Prisma)**
Jalankan perintah ini untuk mendorong skema ke Supabase:
\`\`\`bash
npx prisma db push
\`\`\`

**4. Jalankan Server Development**
\`\`\`bash
npm run dev
\`\`\`
Buka [http://localhost:3000](http://localhost:3000) di browser untuk melihat etalase, dan arahkan ke `/admin` untuk masuk ke Dashboard.

## 📄 Lisensi

Hak Cipta © 2026 KKF Label. Seluruh hak dilindungi.
