# PRD: RajaOngkir Integration Audit & Testing (v26.0)

## 1. Objective
Melakukan audit menyeluruh pada rute API RajaOngkir untuk memastikan kalkulasi ongkos kirim berfungsi dengan baik, tidak ada *hardcode* yang salah, dan siap untuk digunakan di *production*.

## 2. Scope of Work
- **Route Audit:** Memeriksa file API endpoint untuk RajaOngkir (misal: `app/api/rajaongkir/cost/route.ts` atau endpoint provinsi/kota).
- **Payload Validation:** Memastikan API menerima dan mengirim parameter yang benar sesuai dokumentasi RajaOngkir (origin, destination, weight, courier).
- **Error Handling:** Memastikan ada *response* error yang jelas jika API Key invalid atau server RajaOngkir sedang *down*.
- **Test Generation:** Membuatkan *script test* atau *cURL command* agar user bisa langsung mengetes API tersebut dari terminal.

## 3. Strict Guidelines
- **API Key Security:** Pastikan API Key diambil dari `process.env.RAJAONGKIR_API_KEY`, jangan di- *hardcode*.
- **Type Safety:** Pastikan *response* dari RajaOngkir di- *parsing* dengan benar sebelum dikirim ke *frontend*.