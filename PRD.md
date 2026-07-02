# Update PRD: Fix Region Fetching (Provinsi & Kota) with RajaOngkir Starter

## 1. Latar Belakang Masalah
- *Dropdown* pemilihan Provinsi dan Kota di halaman Checkout kosong ("Pencarian tidak ditemukan").
- Terdapat indikasi bahwa *endpoint* pengambilan data wilayah (Provinsi & Kota) masih salah konfigurasi atau tidak menembak *endpoint* resmi RajaOngkir Starter.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor Route Handler Wilayah:**
  - Periksa dan perbaiki *file* API yang menangani pengambilan data Provinsi dan Kota (misalnya `app/api/provinsi/route.ts` dan `app/api/kota/route.ts` atau yang serupa).
  - Pastikan *fetch* diarahkan ke *endpoint* resmi: `https://api.rajaongkir.com/starter/province` dan `https://api.rajaongkir.com/starter/city`.
  - Gunakan `process.env.RAJAONGKIR_API_KEY` sebagai *header key*.
- **Error Handling & Limit Mapping:**
  - Tambahkan blok `try-catch`. Jika *response* dari RajaOngkir gagal (misal karena limit 100/hari habis), kembalikan *status code* 400 dengan JSON yang jelas agar *frontend* tidak *crash* atau *looping* tanpa batas.
  - Lakukan *mapping* hasil JSON (dari `data.rajaongkir.results`) ke dalam format *array* objek yang sesuai dengan komponen *dropdown* (biasanya butuh properti `id` dan `name`).