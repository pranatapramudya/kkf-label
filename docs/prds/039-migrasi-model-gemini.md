# PRD 039: Migrasi Versi Model LLM (Resolusi 404 API Deprecation)

## 1. Konteks & Tujuan
Terjadi kegagalan komunikasi dengan *endpoint* Google Generative AI (Status 404: Model Not Found). Berdasarkan log error, model `gemini-1.5-flash` tidak lagi didukung atau telah ditarik dari *server* API Google pada versi saat ini. Tujuan PRD ini adalah melakukan migrasi referensi pemanggilan model AI di *backend* menuju versi mayor terbaru yang didukung oleh ekosistem Google (Gemini 2.5 Flash), tanpa merubah struktur *streaming* maupun skema data yang sudah stabil.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
AI Agent wajib memperbarui parameter konfigurasi model dengan spesifikasi berikut:

### Pembaruan Referensi Model
- Temukan pemanggilan fungsi *streaming* utama (bagian inisialisasi model AI).
- Ubah *string* penamaan model dari versi 1.5 yang sudah usang (`gemini-1.5-flash`) menjadi versi terbaru yang stabil, yaitu `gemini-2.5-flash` (atau `gemini-2.0-flash` bergantung pada ketersediaan SDK Google terkini yang terinstal).
- Pastikan *System Prompt* (instruksi agar AI bertindak sebagai Virtual Stylist dengan bahasa Indonesia) tetap dipertahankan seperti aslinya.
- Pastikan parameter data yang dikirimkan tetap menggunakan variabel yang sudah melalui proses *mapping* atau normalisasi.

## 3. Kriteria Selesai (Acceptance Criteria)
- Tidak ada lagi pesan error `AI_APICallError 404` dari *endpoint* Google.
- Chat dari *frontend* berhasil diproses dan dikembalikan sebagai *stream response*.
- Layar obrolan *frontend* berhasil merender teks balasan dari Virtual Stylist tanpa terjadi hambatan jaringan.