PRD (Product Requirements Document) - KKF Label v4.1
1. Deskripsi Proyek
KKF Label adalah aplikasi e-commerce premium terintegrasi yang melayani penjualan produk, manajemen pesanan admin, otomatisasi logistik, dan payment gateway.

2. Tech Stack
Frontend/Backend: Next.js (App Router), TypeScript, TailwindCSS.

Database & ORM: PostgreSQL, Prisma.

3. Fitur yang SUDAH Selesai
Sistem Autentikasi & Pelanggan: Katalog, checkout, lacak resi, Floating CS WA.

Manajemen & Analitik: Dashboard admin, cetak resi thermal, kalkulator profit.

Integrasi Logistik & Pembayaran: Biteship (Webhook) & Midtrans.

Stok Realtime: Prisma Transaction (decrement) varian dan stok utama.

UI Promosi: Tampilan responsif (tabel di desktop, card di mobile).

4. Tugas Saat Ini (To-Do List untuk AI Agent) - FINAL POLISH
Tolong baca dan eksekusi 3 perbaikan (Bug Fix & UI Cleanup) di bawah ini langsung pada codebase:

1. Hapus Logo Admin Redundan di Header

Masalah: Di bagian header navigasi atas Admin, terdapat logo gambar KKF di sebelah kiri teks "KKF-LABEL-ADMIN". Ini berlebihan karena di sebelah kanan sudah ada avatar profil dari sistem Clerk.

Solusi: Scan komponen header admin Anda (mungkin di dalam sistem SPA admin). Temukan dan hapus elemen <img> logo KKF yang berada di sisi kiri tersebut agar header terlihat lebih bersih dan minimalis.

2. Fix Bug Tautan Broadcast Email (Tag Anchor & URL Encoding)

File target: Komponen UI Promosi (Tabel dan Card pelanggan).

Masalah: Tombol "Kirim via Email" tidak merespon saat diklik.

Solusi: Jangan gunakan <button onClick="...">. Ubah tombol menjadi tag HTML <a> murni. Gunakan href dengan skema mailto: dan pastikan variabel teks menggunakan encodeURIComponent.

Contoh: href={"mailto:" + emailPenerima + "?subject=" + encodeURIComponent(judulPromo) + "&body=" + encodeURIComponent(isiPesan)}

3. Tambahkan Silent Auto-Refresh di Frontend (Polling 15 Detik)

File target: Halaman utama pelanggan (katalog produk).

Masalah: Perubahan stok yang terjadi di database harus diperbarui di layar pembeli tanpa refresh manual, namun me-refresh setiap 1 detik akan membuat server down dan limit Vercel habis.

Solusi: Buat mekanisme Silent Background Polling (misal menggunakan useEffect dengan useRouter().refresh()) yang hanya berjalan setiap 15 detik (15000 ms). Pastikan proses ini berjalan diam-diam di background tanpa memunculkan indikator loading penuh yang mengganggu UX pembeli.