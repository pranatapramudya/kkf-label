# Arsitektur Sistem & Alur Kerja (KKF Label)

Dokumen ini memuat analisis arsitektur teknis dan korelasi antar fungsi *full-stack* pada platform KKF Label. Sistem ini memanfaatkan arsitektur **Next.js App Router** untuk memisahkan logika Klien (`use client`) dan logika aman di Server (*Server Components* / API Routes).

## 1. Skema Relasi Database (Prisma & PostgreSQL)
Fondasi data diatur secara terpusat pada file `prisma/schema.prisma`. Beberapa relasi krusial yang menopang logika bisnis:
- **`Product` dan `ProductVariant` (One-to-Many):** Desain ini memungkinkan satu produk memiliki berbagai ukuran atau warna. Masing-masing varian memiliki pencatatan stok sendiri (`stok`), sementara produk memiliki `stokTotal`.
- **`Order` dan `OrderItem` (One-to-Many):** `Order` menangani data meta-transaksi (alamat, kurir, subtotal), sedangkan `OrderItem` berfungsi sebagai *snapshot* harga dan keterangan varian pada saat transaksi terjadi, melindunginya dari fluktuasi harga produk di masa mendatang.
- **Relasi Fleksibel pada `Review`:** Ulasan produk direlasikan ke `User`, namun dengan kolom *nullable* agar pembeli tamu (*Guest*) tetap dapat memberikan ulasan menggunakan *Foreign Key* ke `Order`.

## 2. Alur Transaksi & Validasi Stok (Pencegahan Overselling)
Untuk memastikan pelanggan tidak membeli barang kosong, sistem menerapkan strategi validasi dua lapis (Dual-Layer Validation):
1. **Frontend (UI Guard):** Komponen halaman produk (`ClientProdukDetail.tsx`) secara reaktif membaca data `stokTotal` maupun stok varian. Jika stok menyentuh angka `<= 0`, semua tombol aksi (keranjang/beli) otomatis berubah warna menjadi abu-abu (*disabled*) dengan label "Stok Habis".
2. **Backend (Pre-Flight Prisma Transaction):** Mengingat manipulasi *localStorage* keranjang sangat rawan dimodifikasi klien, *endpoint* akhir di `/api/pesanan/route.ts` memikul tanggung jawab mutlak. 
   - Sistem memulai blok **Prisma `$transaction`**.
   - API secara langsung (*real-time*) me-query sisa stok dari database sebelum memproses pesanan. Jika stok kosong/minus, API melempar pesan *Error* (penolakan) dan keranjang batal dieksekusi.
   - Jika stok valid, pembuatan riwayat `Order` dan pemotongan stok dilakukan secara atomik (*Atomic Operation*).

## 3. Sistem "Hybrid Delete" (Manajemen Arsip Aman)
Penghapusan data di Admin Dashboard pada menu Produk menerapkan logika *Hybrid Delete* untuk melindungi riwayat pesanan (Constraint Data):
- **Hard Delete (Penghapusan Total):** Ketika produk belum pernah memiliki relasi transaksi apa pun di dalam tabel `OrderItem`, maka data produk akan dihapus secara permanen dari database. Dalam proses ini, sistem backend turut memanggil *Supabase JS SDK* untuk memusnahkan (*purge*) berkas gambar dari peladen (storage bucket), demi efisiensi *resource*.
- **Soft Delete (Pengarsipan):** Ketika produk yang akan dihapus sudah memiliki relasi riwayat pesanan, menghapusnya secara permanen akan memicu *Database Integrity Error*. Oleh karena itu, *backend* akan secara elegan mengubah *flag* `isArchived` menjadi `true`.
- **Dampak Soft Delete:** Produk yang diarsipkan tidak akan tampil di *Storefront* pelanggan. Di dalam antarmuka panel Admin, produk akan dirender redup (*grayscale*), dilucuti tombol editnya, dan dilengkapi tombol pemulihan ("Pulihkan") untuk mengubah statusnya kembali menjadi `isArchived: false`.

## 4. Audit Keamanan Variabel Lingkungan (.env)
Aplikasi memastikan tidak ada kredensial sensitif yang rontok ke sisi *Client Browser*:
- Label **`NEXT_PUBLIC_`**: Diberlakukan secara eksklusif hanya untuk nilai konfigurasi yang wajar (publik), seperti `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` dan parameter ID Web Firebase untuk *Service Worker*.
- **Secret Backend (Tanpa Awalan):** Kunci absolut layaknya `DATABASE_URL`, API Key Resend, rahasia Server Midtrans, rahasia autentikasi Clerk, dll, dibiarkan *default*. Dengan begitu, hanya *Node.js Backend* dan *Server Actions* yang diizinkan membacanya.

## 5. Manajemen Error Sinkron (Firebase Cloud Messaging)
Modul *Push Notification* (FCM) menggunakan `firebaseClient.ts`. Guna menjaga kelancaran pengembangan *Localhost* dari error *Abort* / *Messaging* yang memicu munculnya *Error Overlay* besar di layar Next.js:
- Semua inisialisasi diikat dalam blok pelindung `try...catch`.
- Lemparan *Exception* pada blok `catch` dicegah dan di-downgrade tingkat fatalitasnya dengan metode `console.warn` (alih-alih `console.error`). Cara ini mengizinkan UI tampil prima sembari tetap menjaga *traceability* error di *DevTools Console*.

## 6. Arsitektur SEO & Web Vitals
Untuk memaksimalkan *Search Engine Optimization* (SEO), platform ini secara penuh menggunakan fitur internal Next.js 15:
- **Dynamic Metadata (`generateMetadata`):** Saat *Crawler Bot* mengakses halaman detail produk, *Server Component* akan mengeksekusi *query* ke database Prisma. Nama produk dan deskripsinya secara otomatis disuntikkan ke dalam meta tag `<title>` dan `<meta name="description">` pada tahap *Server-Side Rendering* (SSR). Ini menjamin akurasi hasil pencarian Google.
- **Sitemap Dinamis (`sitemap.ts`):** Menggantikan sitemap XML statis, file `sitemap.ts` beroperasi layaknya API untuk men-generate URL secara dinamis. Parameter *query* difilter murni untuk produk berstatus aktif (`aktif: true`) dan belum terarsip (`isArchived: false`), sehingga Google tidak akan merayapi tautan mati/produk yang sudah dihapus secara *Soft Delete*.
- **`robots.txt` & Proteksi Path:** File `robots.ts` menginstruksikan perayap untuk bebas mengindeks *Storefront* (`Allow: /`) dengan petunjuk URL `sitemap.xml`, namun di sisi lain menegakkan blokade mutlak (`Disallow`) terhadap rute rahasia seperti panel `/admin` dan jalur belakang `/api`.
- **Semantic HTML & Image Attributes:** Komponen halaman produk dijamin hanya memiliki satu induk *heading* (`<h1>`) untuk nama produk, dan setiap tag `<Image>` dimuati dengan parameter `alt` yang dinamis sesuai nama aslinya, meningkatkan skor *accessibility* dan SEO Gambar.
- **Sinkronisasi Canonical URL & Open Graph:** Penggunaan `metadataBase` secara global di dalam `layout.tsx` yang dikombinasikan dengan variabel `NEXT_PUBLIC_BASE_URL` memastikan semua metadata (termasuk `og:image` dan `url` Open Graph) selalu merujuk kuat (*Canonical*) ke domain utama produksi, sehingga menutup celah kebocoran penyebaran tautan berdomain bawaan `.vercel.app`.
