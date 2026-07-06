# PRD: 024 Penyempurnaan UI Beranda & Logika Produk Terbaru

## 1. Konteks
Setelah pembaruan navigasi grid icon, diperlukan penyempurnaan UI (fine-tuning) pada halaman beranda untuk meningkatkan *information density* (mengurangi ruang kosong yang berlebihan) dan memberikan sentuhan modern pada tipografi. Selain itu, bagian produk di bawah menu harus diintegrasikan dengan database untuk selalu menampilkan produk yang paling baru ditambahkan oleh admin.

## 2. Tujuan
- Memadatkan jarak (margin/padding) di bagian atas (Hero section) agar konten lebih naik ke atas (terlihat tanpa perlu banyak scroll di mobile).
- Memodernisasi tampilan tombol icon dan mengubah teks labelnya.
- Memberikan efek gradasi warna pink pudar pada teks judul utama.
- Menampilkan 2 produk terbaru secara dinamis dari database.

## 3. Persyaratan Fungsional & UI (Requirements)
- **Penyesuaian Jarak & Spasi (Spacing):**
  - Kurangi `margin-top` atau `padding-top` pada pembungkus (wrapper) *badge* "Koleksi terbaru 2026" dan judul "Fashion wanita minimalis...".
  - Kurangi jarak (`gap`) antara tombol icon menu navigasi agar lebih rapat (dempet).
- **Update Label & Gaya Tombol Menu:**
  - Ubah teks "KATALOG" menjadi "SEMUA PRODUK".
  - Ubah teks "DISUKAI" menjadi "PALING DISUKAI".
  - Buat desain icon kotak melingkar (*squircle* atau *rounded-2xl*) lebih modern (tambahkan efek *shadow-sm*, atau border tipis transparan, sesuaikan padding agar pas).
- **Tipografi Judul Utama (Gradient Text):**
  - Aplikasikan efek gradasi pada teks "Fashion wanita minimalis untuk hari yang terasa lembut."
  - Gunakan class Tailwind seperti: `bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-pink-300` (sesuaikan warnanya agar bergradasi pink pudar yang elegan dan tetap terbaca di background putih).
- **Logika Data Dinamis (Latest Products):**
  - Fetch data produk dari Prisma pada komponen beranda (Server Component).
  - Gunakan query: `orderBy: { createdAt: 'desc' }, take: 2` untuk mengambil tepat 2 produk paling baru.
  - Render data tersebut ke dalam komponen *Product Card* yang sudah ada di bawah menu navigasi.

## 4. Pembaruan Dokumentasi (Wajib)
- `README.md`: Tambahkan poin di bagian fitur bahwa beranda secara dinamis menampilkan rilisan produk terbaru.
- `SYSTEM_ARCHITECTURE.md`: Catat penggunaan *query Prisma* dengan limit dan order untuk optimasi performa *load* beranda.