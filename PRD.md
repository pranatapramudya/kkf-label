# PRD: KKF Label Phase 2.3 - Global Navigation & High-Traffic Scaling (ISR)

## 1. Objective (Tujuan)
Menghilangkan *delay* saat navigasi kembali ke Beranda melalui logo Navbar, sekaligus membentengi halaman utama (*Home/Catalog*) agar mampu menahan lonjakan trafik masif (ratusan hingga ribuan pengguna bersamaan) tanpa membebani koneksi *database* Prisma.

## 2. Analisis Masalah & Solusi
- **Masalah Navigasi Global:** Klik pada logo perusahaan di komponen Header/Navbar masih memicu *hard reload* atau pemuatan ulang seluruh aset (*Full Page Load*).
  - **Solusi:** Migrasi elemen pembungkus logo menjadi komponen `<Link>` dari Next.js untuk mempertahankan status SPA (*Single Page Application*).
- **Masalah Skalabilitas Database (Bottleneck):** Jika 1.000 pengguna mengakses halaman depan secara bersamaan, *server* akan menjalankan 1.000 *query* ke *database*.
  - **Solusi:** Mengimplementasikan fitur **ISR (Incremental Static Regeneration)** pada halaman utama. Next.js akan menyimpan (*cache*) hasil *query* halaman beranda selama durasi tertentu (misal: 60 detik). Ribuan pengunjung dalam rentang waktu tersebut hanya akan membebani *database* sebanyak 1 kali pemanggilan, memastikan pemuatan halaman sangat ringan dan super cepat.

## 3. Spesifikasi Implementasi
1. **Komponen Header/Navbar:** Modifikasi elemen `<a href="/">` atau struktur serupa yang membungkus gambar logo menjadi `<Link href="/">`.
2. **Route Halaman Utama (`app/(main)/page.tsx`):** Tambahkan direktif *Route Segment Config* berupa `export const revalidate = 60;` untuk mengaktifkan ISR. Halaman akan di- *cache* dan diperbarui otomatis di latar belakang setiap 60 detik tanpa mengganggu pengalaman pengguna.