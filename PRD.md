# Update PRD: Fix Shipping API (Enforce RajaOngkir Starter)

## 1. Latar Belakang Masalah
- Terdapat ketidaksesuaian implementasi: Endpoint saat ini menggunakan Komerce API yang sedang terkena *limit*, padahal proyek ini dikonfigurasi untuk menggunakan RajaOngkir Starter (Free).
- Dibutuhkan perombakan *route handler* ongkir agar 100% menggunakan API resmi RajaOngkir.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor `app/api/ongkir/route.ts`:**
  - Hapus seluruh URL endpoint Komerce.
  - Gunakan endpoint resmi RajaOngkir: `https://api.rajaongkir.com/starter/cost`.
  - Gunakan Header `key` dengan nilai dari `process.env.RAJAONGKIR_API_KEY`.
- **Penyesuaian Payload & Response:**
  - Kirim *body* request sesuai format RajaOngkir: `origin`, `destination`, `weight`, dan `courier` (dukungan kurir gratisan: jne, pos, tiki).
  - Lakukan *mapping* dari *response* `data.rajaongkir.results` menjadi *array* berformat seragam yang bisa dibaca oleh *frontend* (komponen *checkout* saat ini) agar UI tidak rusak.