# Update PRD: Fix Next.js Aggressive Caching on Komerce API

## 1. Latar Belakang Masalah
- Pasca-*rollback* ke Komerce, API mengembalikan respons "Limit habis" padahal kuota di dasbor masih tersisa (30/100).
- Diagnosis: Next.js melakukan *caching* terhadap respons *error* 429 sebelumnya. Karena kode di-*rollback* ke versi lama, perilaku *caching* bawaan Next.js kembali aktif, sehingga aplikasi tidak benar-benar melakukan *fetch* ke server Komerce melainkan menyajikan *cache error* yang sudah usang.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Matikan Cache Secara Paksa (Bypass Cache):**
  - Buka file route handler untuk Provinsi, Kota, dan Ongkir.
  - Tambahkan deklarasi `export const dynamic = 'force-dynamic';` di baris paling atas (setelah import) pada ketiga file tersebut.
  - Pada setiap fungsi `fetch()`, pastikan menambahkan opsi `{ cache: 'no-store' }`.
  - Opsional: Tambahkan *query parameter* `?t=${Date.now()}` pada URL *fetch* ke Komerce untuk benar-benar memaksa Next.js melewati *cache*.