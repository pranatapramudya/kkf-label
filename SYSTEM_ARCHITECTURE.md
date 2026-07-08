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
3. **Atomic Stock Return (Pembatalan Pesanan Admin & User):** Pengembalian stok dapat dipicu dari dua aktor: (a) Admin yang memperbarui status ke "Dibatalkan" via Dasbor, atau (b) Pengguna yang membatalkan pesanan *Transfer Manual* secara mandiri via Halaman Akun. Keduanya diwadahi oleh blok pelindung **Prisma `$transaction`** untuk menambah (*increment*) kembali `stok` varian dan `stokTotal` produk sesuai jumlah pembelian, memastikan tidak ada inventaris yang hilang (*leaking stock*).
4. **Automated Ghost Stock Recovery (Cron Job):** Sistem dilindungi dari fenomena *Hit and Run* melalui API Cron Job (`/api/cron/auto-cancel/route.ts`). Skrip ini menelusuri seluruh pesanan `MENUNGGU_PEMBAYARAN` yang melampaui usia 24 jam. Dengan memanfaatkan kekuatan eksekusi atomik **Prisma `$transaction`**, sistem secara serentak membatalkan pesanan tersebut dan mengembalikan (*increment*) stok barang secara presisi. Jika pengembalian stok salah satu *item* gagal, seluruh proses untuk pesanan tersebut akan di-*rollback*, menjamin kepatuhan absolut terhadap prinsip ACID (*Atomicity, Consistency, Isolation, Durability*) tanpa mengorbankan performa database utama.

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

- **Debounced Auto-Fetch & Kinerja API:** Pada sisi klien, pengiriman permintaan biaya logistik dilindungi menggunakan teknik *Debouncing* (jeda 800ms) di dalam *dependency array* `useEffect`. Mekanisme ini mencegah spam *request* secara beruntun (*API Limit Abuse*) ketika pelanggan dengan cepat menekan tombol tambah/kurang kuantitas barang, sembari menyuguhkan *state loading* interaktif ("Menghitung...") secara instan.
- **Dinamisasi Payload (Array Items Mapping):** API Biteship menerima data akumulasi keranjang dalam format *Array Object* (`items`). Sistem secara presisi memetakan `quantity` dan menyematkan parameter `weight: 250` di dalam setiap elemen *array* produk. Hasilnya, Biteship secara otomatis menghitung *Volumetric Weight* yang adil tanpa perlu manipulasi perkalian ganda (*multiplier*) di sisi klien yang rawan menyebabkan *overpricing*.
- **Manipulasi Payload & Guardrail Instan (Gojek Bypass):** Saat kurir Gojek (Instant) dipilih, kalkulasi secara fundamental berubah dari *Weight-Based* menjadi *Distance-Based Pricing*. Sistem secara otomatis merespons limitasi API dengan menambahkan parameter koordinat (`latitude` & `longitude`) langsung di root JSON payload. Untuk menihilkan *error*, sebuah *Guardrail* (pelindung logis) ditanamkan untuk secara keras menolak pesanan apabila `totalBerat` menembus ambang batas muatan maksimum motor Gojek (20.000 gram / 20kg).

## 8. Visualisasi Hex Color & Rendering Resi
- **Regex & Print Color Adjust:** Setiap elemen teks varian yang ditarik dari database dilewatkan pada fungsi bantuan (*helper component*) `ColorBadge.tsx` untuk dipindai oleh pola Regex (`/#([0-9A-F]{3}){1,2}/i`). Apabila terdeteksi format Hex Color, teks secara otomatis dikonversi dan dikawinkan dengan Color Box Badge secara dinamis.
- Pada fitur **Cetak Resi A6**, injeksi CSS khusus bernama `-webkit-print-color-adjust: exact;` dan `print-color-adjust: exact;` dipasang langsung secara sebaris (*inline*). Aturan *rendering* langka ini membuang intervensi peramban bawaan yang biasanya menghapus latar belakang berwarna demi penghematan tinta, sehingga memastikan warna sampel tercetak sempurna pada resi fisik yang diterima gudang.

