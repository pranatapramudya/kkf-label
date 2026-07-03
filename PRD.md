# Update PRD: Fix WhatsApp Deep Link Handling in Capacitor (WebView)

## 1. Latar Belakang Masalah
- Fitur "Promosi WhatsApp" di halaman Admin memunculkan *error* `net::ERR_UNKNOWN_URL_SCHEME` saat tombol ditekan dari dalam aplikasi Android (WebView Capacitor).
- *Bug* ini terjadi karena Android WebView secara *default* tidak mengenali dan menolak *custom URL scheme* seperti `whatsapp://`.
- Di versi *desktop browser*, fungsi berjalan normal (diarahkan ke WhatsApp Web).

## 2. Kebutuhan Solusi Logika (Requirement)
- **Refaktor Logika Tombol Promo WA:**
  - Modifikasi aksi klik (onClick) atau tautan (href) pada tombol Promosi WhatsApp.
  - Gunakan format URL standar: `https://wa.me/628XXXXXXX?text=PesanPromo`.
  - **Penting untuk Capacitor:** Agar aplikasi tidak terjebak di dalam WebView, tautan keluar ini harus dipaksa dibuka oleh *browser/handler* bawaan sistem operasi.
  - Jika menggunakan HTML Anchor, pastikan menggunakan `<a href="..." target="_blank" rel="noopener noreferrer">`.
  - Jika menggunakan fungsi JavaScript, gunakan `window.open(url, '_blank')`.
  - Jika proyek sudah menggunakan plugin `@capacitor/browser`, prioritaskan menggunakan fungsi `Browser.open({ url: waUrl })` untuk kompatibilitas *native* yang sempurna.