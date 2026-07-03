# Update PRD: Optimasi Reaktivitas Pencarian & Responsivitas Mobile Header

## 1. Latar Belakang
- Fitur navigasi "Buka Detail" dari notifikasi mengalami *delay* (tidak reaktif) di mana admin harus me-*refresh* halaman secara manual agar tabel tersaring.
- Tata letak (*layout*) *Header/TopBar* pada perangkat *mobile* berantakan. Ikon Notifikasi (Bell) terpisah dari Ikon Profil, menyebabkan UI terlihat tidak rapi.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Reaktivitas URL & Search Bar (State Sync):**
  - Komponen pencarian (Search Bar) di halaman Pesanan harus tersinkronisasi langsung dengan URL *Query Parameters*.
  - Gunakan `useEffect` yang mendengarkan perubahan nilai `searchParams.get('search')` untuk memperbarui *state* lokal (input *value*), sehingga saat tombol "Buka Detail" diklik, UI otomatis merender ulang (*re-render*) tabel tanpa perlu *reload* halaman manual.
- **Perbaikan Layout Header Mobile (Tailwind CSS):**
  - Restrukturisasi pembungkus elemen di *TopBar*. Kelompokkan Ikon Notifikasi dan Foto Profil ke dalam satu kontainer div khusus (`flex items-center gap-2` atau `gap-4`).
  - Untuk elemen "Kalkulator Profit" dan "Diperbarui", buat agar tampil responsif (misalnya, teks disembunyikan di layar kecil `hidden sm:block`, atau biarkan *wrap* ke baris bawah dengan rapi tanpa merusak posisi grup Lonceng & Profil di kanan atas).