## 9. Optimasi & Performa (Client-Side Processing & UX)
- **Modern Icon Grid Navigation:** Restrukturisasi antarmuka beranda dari *stacked buttons* menjadi *horizontal icon grid* bergaya "Super App". Modul ini dirancang dengan tata letak elastis (`flex`, `overflow-x-auto`) yang tidak hanya menekan konsumsi ruang vertikal (*vertical space efficiency*), namun juga mengamankan skalabilitas untuk penambahan fitur/menu layanan baru di masa mendatang tanpa merombak ulang struktur utama *Hero section*.
- **Dynamic Homepage Products via Prisma Optimization:** Untuk memuat produk rilisan terbaru secara mutlak tanpa mengorbankan performa *Server-Side Rendering*, *endpoint* beranda memanggil kueri Prisma murni dengan batasan baris (`take: 2`) dan pengurutan kronologis mundur (`orderBy: { dibuatPada: 'desc' }`). Kueri ini memproyeksikan data secara parsial (`select` fields) untuk menghindari pemuatan (*overfetching*) beban grafis tak perlu, sehingga menjaga *Total Blocking Time (TBT)* tetap mendekati 0 milidetik saat menampilkan etalase produk terhangat.
- **Content-Based Recommendation:** Implementasi algoritma *cross-selling* cerdas pada halaman Detail Produk memanfaatkan *Prisma Query*. Algoritma ini memprioritaskan rekomendasi berdasarkan kesamaan `kategoriId` dan secara asinkron otomatis mengecualikan ID produk yang sedang dilihat (`{ not: currentProductId }`), guna menghindari perulangan (self-reference) sekaligus menekan *payload* yang tidak perlu dari *database*.
- **State Management Bottom Navigation:** Penggunaan pengecekan `pathname` secara presisi (*strict check*) pada Bottom Navigation memastikan indikator menu aktif (*highlight*) hanya menyala pada rute yang tepat dan absolut (contoh: membedakan antara `/` dan `/katalog`), menghilangkan potensi misnavigasi state.
- **Mobile Layout Strategy (Safe Area):** Penggunaan nilai padding bawah (*bottom padding*) ekstrem seperti `pb-28` atau `pb-32` pada kontainer halaman bertindak sebagai kompensasi ruang kritis. Hal ini menggaransi konten (terutama baris produk terakhir dan tombol Load More) tidak akan pernah tertutup secara *overlap* oleh antarmuka tetap (*fixed UI*) seperti Bottom Navigation dan Floating Action Button (WhatsApp) pada *mobile viewport*.
- **Client-Side Category Filtering & Pagination:** Pada halaman `/katalog`, seluruh logika penyaringan kategori (*Category Filter*) dan pembagian halaman (*Load More Pagination*) sengaja dieksekusi murni di sisi Klien (*Client Component*). *Server Component* hanya memikul tugas tunggal untuk memuat (*fetch*) seluruh data produk aktif dari *Database* saat inisialisasi awal. Pendekatan arsitektur ini secara drastis meminimalkan siklus pemanggilan (beban) peladen, menihilkan jeda muat tambahan (*zero latency*) saat pengguna berpindah antar kategori, serta menyuguhkan transisi navigasi katalog yang sangat cepat di layar HP.
- **Client-Side Dominant Color Scanner:** Fitur ekstraksi warna pada baris varian produk memanfaatkan integrasi murni **HTML5 Canvas API** (`canvas.getContext('2d').getImageData()`). Pendekatan ini memungkinkan pemrosesan *array pixel* gambar (*image rendering*) untuk mencari nilai rata-rata RGB secara mutlak berlangsung di sisi *Client/Browser* (tanpa membebani server).
- **Efisiensi Storage & Zero Payload:** Berbeda dengan skema *upload* reguler, foto/gambar yang di-scan melalui tombol kamera khusus pada baris varian **TIDAK** pernah diunggah (*upload*) ke layanan *Storage* atau dilekatkan pada *payload submit form* ke *Database*. Gambar tersebut hanya "dibaca sementara" pada memori klien, diambil nilai *Hex Color*-nya, dan kemudian dibuang (dikosongkan dari nilai input), guna memangkas durasi unggahan dan secara signifikan menghemat kuota ruang penyimpanan server (Supabase).
- **Client-Side Image Compression:** Gambar utama produk maupun galeri yang diunggah oleh admin dikompresi secara otomatis di sisi *Client/Browser* menggunakan `HTMLCanvasElement` (menurunkan kualitas JPEG ke 70% dan melakukan *resize* proporsional jika lebar/tinggi melebihi 1200px) sebelum dikirimkan ke server. Mekanisme ini krusial untuk menghemat *bandwidth* unggahan, mempercepat durasi tunggu (*loading time*), dan secara drastis menghemat kapasitas penyimpanan *Cloud Storage* tanpa mengorbankan ketajaman visual produk di mata pelanggan.
- **Client-Side LocalStorage Tracking:** Algoritma fitur "Terakhir Kamu Lihat" beroperasi murni menggunakan API `localStorage` pada browser pengguna. Ketika produk dikunjungi, *Client Component* meng- *unshift* ringkasan data produk ke dalam array lokal (maksimum 10 *item* dengan deduplikasi otomatis). Pendekatan desentralisasi histori penjelajahan ini mengeliminasi kebutuhan tabel histori di *database*, menekan beban kueri (*query load*), dan memungkinkan aplikasi berskala SaaS besar melayani jutaan pelacakan interaksi per detik dengan biaya infrastruktur yang absolut nol.

