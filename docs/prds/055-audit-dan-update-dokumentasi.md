# PRD 055: Audit Menyeluruh & Pembaruan Dokumentasi Sistem (README & Arsitektur)

## 1. Konteks & Tujuan
Proyek E-Commerce KKF Label baru saja menyelesaikan serangkaian pembaruan masif, mulai dari integrasi RAG (Retrieval-Augmented Generation) untuk fitur AI Stylist, optimasi kalkulasi ongkos kirim API Biteship, hingga pencegahan *overselling* inventaris.
Tujuan PRD ini adalah menginstruksikan AI Agent untuk melakukan audit terhadap seluruh perubahan terbaru dan mendokumentasikannya secara rapi ke dalam file `README.md` dan `arsitektur.md` agar standar pemeliharaan perangkat lunak tetap terjaga.

## 2. Instruksi Eksekusi Audit (Tugas AI Agent)
AI Agent wajib memindai riwayat pembaruan (PRD 038 hingga PRD 054) dan merefleksikannya ke dalam dua dokumen utama:

### A. Pembaruan `README.md`
- Tambahkan deskripsi fitur unggulan baru: **AI Virtual Stylist** (didukung oleh Gemini 2.5 Flash, RAG Database, dan Rate Limiting).
- Perbarui daftar fitur operasional: Manajemen Stok Anti-Overselling, Kalkulasi Ongkir Cerdas & Dinamis (Biteship), dan dukungan kurir Instan (Gojek) serta Reguler.
- Pastikan panduan instalasi lokal dan perintah *build* (*production*) masih relevan.

### B. Pembaruan `arsitektur.md`
- Tambahkan diagram konseptual atau penjelasan alur kerja RAG: Bagaimana Next.js mengambil data produk dari Prisma PostgreSQL, melakukan serialisasi (*mapping*), menyuntikkannya ke *System Prompt* AI, dan mengembalikan *Data Stream Protocol* ke klien dalam format Markdown.
- Jelaskan arsitektur logistik: Penggunaan *Debounce* untuk efisiensi limit API Biteship, pembentukan *payload* berdasarkan *Array Items Mapping*, dan pembagian logika *Distance-Based* (Gojek) vs *Volumetric* (Kurir Reguler).
- Jelaskan mekanisme keamanan: Implementasi *Rate Limiting* ganda (UI dan Backend) untuk AI.

## 3. Kriteria Selesai (Acceptance Criteria)
- File `README.md` dan `arsitektur.md` telah diperbarui dengan bahasa yang profesional, terstruktur, dan mencerminkan kondisi kode sumber ( *source code* ) KKF Label yang paling mutakhir.
- AI Agent memberikan ringkasan singkat kepada *developer* setelah pembaruan dokumentasi selesai.