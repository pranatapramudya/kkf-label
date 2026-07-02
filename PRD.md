# Update PRD: Rollback to Komerce API (Location & Shipping Rates)

## 1. Latar Belakang Masalah
- Eksperimen migrasi ke BiteShip dibatalkan karena menyebabkan *breaking changes* pada *frontend* (Dropdown wilayah tidak berfungsi) dan membutuhkan aktivasi kurir manual di *dashboard*.
- Sistem harus dikembalikan (rollback) 100% menggunakan ekosistem Komerce (RajaOngkir Wrapper) karena komponen UI klien sudah dioptimalkan untuk struktur data Komerce.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Rollback Route Handler (Wilayah & Ongkir):**
  - Buka dan kembalikan logika kode pada API Provinsi, API Kota, dan API Ongkir ke versi Komerce.
  - **Endpoint Provinsi:** `https://rajaongkir.komerce.id/api/v1/destination/province`
  - **Endpoint Kota:** `https://rajaongkir.komerce.id/api/v1/destination/city/{province_id}`
  - **Endpoint Ongkir:** Gunakan endpoint kalkulasi domestik Komerce atau kembalikan ke kode sebelumnya yang stabil.
  - Gunakan kembali `process.env.RAJAONGKIR_API_KEY` untuk autentikasi.
- **Data Mapping & Bahasa:**
  - Pastikan *response* JSON dikembalikan persis seperti struktur asli Komerce agar *dropdown* wilayah bisa kembali mencari daerah (misalnya pencarian kota berfungsi normal).
  - Pastikan semua pesan *error* di- *mapping* ke dalam bahasa Indonesia. Jangan ada pesan *error* berbahasa Inggris yang lolos ke *frontend*.