## 10. Keamanan & Anti-Bot (Rate Limiting & Turnstile)
Sistem dilengkapi perlindungan ganda (Dual-Layer Security) pada *endpoint* krusial (Checkout dan AI Stylist) untuk mencegah eksploitasi *spam bot* dan kebangkrutan kuota:
- **Lapis 1 (Rate Limiting In-Memory):** Mencegah *abuse* API dan *brute-force* pesanan dengan membatasi jumlah pembuatan transaksi (maksimal 3 kali per jam untuk setiap IP Address pengguna) menggunakan implementasi *Map* in-memory sederhana namun berkinerja tinggi di sisi server. Konsep pembatasan ini juga diterapkan secara ketat (maksimal 3 *prompt*/sesi) pada fitur *AI Virtual Stylist* untuk membentengi lonjakan biaya tagihan model LLM secara tak wajar. Pembatasan dilakukan baik pada penguncian form di sisi klien maupun blokade mutlak di lapisan *backend*.
- **Lapis 2 (Cloudflare Turnstile):** Menggantikan reCAPTCHA dengan alternatif yang jauh lebih ringan, efisien, dan mengutamakan privasi. Widget Turnstile dirender secara *invisible* (berjalan senyap di latar belakang) pada UI Checkout Klien, menjamin perlindungan dari *spam bot* tanpa menimbulkan friksi atau merusak pengalaman (*UX*) pengguna. Token divalidasi secara *server-side* ke *endpoint* Cloudflare `/siteverify` sebelum transaksi dieksekusi secara atomik. Kegagalan verifikasi otomatis menolak permintaan dengan status *403 Forbidden*.

## 11. Arsitektur Caching & Navigasi Zero-Delay (SWR)
Dasbor Admin dirancang untuk menyajikan kecepatan setara aplikasi *Native* (Zero-Delay) dengan memisahkan proses muat awal dan pembaruan data:
- **Global Suspense & Skeleton Loaders:** Transisi halaman (SSR/Pemuatan Awal) diakselerasi melalui implementasi global `loading.tsx` dan React `<Suspense />`. Teknik ini secara instan menyajikan kerangka struktur UI (*Skeleton Box*) beranimasi *pulse*, melenyapkan jeda layar kosong (*blank screen freeze*) sewaktu komponen berat dieksekusi.
- **Client-Side Caching (SWR):** Semua modul tabulasi (Analitik, Produk, Pesanan, Ulasan) mengadopsi arsitektur pengambilan data berbasis *Stale-While-Revalidate* (SWR). Modul ini menyimpan memori respon sebelumnya (cache) secara mutlak (`keepPreviousData: true`). 
- **Aggressive Prefetching:** Sistem menanamkan instruksi `.preload()` yang aktif menyerap data dari pangkalan (*database*) sepersekian milidetik sewaktu admin hanya menyorot kursor (*hover*) pada tombol menu/navigasi. Ketika klik benar-benar dilakukan, data diekstraksi dari *cache* secara nol koma detik (0 ms).

