# Update PRD: Peningkatan UI/UX Dasbor Admin (Pesanan)

## 1. Latar Belakang
- Tampilan antarmuka untuk manajemen pesanan di Dasbor Admin terasa kaku, terutama pada elemen form seperti dropdown status pesanan.
- Seiring bertambahnya transaksi, Admin kesulitan melacak pesanan spesifik karena tidak adanya fitur pencarian.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Modernisasi Dropdown Status:**
  - Ganti elemen `<select>` HTML bawaan pada form "Status Pesanan" (di dalam modal Proses Pesanan) dengan komponen dropdown modern.
  - Jika menggunakan library UI (seperti Shadcn UI, Headless UI, atau Radix UI), manfaatkan komponen `Select` mereka agar tampilan lebih elegan, *mobile-friendly*, dan konsisten di semua *browser*.
- **Fitur Pencarian Pesanan (Live Search):**
  - Tambahkan sebuah *Search Bar* (Input text) di halaman utama `Pesanan` (di sebelah komponen filter bulan/tahun).
  - Implementasikan logika pencarian *real-time* atau *debounced search* pada *frontend* (atau via parameter URL ke *backend* jika *server-side pagination*).
  - Pencarian harus mencakup pencocokan teks terhadap:
    1. **No Invoice** (misal: "KKF-178...").
    2. **Nama Pelanggan** (misal: "Pranata...").