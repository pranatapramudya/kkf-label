# PRD: Universal Admin Table Pagination (v24.0)

## 1. Objective
Mengimplementasikan sistem *Pagination* (Halaman Next/Previous) pada seluruh tabel data di halaman Admin untuk membatasi tampilan maksimal 10 baris per halaman, meningkatkan performa *rendering*, dan merapikan UI.

## 2. Scope of Work
- **Target Components:** Semua komponen tabel di dasbor admin (misal: Tabel Pesanan, Tabel Ulasan, Tabel RFM).
- **State Management:** Menambahkan logika *client-side pagination* menggunakan `useState` untuk melacak `currentPage`.
- **Data Slicing:** Memotong array data asli agar hanya me-render 10 item yang sesuai dengan halaman aktif.
- **UI Navigation:** Menambahkan kontrol navigasi (tombol "Sebelumnya" dan "Selanjutnya", beserta indikator "Halaman X dari Y") di bagian bawah setiap tabel.

## 3. Strict Guidelines
- **Limit:** Fix 10 baris data per halaman (Items Per Page = 10).
- **UX Fallbacks:** - Tombol "Sebelumnya" harus *disabled* jika berada di halaman 1.
  - Tombol "Selanjutnya" harus *disabled* jika berada di halaman terakhir.
- **Styling:** Kontrol navigasi harus berada di bawah tabel, memiliki desain yang serasi (border/background Tailwind), dan responsif di mobile.