## 12. Optimasi Database & Eksekusi Paralel (Prisma)
Dalam menangani anomali penumpukan waktu eksekusi (*bottleneck / high Total Blocking Time*) yang kerap terjadi pada dasbor berlapis analitik besar:
- **Parallel Promise Execution:** Pemanggilan kueri agregasi komputasional ke PostgreSQL (contoh: kalkulasi deret omset bulan, pemetaan top produk, dan kalkulasi persentase analitik) TIDAK dieksekusi secara sekuensial (berurutan) yang memakan waktu panjang. Semua *endpoint* analitik dirakit ke dalam Array dan dieksekusi secara pararel bersinergi lewat metode `Promise.all([...])`, memangkas durasi *loading* API hingga lebih dari 60%.
- **Selective Fields Payload:** Pemanggilan relasi tabel dalam kueri (`include`) ditinggalkan demi efisiensi ekstrem menggunakan *mapping* parsial (`select`). Hanya metrik-metrik absolut yang diterjemahkan menjadi entitas JSON demi menjamin *payload* HTTP sekecil dan seringan mungkin menuju perangkat pengguna, dikombinasikan dengan limitasi batas mutlak *row constraint* (`take: 20` atau `take: 500`) guna menghindari *database throttling* dan lonjakan konsumsi memori Vercel.
- **Dynamic Social Proof Aggregation:** Query produk pada beranda menggunakan agregasi data relasional (`ulasan` dan `itemPesanan` dengan filter transaksi sukses) secara real-time untuk menyajikan bukti sosial (rating & sold count). Pendekatan *Selective Fields* ini memastikan kalkulasi statistik berjalan tanpa memicu beban berat (N+1 query problem).

## 13. Aksesibilitas & Inklusivitas Antarmuka (A11y)
Seluruh lapisan antarmuka pengguna (UI), baik pada etalase toko (*Storefront*) maupun Dasbor Admin, telah dikalibrasi untuk memenuhi standar aksesibilitas web (A11y) secara penuh. Penyesuaian mencakup standardisasi rasio kontras warna (*color contrast*) pada elemen teks dan latar belakang sekunder, perlebaran area sentuh (*touch targets*) minimum 44px untuk kenyamanan perangkat *mobile*, penyediaan atribut pembaca layar (`aria-label`) pada seluruh tombol navigasi berbasis ikon, dan konfigurasi *viewport* tak terbatas (*scalable*). Pendekatan ini ditujukan semata-mata untuk menjamin pengalaman pengguna (UX) yang inklusif, profesional, dan setara bagi seluruh pelanggan serta pengelola sistem tanpa terkecuali.

## 14. Arsitektur AI Virtual Stylist (Pre-flight Validation & Dual LLM)

Untuk menyuguhkan pengalaman "Pramuniaga Pribadi", KKF Label menyematkan fitur **AI Virtual Stylist** dengan landasan arsitektur RAG ringan (*Database-to-Prompt Injection*) yang ditenagai oleh model kognitif Gemini 2.5 Flash dari Google sebagai AI utama, dan Groq Llama 3.1 8B sebagai *fallback* sekunder.

### 14.1. Pre-flight Validation Fallback Pattern
Mengingat Vercel AI SDK v7 mengonsumsi error ke dalam *streaming response* (tidak *throw error* ke blok `catch`), sistem mengimplementasikan pola **Pre-flight Validation**:
- **Health Check:** Sebelum memulai *stream*, sistem memanggil `generateText()` (1 token) ke Gemini.
- **Failover:** Jika Gemini mengalami 401 (Auth), 429 (Rate Limit), atau 500, error tersebut langsung ditangkap oleh `catch`.
- **Seamless Streaming:** Saat terdeteksi *error*, *flag* `useGroqFallback` diaktifkan dan `streamText()` dijalankan secara mulus menggunakan Groq (`llama-3.1-8b-instant`), tanpa ada interupsi di sisi *client*.

### 14.2. Injeksi Konteks Produk & Persona Ketat
- **Retrieval & Serialisasi Katalog:** Kapanpun sesi *chat* diaktifkan, modul *Server Route* mengekstrak data dari PostgreSQL secara senyap (memuat daftar produk, relasi ukuran, dan varian warna yang aktif). Struktur relasional kompleks Prisma ini kemudian diserialisasi menjadi teks mentah terstruktur dan diinjeksi mutlak ke dalam `system` prompt model.
- **Kontekstualisasi Domain:** AI dirantai (*System Prompt Boundaries*) agar murni bertindak selayaknya pelayan butik profesional KKF Label dan mutlak menolak perbincangan di luar ranah mode busana muslimah atau data katalog yang disuntikkan.
- **Interactive UX & Quick Replies:** Di sisi antarmuka (*client*), AI disajikan dengan tombol pintas interaktif (*Quick Reply Chips*) seperti "Outfit santai buat ngopi" yang secara otomatis menghilang pasca-interaksi pertama. Pola *foolproof UX* ini memecah kebuntuan (kebingungan mengetik) bagi pengguna awam dan melesatkan angka interaksi.
- **Data Stream Protocol:** Respons diformat khusus dan dikirimkan lapis demi lapis (*chunking*) menggunakan standar `toUIMessageStreamResponse` ke antarmuka klien Next.js (App Router), menyajikan tulisan *Markdown* ala ketikan *real-time* yang dapat langsung memuat (*render*) tautan produk interaktif dan format tebal/miring, menjadikannya seolah-olah percakapan manusiawi sesungguhnya.

