# Update PRD: Full Migration to BiteShip (Location & Shipping Rates)

## 1. Latar Belakang Masalah
- API Komerce (RajaOngkir wrapper) telah mencapai limit harian (Error 429: Daily limit exceeded).
- Efek dari limit ini mematikan dua sistem krusial sekaligus: Dropdown Wilayah (Provinsi & Kota) menjadi kosong, dan Kalkulasi Ongkos Kirim gagal total.
- Migrasi total ke BiteShip diperlukan segera menggunakan `BITESHIP_API_KEY`.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor Route Handler (Wilayah & Ongkir):**
  - Rombak total 3 file API ini: 
    1. API Provinsi (misal `app/api/wilayah/provinsi/route.ts`)
    2. API Kota/Kabupaten (misal `app/api/wilayah/kabupaten/[provinceId]/route.ts` atau endpoint Area)
    3. API Ongkos Kirim (`app/api/ongkir/route.ts`)
  - Ganti seluruh URL *fetch* menjadi *endpoint* resmi BiteShip (`https://api.biteship.com/v1/...`).
  - Gunakan `process.env.BITESHIP_API_KEY` pada Header otorisasi.
- **Data Mapping & UI Compatibility (Sangat Krusial):**
  - *Frontend* Checkout sudah memiliki *state* dan struktur UI yang *fixed*. Perubahan di *backend* ini **tidak boleh merusak antarmuka**.
  - Tangkap *response* dari BiteShip, lalu **petakan ulang (map)** bentuk JSON-nya di rute API Next.js agar format *array of objects*-nya menyerupai struktur yang diharapkan oleh komponen *frontend* (misalnya mengembalikan format `id` dan `name` untuk wilayah, dan format `courier`, `service`, `cost` untuk ongkir).
  - Pastikan setiap pesan *error* atau *feedback* UI yang muncul tetap menggunakan bahasa Indonesia.