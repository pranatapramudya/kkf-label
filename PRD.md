# PRD (Product Requirements Document) - KKF Label v5.9

## 1. Overview
Finalisasi pengalaman pengguna (UX) untuk Dashboard Affiliate: Integrasi profil mandiri, navigasi mobile yang bersih, dan sistem deep-link produk.

## 2. Fitur Utama (Sprint Goal)

### A. Affiliate Profile Management
- **Self-Service:** Integrasi `<UserProfile />` dari Clerk di rute `/affiliate/profil` untuk update data akun (nama, email, foto, password).
- **Security:** Hanya bisa diakses oleh role `affiliate`.

### B. Mobile Navigation (Dashboard)
- **UI Decoupling:** Menghapus Bottom Nav belanja di rute `(dashboard)`.
- **Hamburger Menu:** Menambahkan Mobile Header dengan *hamburger menu* untuk navigasi internal dashboard (Dashboard, Profil, Riwayat, Logout).

### C. WhatsApp Withdrawal System
- **Integration:** Tombol "Tarik Saldo" pada Dashboard.
- **Auto-Message:** Saat diklik, user diarahkan ke link `https://wa.me/62...` dengan pesan otomatis: "Halo Admin, saya ingin melakukan penarikan komisi. [Data Nama/Jumlah Saldo/Rekening]".

### D. Product Deep-Link Generator
- **Smart Link:** Tombol "Bagikan Produk" di halaman detail produk.
- **Dynamic Logic:** Tombol ini otomatis mengambil `ref=ID_AFFILIATE` dan URL produk saat ini, lalu menyalinnya ke clipboard.

## 3. STRICT PROTOCOL
- Gunakan `process.env.NEXT_PUBLIC_BASE_URL` untuk link.
- Gunakan komponen Clerk resmi (`<UserProfile />`).
- Dashboard wajib responsif (mobile header harus rapi).
- Zero dummy data: Tarik data real dari tabel `Affiliate` dan `Order`.