## 15. Arsitektur Progressive Web App (PWA) & Strategi Mobile

Repositori ini telah menjalani migrasi total dari arsitektur *Capacitor Native Wrapper* ke ekosistem **Progressive Web App (PWA)** murni (PRD-058). Seluruh dependensi Capacitor (`@capacitor/core`, `@capacitor/android`, `@capacitor/status-bar`, dll.), folder `/android`, dan file `capacitor.config.ts` telah dihapus permanen.

### 15.1. Frontend & PWA Strategy

Sistem PWA dibangun menggunakan **`@ducanh2912/next-pwa`** yang mengintegrasikan Workbox ke dalam *pipeline* build Next.js secara transparan:

- **Konfigurasi (`next.config.mjs`):** Konfigurasi Next.js yang sudah ada dibungkus dengan `withPWA()`. PWA di-*disable* secara otomatis di mode *development* (`disable: process.env.NODE_ENV === "development"`) agar tidak mengganggu *hot-reloading*.
- **Service Worker Generation:** Saat proses `next build`, Workbox secara otomatis men-*generate* file `sw.js` ke folder `public/`. Service Worker menangani *precaching* aset statis dan *runtime caching* untuk navigasi halaman (`cacheOnFrontEndNav: true`, `aggressiveFrontEndNavCaching: true`).
- **Manifest (`public/manifest.json`):** Berisi metadata aplikasi (nama, ikon PNG 192x192 & 512x512, `display: standalone`, `theme_color: #ff0080`) yang memungkinkan browser menampilkan opsi instalasi PWA.
- **Meta Tags:** Root Layout (`app/layout.tsx`) menginjeksi metadata PWA melalui Next.js Metadata API (`manifest`, `appleWebApp`, `icons.apple`) untuk kompatibilitas penuh dengan iOS Safari dan Android Chrome.
- **Responsivitas & PWA Standalone:** Komponen layout utama telah disesuaikan dengan *padding* dinamis untuk menangani elemen *fixed* bawaan OS (seperti iOS Home Indicator) dan *Bottom Navigation Bar* PWA, memastikan aksesibilitas Pintu Rahasia (Admin Backdoor) tetap terjaga.
- **Strategi Label Statis:** Penggunaan teks lokasi statis pada `ProductCard` diputuskan sebagai langkah optimalisasi performa frontend (mengurangi beban payload API) sambil tetap memberikan *trust value* ala marketplace besar.

### 15.2. Dual Service Worker (PWA + Firebase)

Dua Service Worker beroperasi secara berdampingan (*side-by-side*) dengan tanggung jawab yang dipisahkan secara jelas:

| Service Worker | File | Tanggung Jawab |
|---|---|---|
| **PWA (Workbox)** | `public/sw.js` (auto-generated) | Caching aset statis, runtime caching navigasi, offline-readiness |
| **Firebase FCM** | `public/firebase-messaging-sw.js` (manual) | Menerima dan menampilkan push notification dari Firebase Cloud Messaging |

Pendekatan ini menghindari konflik *scope* dan memastikan masing-masing SW dapat di-*update* secara independen.

### 15.3. Custom PWA Prompt (PwaPromptProvider)

Untuk menggantikan dialog browser bawaan yang kaku dan tidak bisa dikustomisasi, sistem mengimplementasikan **Custom Prompt UI** berbasis *bottom-sheet glassmorphism drawer*:

