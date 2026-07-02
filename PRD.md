# Update PRD: Strict Implementation of Komerce API Docs (Location)

## 1. Latar Belakang Masalah
- Dropdown Provinsi dan Kota mati, serta muncul pesan *error* terkait limit/invalid key.
- Berdasarkan dokumentasi resmi Komerce, terjadi kesalahan pada pengiriman *Header* dan pembacaan struktur *Response JSON* oleh *backend*.

## 2. Kebutuhan Solusi Logika (Requirement)
- **Perbaikan Header Request:**
  - Endpoint Provinsi: `https://rajaongkir.komerce.id/api/v1/destination/province`
  - Endpoint Kota: `https://rajaongkir.komerce.id/api/v1/destination/city/{province_id}`
  - **WAJIB:** Header otorisasi harus ditulis persis seperti dokumentasi: `Key` (huruf K kapital). Contoh: `{ "Key": process.env.RAJAONGKIR_API_KEY }`.
- **Perbaikan Data Mapping (Krusial):**
  - Response dari Komerce memiliki struktur `{ "meta": {...}, "data": [...] }`.
  - Backend Next.js **TIDAK BOLEH** langsung mem-proxy JSON ini ke frontend jika frontend mengharapkan struktur RajaOngkir standar.
  - Tangkap response dari Komerce, ambil `json.data`, lalu kembalikan (return) ke *frontend* dalam bentuk yang sesuai dengan komponen Dropdown (misalnya *array* murni atau dibungkus ulang dalam format `{ rajaongkir: { results: json.data } }` tergantung *state frontend*).
  - Tambahkan penanganan error: Jika `meta.code !== 200`, kembalikan *error message* dari `meta.message`.