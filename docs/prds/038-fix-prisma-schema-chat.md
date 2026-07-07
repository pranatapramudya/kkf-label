# PRD 038: Resolusi Arsitektur Prisma Runtime & Normalisasi Payload Gemini

## 1. Konteks & Tujuan
Sistem mengalami dua kegagalan *backend* pada endpoint obrolan AI:
1. **Crash Runtime:** Prisma Client menolak beroperasi karena environment saat ini di- *set* ke Edge Runtime.
2. **Schema Mismatch (AI_InvalidPromptError):** Terdapat perbedaan struktur data antara *request* dari *frontend* dengan ekspektasi model Gemini. *Frontend* (menggunakan standar Vercel SDK terbaru) mengirimkan pesan dalam format objek `parts` (array), sedangkan parameter `messages` pada fungsi *streaming* mengekspektasikan format `content` (string).
Tujuan PRD ini adalah mengembalikan konfigurasi *runtime* ke standar Node.js dan membangun *middleware/mapping logic* sederhana sebelum *payload* dikirim ke model AI.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
AI Agent wajib menerapkan logika berikut tanpa merusak arsitektur *try-catch* dan *system prompt* bahasa Indonesia yang sudah ada:

### A. Downgrade Lingkungan Eksekusi (Runtime)
- Temukan deklarasi konstanta yang mengatur `runtime` menjadi `edge` di bagian atas file.
- Ubah nilai deklarasi tersebut menjadi `nodejs` agar koneksi Prisma ke PostgreSQL dapat berjalan secara *native*.

### B. Normalisasi Payload (Data Mapping)
- Tepat setelah melakukan ekstraksi *request body* (JSON), buat sebuah logika pemetaan (*mapping*) terhadap array pesan yang masuk.
- **Logika Ekstraksi:** Untuk setiap iterasi pesan, periksa apakah objek tersebut memiliki properti `parts` yang berupa array.
- Jika ya, ambil nilai teks dari dalam elemen pertama array `parts` tersebut. Jika tidak ada, gunakan kembali properti `content` standar (sebagai *fallback*).
- **Rekonstruksi Objek:** Bentuk ulang array pesan tersebut menjadi kumpulan objek yang hanya berisi dua properti utama: `role` (dari pesan asli) dan `content` (berisi teks murni hasil ekstraksi di atas).

### C. Pembaruan Parameter Model AI
- Ubah parameter masukan pada fungsi *streaming* utama. 
- Pastikan parameter `messages` yang dikirim ke model AI (Gemini) menggunakan array pesan yang sudah dinormalisasi pada langkah B, bukan array mentah langsung dari *request body*.

## 3. Kriteria Selesai (Acceptance Criteria)
- Tidak ada indikasi error "PrismaClient is not configured to run in Edge Runtime" di terminal server.
- Tidak ada indikasi `AI_InvalidPromptError` dari Vercel SDK.
- Sistem mampu memproses input teks murni dari *frontend*, menerjemahkannya di *backend*, dan mengembalikan *stream* balasan secara normal.