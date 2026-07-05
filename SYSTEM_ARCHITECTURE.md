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
3. **Atomic Stock Return (Pembatalan Pesanan):** Jika Admin memperbarui status pesanan menjadi "Dibatalkan", backend akan memeriksa status sebelumnya. Jika sebelumnya bukan "Dibatalkan", maka akan diluncurkan **Prisma `$transaction`** untuk menambah (*increment*) kembali `stok` varian dan `stokTotal` produk sesuai jumlah pembelian, memastikan tidak ada inventaris yang hilang (*leaking stock*).

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
- **Pemantauan Performa Nyata (Core Web Vitals):** Integrasi komponen `<SpeedInsights />` dari Vercel ke dalam *Root Layout* (`layout.tsx`) memungkinkan aplikasi untuk terus memancarkan matriks performa (LCP, FID, CLS) ke *dashboard* analitik Vercel. Hal ini vital untuk mengevaluasi dampak SEO berbasis kecepatan pemuatan halaman bagi pengguna secara *real-time*.

## 7. Optimasi Pengiriman (Biteship API)
Untuk menjaga agar data yang dikirim ke sisi *client* tidak membengkak (*payload bloat*) dan menyederhanakan opsi bagi pelanggan, filter respon API Biteship dilakukan secara ketat di level *backend* (`/api/ongkir/route.ts`). Hanya layanan kurir spesifik (seperti J&T EZ, JNE Reguler, Sicepat Reguler/Best, Pos Reguler, Gojek Instant/Same Day) yang akan diproses dan diteruskan ke *frontend*, sementara opsi pengiriman lain disaring (diabaikan) sejak awal.

- **Manipulasi Payload Biteship API (Gojek Bypass):** Saat kurir Gojek (Instant/Same Day) dipilih, sistem secara otomatis merespons limitasi API dengan menambahkan parameter `origin_latitude`, `origin_longitude`, `destination_latitude`, dan `destination_longitude` langsung di root JSON payload secara sekuensial (bukan nested object). Pendekatan data *flat* ber-tipe *Number* ini memastikan *Bypass* dari validasi jarak, sekaligus menghilangkan *error* ketiadaan kurir akibat limitasi titik pemetaan.

## 8. Visualisasi Hex Color & Rendering Resi
- **Regex & Print Color Adjust:** Setiap elemen teks varian yang ditarik dari database dilewatkan pada fungsi bantuan (*helper component*) `ColorBadge.tsx` untuk dipindai oleh pola Regex (`/#([0-9A-F]{3}){1,2}/i`). Apabila terdeteksi format Hex Color, teks secara otomatis dikonversi dan dikawinkan dengan Color Box Badge secara dinamis.
- Pada fitur **Cetak Resi A6**, injeksi CSS khusus bernama `-webkit-print-color-adjust: exact;` dan `print-color-adjust: exact;` dipasang langsung secara sebaris (*inline*). Aturan *rendering* langka ini membuang intervensi peramban bawaan yang biasanya menghapus latar belakang berwarna demi penghematan tinta, sehingga memastikan warna sampel tercetak sempurna pada resi fisik yang diterima gudang.

## 9. Optimasi & Performa (Client-Side Processing & UX)
- **Content-Based Recommendation:** Implementasi algoritma *cross-selling* cerdas pada halaman Detail Produk memanfaatkan *Prisma Query*. Algoritma ini memprioritaskan rekomendasi berdasarkan kesamaan `kategoriId` dan secara asinkron otomatis mengecualikan ID produk yang sedang dilihat (`{ not: currentProductId }`), guna menghindari perulangan (self-reference) sekaligus menekan *payload* yang tidak perlu dari *database*.
- **State Management Bottom Navigation:** Penggunaan pengecekan `pathname` secara presisi (*strict check*) pada Bottom Navigation memastikan indikator menu aktif (*highlight*) hanya menyala pada rute yang tepat dan absolut (contoh: membedakan antara `/` dan `/katalog`), menghilangkan potensi misnavigasi state.
- **Mobile Layout Strategy (Safe Area):** Penggunaan nilai padding bawah (*bottom padding*) ekstrem seperti `pb-28` atau `pb-32` pada kontainer halaman bertindak sebagai kompensasi ruang kritis. Hal ini menggaransi konten (terutama baris produk terakhir dan tombol Load More) tidak akan pernah tertutup secara *overlap* oleh antarmuka tetap (*fixed UI*) seperti Bottom Navigation dan Floating Action Button (WhatsApp) pada *mobile viewport*.
- **Client-Side Category Filtering & Pagination:** Pada halaman `/katalog`, seluruh logika penyaringan kategori (*Category Filter*) dan pembagian halaman (*Load More Pagination*) sengaja dieksekusi murni di sisi Klien (*Client Component*). *Server Component* hanya memikul tugas tunggal untuk memuat (*fetch*) seluruh data produk aktif dari *Database* saat inisialisasi awal. Pendekatan arsitektur ini secara drastis meminimalkan siklus pemanggilan (beban) peladen, menihilkan jeda muat tambahan (*zero latency*) saat pengguna berpindah antar kategori, serta menyuguhkan transisi navigasi katalog yang sangat cepat di layar HP.
- **Client-Side Dominant Color Scanner:** Fitur ekstraksi warna pada baris varian produk memanfaatkan integrasi murni **HTML5 Canvas API** (`canvas.getContext('2d').getImageData()`). Pendekatan ini memungkinkan pemrosesan *array pixel* gambar (*image rendering*) untuk mencari nilai rata-rata RGB secara mutlak berlangsung di sisi *Client/Browser* (tanpa membebani server).
- **Efisiensi Storage & Zero Payload:** Berbeda dengan skema *upload* reguler, foto/gambar yang di-scan melalui tombol kamera khusus pada baris varian **TIDAK** pernah diunggah (*upload*) ke layanan *Storage* atau dilekatkan pada *payload submit form* ke *Database*. Gambar tersebut hanya "dibaca sementara" pada memori klien, diambil nilai *Hex Color*-nya, dan kemudian dibuang (dikosongkan dari nilai input), guna memangkas durasi unggahan dan secara signifikan menghemat kuota ruang penyimpanan server (Supabase).
