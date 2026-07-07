# PRD 030: Integrasi AI Engine (Gemini) & Penyempurnaan UI Stylist

## 1. Konteks & Tujuan
Setelah berhasil mengisolasi halaman `/rekomendasi` menjadi dedicated chat interface dan menyiapkan logika RAG dari database (PRD-029), tahap selanjutnya adalah memperbaiki detail UI (copywriting & indikator) dan mengintegrasikan Vercel AI SDK dengan model LLM (Google Gemini) agar chatbot dapat beroperasi secara real-time.

## 2. Penyempurnaan UI (Frontend)
- **Typo & Copywriting:** Memperbaiki teks "Stylish" menjadi "Stylist".
- **Indikator Status:** Menambahkan animasi titik hijau berkedip (pulsing green dot) di sebelah teks "Online" pada header chat untuk memberi kesan AI selalu aktif (real-time).
- **Initial Greeting (Sapaan Awal):** Mengubah pesan pertama bot menjadi lebih persuasif dan call-to-action (CTA). Teks baru: *"Halo! Saya AI Virtual Stylist KKF Label. Mau bepergian kemana hari ini? Biar kami siapkan rekomendasi outfit yang paling cocok untuk kamu!"*

## 3. Integrasi AI SDK (Backend - Persiapan Tahap 3)
- Menginstal dependensi `ai` (Vercel AI SDK) dan `@ai-sdk/google`.
- Menghubungkan route handler `/api/chat/route.ts` dengan fungsi `streamText` dari AI SDK.
- Memastikan System Prompt (yang berisi JSON data produk dari Prisma) berhasil diinjeksi ke dalam memori LLM sebelum membalas pesan user.
- Mengatur frontend agar menggunakan hook `useChat` dari `ai/react` untuk menangani state input, loading, dan streaming respons.

## 4. Kriteria Selesai (Acceptance Criteria)
- Header chat menampilkan teks "Stylist" dengan indikator hijau berkedip.
- Pesan awal sesuai dengan copywriting baru.
- Pesan balasan dari bot muncul secara streaming (mengetik otomatis) bukan menunggu loading panjang.