# Update PRD: Perbaikan UI/UX Komponen Notifikasi & Navigasi Detail Pesanan

## 1. Latar Belakang
- Penempatan elemen ikon lonceng notifikasi (Notification Bell) di Header/TopBar tidak presisi dan posisinya tergeser/menumpuk dengan foto profil di berbagai halaman.
- Elemen notifikasi tidak terkunci posisinya (ikut ter-scroll ke bawah saat pengguna menggulir halaman), sehingga mengganggu *User Experience* (UX) baik di web PC maupun mobile.
- Tombol "Buka Detail" di dalam *dropdown* notifikasi belum memiliki fungsi navigasi yang tepat. Saat diklik, admin hanya diarahkan ke halaman utama pesanan tanpa otomatis memfilter pesanan yang dimaksud.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Perbaikan CSS Positioning Header & Notifikasi:**
  - Pastikan komponen pembungkus *Header/TopBar* menggunakan *layout Flexbox* (`flex`, `items-center`, `justify-end` atau `justify-between`) agar elemen-elemen di dalamnya (Tombol Kalkulator, Waktu Diperbarui, Lonceng Notif, Foto Profil) berjajar rapi dan memiliki jarak (`gap`) yang konsisten.
  - Terapkan CSS `position: sticky` dengan `top: 0` dan `z-index` yang tinggi pada komponen *Header/TopBar* secara keseluruhan, BUKAN hanya pada ikon loncengnya. Ini memastikan seluruh *bar* menu atas tetap diam di posisinya saat halaman di-scroll.
- **Navigasi Cerdas "Buka Detail" (Deep Linking):**
  - Ubah perilaku tombol "Buka Detail" pada notifikasi pesanan.
  - Saat diklik, arahkan pengguna ke rute `/admin/pesanan?search=[nomor_invoice_pesanan]`.
  - Pastikan komponen pencarian (*Search Bar*) yang telah dibuat di halaman Pesanan dapat membaca parameter URL `?search=` ini saat pertama kali di-*render* (menggunakan `useSearchParams` di Next.js), sehingga tabel pesanan otomatis terfilter dan hanya menampilkan pesanan dari notifikasi tersebut.