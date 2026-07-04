# Product Requirements Document (PRD) - Integrasi Vercel Speed Insights & Perbaikan Alur Pesanan

## 1. Konteks
Terdapat tiga pembaruan utama:
1. Integrasi `@vercel/speed-insights/next` untuk memantau performa Core Web Vitals.
2. Memperbaiki *bug* pada Admin Dashboard di mana pemilihan status pesanan di *dropdown* langsung memicu update ke database tanpa menunggu tombol "Simpan" ditekan.
3. Memperbaiki logika bisnis pembatalan pesanan: jika pesanan diubah statusnya menjadi "Dibatalkan", stok produk yang sebelumnya dipesan harus dikembalikan (di-increment) ke database secara otomatis.

## 2. Detail Tugas (Tasks)

**Task A: Integrasi Vercel Speed Insights**
- Buka file `app/layout.tsx`.
- Import komponen: `import { SpeedInsights } from "@vercel/speed-insights/next"`.
- Letakkan komponen `<SpeedInsights />` di dalam tag `<body>`, sebaiknya sebelum penutup `</body>` bersama anak-anak komponen lainnya.

**Task B: Perbaiki Bug Auto-Save Dropdown Status (Admin)**
- Buka komponen UI yang merender detail pesanan admin (kemungkinan modal/dialog di `app/admin/pesanan/...`).
- Ubah logika *event handler* pada elemen `<select>` atau komponen Dropdown status pesanan.
- Saat ini kemungkinan menggunakan fungsi yang langsung memanggil API/Server Action. Ubah agar `onChange` hanya memperbarui React State lokal (misal: `const [selectedStatus, setSelectedStatus] = useState(...)`).
- Pastikan eksekusi pembaruan ke database (Server Action) HANYA terjadi ketika admin menekan tombol "Simpan Perubahan" atau "Update".

**Task C: Logika Pengembalian Stok Saat Batal (Backend)**
- Buka fungsi API atau Server Action yang menangani *update* status pesanan.
- Tambahkan logika validasi: JIKA status yang baru di-request adalah "Dibatalkan" DAN status sebelumnya BUKAN "Dibatalkan":
  - Lakukan *looping* pada `order.items`.
  - Kembalikan stok produk (atau `ProductVariant` jika ada) dengan menambahkan (`increment`) jumlah `quantity` pesanan kembali ke `stokTotal` / `stok` di database Prisma menggunakan Prisma `$transaction` agar aman.

## 3. Aturan Pengembangan
1. Dilarang menjalankan terminal apapun, asumsikan package sudah di-install.
2. Pastikan logika pengembalian stok aman dan tidak terjadi duplikasi pengembalian jika admin menekan "Dibatalkan" dua kali.
3. Gunakan bahasa Indonesia untuk komentar kode.