- **`PwaPromptProvider` (`components/pwa/PwaPromptProvider.tsx`):** React Context yang bertindak sebagai *centralized state manager*. Mengelola:
  - **Intercepsi `beforeinstallprompt`:** Event native Chrome/Android ditangkap dan ditunda (*deferred*) agar bisa dipicu dari UI kustom.
  - **Deteksi iOS:** Mengidentifikasi pengguna Safari iOS yang tidak mendukung `beforeinstallprompt` untuk menampilkan panduan manual.
  - **Deteksi Standalone:** Memeriksa apakah aplikasi sudah berjalan dalam mode PWA (`display-mode: standalone`) untuk menyembunyikan prompt.
  - **Timing Strategy:** Install drawer muncul 30 detik setelah *page load* pertama. Notification drawer muncul 10 detik setelah install drawer di-*resolve*, atau 60 detik jika install tidak berlaku.
  - **Anti-Spam Cooldown:** Setelah pengguna menekan \"Nanti Saja\" atau \"Tidak, Terima Kasih\", prompt tidak akan muncul lagi selama 7 hari (disimpan via `localStorage` dengan *timestamp*).

- **`InstallDrawer` (`components/pwa/InstallDrawer.tsx`):** Dua mode operasi:
  - **Android/Chrome:** Menampilkan tombol \"Pasang Sekarang\" yang memanggil `deferredPrompt.prompt()` untuk memicu dialog instalasi native.
  - **iOS Safari:** Menampilkan panduan visual 3 langkah (Share → Add to Home Screen → Add) dengan ikon Lucide yang intuitif.

- **`NotificationDrawer` (`components/pwa/NotificationDrawer.tsx`):** Menampilkan manfaat notifikasi (Update Pesanan, Promo Eksklusif, Info Restock) sebelum memanggil `Notification.requestPermission()`. Jika diizinkan, langsung memicu `requestForToken()` dari `firebaseClient.ts` untuk mendaftarkan FCM token.

### 15.4. FCM Token Gating

`FCMProvider` (`components/FCMProvider.tsx`) dimodifikasi agar **tidak lagi** secara otomatis meminta izin notifikasi saat permission berstatus `"default"`. Token FCM hanya di-*request* secara otomatis jika pengguna sudah pernah memberikan izin (`Notification.permission === "granted"`). Flow permintaan izin pertama kali kini sepenuhnya ditangani oleh `NotificationDrawer`, mencegah browser menandai situs sebagai *abusive notification requester*.
### 15.5. PWA Admin Shortcut (Easter Egg)

Untuk memfasilitasi akses cepat ke panel kontrol dari perangkat mobile PWA (yang berjalan mode *Standalone* tanpa *address bar/URL*), sistem menerapkan metode *invisible backdoor link* di komponen `Footer.tsx`. Tahun rilis pada hak cipta (`© 2026`) diselubungi elemen `<Link href="/admin">` dan distilisasi agar membaur murni layaknya teks statis biasa (`text-inherit outline-none`). Pendekatan "pintu rahasia" ini melindungi rute admin dari eksposur publik, sekaligus mencegah penggunaan `manifest.json` *shortcuts* yang berisiko menelanjangi menu admin ke OS pengguna awam saat aplikasi ditahan/ditekan lama (*long-press*).

### 15.6. Arsitektur Terdekopling (Separation of Concerns)

Dengan dihapusnya Capacitor, repositori Next.js ini kini memiliki tanggung jawab yang jelas dan terfokus:

```
┌─────────────────────────────────────────────┐
│           Repositori Next.js (ini)          │
│                                             │
│  ┌─────────────┐   ┌────────────────────┐   │
│  │  Frontend    │   │  Backend API       │   │
│  │  (React/PWA) │   │  (API Routes)      │   │
│  └─────────────┘   └────────────────────┘   │
│                                             │
│  Deployment: Vercel (Web + Serverless)      │
└─────────────────────────────────────────────┘
              │
              │ PWA (Installable dari browser)
              ▼
┌─────────────────────────────────────────────┐
│  Perangkat Mobile (Android/iOS)             │
│  → Instalasi via Browser (Chrome/Safari)    │
│  → Berjalan Standalone tanpa address bar    │
└─────────────────────────────────────────────┘
              │
              │ (Ekspansi Masa Depan)
              ▼
┌─────────────────────────────────────────────┐
│  Aplikasi Mobile Native (Flutter)           │
│  → Repositori terpisah                      │
│  → Konsumsi API dari Next.js backend        │
└─────────────────────────────────────────────┘
```

Pendekatan ini menyiapkan fondasi yang bersih: jika di masa depan dibutuhkan aplikasi native (misalnya Flutter untuk fitur kamera AR, NFC, atau akses hardware lainnya), repositori tersebut cukup mengonsumsi *API endpoints* yang sudah disediakan oleh backend Next.js tanpa perlu menggabungkan kode native ke dalam satu *codebase*.

