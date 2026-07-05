# Product Requirements Document (PRD) - Rate Limiting & Cloudflare Turnstile

## 1. Konteks
Sistem Checkout Guest saat ini rentan terhadap serangan spam bot yang dapat memanipulasi stok dan memenuhi database. Untuk mengamankan endpoint pembayaran yang sudah terintegrasi, kita membutuhkan dua lapis keamanan: Cloudflare Turnstile (reCAPTCHA modern yang lebih ringan dan invisible) di sisi Client, dan Rate Limiting berbasis IP di sisi Server/API.

## 2. Detail Tugas (Tasks)

**Task A: Instalasi & Setup Turnstile (Client-Side)**
- Install library ringan untuk Turnstile: jalankan `npm install @marsidev/react-turnstile` di terminal.
- Buka komponen Klien untuk halaman Checkout (tempat tombol "Buat Pesanan" berada).
- Impor dan pasang komponen `<Turnstile />` tepat di atas tombol submit.
- Gunakan sitekey dummy/testing bawaan Cloudflare untuk development: `1x00000000000000000000AA` (Always passes).
- Tangkap `token` yang dihasilkan oleh Turnstile menggunakan callback `onSuccess={(token) => setTurnstileToken(token)}`.
- Cegah tombol submit ditekan JIKA `turnstileToken` belum didapatkan. Sisipkan token ini ke dalam payload POST ke API Checkout.

**Task B: Verifikasi Token & Rate Limiting di API (Server-Side)**
- Buka route handler untuk API Checkout (`app/api/checkout/route.ts` atau sejenisnya).
- **Lapis 1 (Rate Limiting):** - Buat sebuah `Map` JavaScript sederhana di luar scope fungsi POST sebagai in-memory store penyimpan IP (`const rateLimitMap = new Map();`).
  - Dapatkan IP user menggunakan `req.headers.get('x-forwarded-for')` atau `req.ip`.
  - Logika: Batasi maksimal 3 request per 1 jam untuk IP yang sama. Jika lebih, kembalikan response `429 Too Many Requests` dengan pesan "Anda terlalu sering membuat pesanan. Coba lagi nanti."
- **Lapis 2 (Turnstile Verification):**
  - Ambil `turnstileToken` dari body request.
  - Lakukan fetch POST ke `https://challenges.cloudflare.com/turnstile/v0/siteverify` mengirimkan `secret` (gunakan dummy secret `1x0000000000000000000000000000000AA` untuk testing) dan `response` (token dari client).
  - Jika respons Cloudflare gagal (`success: false`), kembalikan response `403 Forbidden` dengan pesan "Verifikasi keamanan gagal, terdeteksi sebagai bot."

## 3. Aturan Pengembangan (Strict Rules)
1. **ZERO DISRUPTION:** Pastikan alur Payment Gateway yang sudah ada tidak rusak/tertimpa. Sisipkan logika keamanan ini HANYA di bagian awal fungsi API (sebagai gerbang penjaga).
2. Terapkan di localhost menggunakan dummy key Cloudflare.