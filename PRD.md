# Update PRD: Presisi Symmetrical Layout Header (Desktop)

## 1. Latar Belakang Masalah
- **Header Tidak Presisi:** Pada tampilan mode *desktop* (PC/Web), menu navigasi utama ("Katalog", "Lacak Pesanan", "Saya") tidak berada di posisi tengah secara akurat (cenderung bergeser ke kanan).
- Hal ini terjadi karena tata letak *flexbox* tidak membagi ruang secara merata antara Logo (kiri), Navigasi (tengah), dan Ikon Keranjang (kanan).

## 2. Kebutuhan Solusi UX (Requirement)
- **Symmetrical Flex Layout:**
  - Gunakan komposisi 3 kolom seimbang pada *header*.
  - **Kiri (Logo):** Memiliki proporsi ruang `flex-1` dengan posisi konten merapat ke kiri (`justify-start`).
  - **Tengah (Navigasi):** Memiliki proporsi ruang `flex-1` dengan posisi konten merapat ke tengah (`justify-center`).
  - **Kanan (Keranjang):** Memiliki proporsi ruang `flex-1` dengan posisi konten merapat ke kanan (`justify-end`).
  - Pastikan aturan ini hanya berlaku di mode *desktop* (`md:` atau `lg:`), sedangkan mode *mobile* tetap mempertahankan tata letak bawaannya.