# Update PRD: Fix Region Fetching (Komerce Wrapper for RajaOngkir)

## 1. Latar Belakang Masalah
- *Dropdown* Provinsi dan Kota mati ("Pencarian tidak ditemukan").
- Kesalahan diagnosis sebelumnya: Proyek ini secara sah menggunakan API Key dari ekosistem Komerce (yang membungkus RajaOngkir), bukan dari rajaongkir.com langsung. Sisa kuota masih tersedia (30/100).
- Bug terjadi karena *backend* melakukan *pass-through* (proxy murni) respons Komerce, sementara *frontend* mengharapkan struktur data JSON resmi RajaOngkir (misal mencari properti `data.rajaongkir.results`).

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor Route Handler Wilayah (Provinsi & Kota):**
  - Pastikan menggunakan endpoint Komerce: 
    - `https://rajaongkir.komerce.id/api/v1/destination/province`
    - `https://rajaongkir.komerce.id/api/v1/destination/city/{province_id}`
  - Gunakan `process.env.RAJAONGKIR_API_KEY` sebagai *header key*.
  - Hapus opsi `cache: "force-cache"` agar data selalu segar.
- **Data Mapping (Sangat Krusial):**
  - Jangan lakukan *proxy murni*. 
  - Tangkap *response* dari Komerce, ekstrak *array* datanya (biasanya ada di dalam properti `data` atau `data.data`), lalu **petakan ulang (map)** menjadi struktur yang dibaca oleh komponen *dropdown Checkout*.
  - Pastikan kembalian JSON dari *backend* Next.js ini memiliki format *array of objects* yang sama persis dengan yang dibutuhkan UI *frontend* (mengandung `id`, `name`, dll, atau buatkan mock pembungkus `{ rajaongkir: { results: [...] } }` jika *frontend* memaksa mencari *path* tersebut).