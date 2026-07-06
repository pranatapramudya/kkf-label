Tugas Baru: Eksekusi PRD 027 - Sinkronisasi Data Rating & Jumlah Terjual pada Product Card Beranda.

Konteks PRD 027:
Saat ini, data rating (bintang) dan jumlah barang terjual hanya muncul di halaman detail produk. Kita perlu menarik data agregasi tersebut dan menampilkannya secara dinamis di komponen Product Card pada halaman beranda/katalog agar berfungsi sebagai Social Proof.

Tugas kamu:

1. UPDATE LOGIKA BACKEND (Next.js Server Component / API / Prisma):
- Cari fungsi yang bertugas mengambil daftar produk untuk halaman beranda (biasanya di `app/page.tsx` atau file service database).
- Modifikasi query Prisma untuk mengambil data relasi terkait ulasan (reviews) dan transaksi berhasil (orders/orderItems).
- Hitung rata-rata rating (average) dan total quantity terjual (sum). 
- Jika menggunakan Prisma, pastikan menggunakan query aggregasi yang efisien atau gunakan `.map()` untuk menghitung total sebelum dikirim ke komponen frontend.

2. UPDATE KOMPONEN UI (`ProductCard` atau sejenisnya):
- Sesuaikan interface/tipe props komponen untuk menerima data `averageRating` (number) dan `totalSold` (number).
- Tambahkan elemen UI baru di bawah nama produk atau di atas harga.
- Susunan UI: [Icon Bintang Kuning] [Angka Rating] | [Terjual X].
- Gunakan styling Tailwind text yang kecil (text-xs atau text-sm) dan warna abu-abu (text-gray-500) agar rapi dan tidak balapan dengan harga. 
- Jika `totalSold` masih 0, tidak perlu dirender (opsional, ikuti best practice e-commerce).

3. UPDATE DOKUMENTASI SISTEM:
- Buka file `README.md` dan tambahkan poin baru di bagian "Fitur Utama" atau "Changelog" mengenai: "Dynamic Social Proof (Rating & Sold Count) pada katalog produk".
- Buka file `SYSTEM_ARCHITECTURE.md` dan tambahkan catatan singkat di bagian "Data Flow / Database" bahwa query beranda sekarang menggunakan agregasi data relasional untuk kalkulasi rating dan penjualan secara real-time.

ATURAN MUTLAK:
- Kerjakan di local environment saja.
- Pastikan tidak ada N+1 query problem pada Prisma yang membuat loading beranda menjadi lambat.
- Format penulisan README.md dan SYSTEM_ARCHITECTURE.md harus konsisten dengan gaya penulisan sebelumnya.
- Kabari saya jika sudah selesai beserta ringkasan file apa saja yang diubah.