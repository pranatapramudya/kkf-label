# PRD: Top-Tier E-Commerce Security Audit & Implementation (v30.0)

## 1. Objective
Mengimplementasikan standar keamanan level *Enterprise / Top-Tier E-Commerce* pada aplikasi, berfokus pada otentikasi *webhook* pembayaran, proteksi rute API, dan injeksi *Security Headers* global.

## 2. Scope of Work
- **Midtrans Webhook Security:** Memvalidasi *Signature Key* yang dikirim oleh Midtrans menggunakan algoritma SHA512 (`order_id` + `status_code` + `gross_amount` + `ServerKey`) untuk mencegah *Fraud / Spoofing* pada endpoint `/api/webhook/midtrans`.
- **Admin Route & API Protection:** Mengamankan rute `app/(dashboard)/admin` dan seluruh API endpoint `/api/admin/*` agar hanya bisa diakses oleh *session* admin yang valid (via Middleware atau server-side auth check).
- **Global Security Headers:** Menambahkan HTTP Security Headers (X-Frame-Options, X-Content-Type-Options, Strict-Transport-Security, X-XSS-Protection) di `next.config.js` atau `middleware.ts` untuk mencegah serangan Clickjacking dan XSS.

## 3. Strict Guidelines
- **Zero Trust Architecture:** Jangan pernah percaya data *payload* dari klien/webhook tanpa melakukan validasi otentikasi atau *hash matching*.
- **No Hardcoded Secrets:** Pastikan proses *hashing* menggunakan `process.env.MIDTRANS_SERVER_KEY`.
- **Graceful Rejection:** Jika ada *unauthorized request*, tolak dengan status 401/403 dan jangan bocorkan *stack trace* error ke *response*.