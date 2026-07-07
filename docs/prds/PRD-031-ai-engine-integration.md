# PRD 031: Integrasi Vercel AI SDK, Gemini API, dan Prisma RAG

## 1. Konteks & Tujuan
Setelah antarmuka (UI) halaman `/rekomendasi` selesai dan dipresisikan (bebas dari komponen global layout), sistem membutuhkan "otak" AI untuk merespons chat pengguna. Fitur ini akan menggunakan Vercel AI SDK dengan model Google Gemini 1.5 Flash. Untuk mencegah halusinasi, sistem akan menerapkan RAG (Retrieval-Augmented Generation) dengan mengambil data langsung dari PostgreSQL melalui Prisma.

## 2. Persiapan Sistem (Environment)
- API Key Google Gemini telah ditambahkan di file `.env` dengan nama variabel `GOOGLE_GENERATIVE_AI_API_KEY`.
- Membutuhkan instalasi package: `ai` dan `@ai-sdk/google`.

## 3. Arsitektur Backend (`app/api/chat/route.ts`)
- Menerima request `POST` berisi history `messages`.
- Mengambil data produk dari database menggunakan Prisma Client (hanya field relevan seperti nama, kategori, deskripsi, dan harga).
- Membentuk `systemPrompt` dinamis yang menginstruksikan AI untuk bertindak sebagai Virtual Stylist KKF Label dan HANYA merekomendasikan produk dari string JSON data produk tersebut.
- Mengembalikan respons menggunakan `streamText` agar efek mengetik (streaming) terlihat di frontend.

## 4. Arsitektur Frontend (`app/rekomendasi/page.tsx`)
- Menghapus logika dummy message statis.
- Mengimplementasikan hook `useChat` dari library `ai/react`.
- Mengatur konfigurasi `initialMessages` pada hook `useChat` agar sapaan pertama bot langsung muncul: *"Halo! Saya AI Virtual Stylist KKF Label. Mau bepergian kemana hari ini? Biar kami siapkan rekomendasi outfit yang paling cocok untuk kamu!"*
- Menghubungkan input box dan tombol submit dengan event handler dari `useChat`.

## 5. Kriteria Selesai (Acceptance Criteria)
- User dapat mengirim pesan ke AI.
- AI membalas secara real-time (streaming text).
- AI mengenali dan merekomendasikan baju yang benar-benar ada di database KKF Label.