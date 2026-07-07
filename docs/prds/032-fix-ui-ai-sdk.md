# PRD 032: Standardisasi UI Chat & Resolusi Bug State Vercel AI SDK

## 1. Konteks & Tujuan
Implementasi pada halaman rekomendasi sebelumnya mengalami kegagalan *state* (input *freeze*, layar *blank*, dan *error read-only*) akibat penggunaan *hack* dan *bypass* manual pada hook `useChat`. Tujuan tahap ini adalah melakukan *reset* pada file UI dan mengimplementasikan Vercel AI SDK murni sesuai dokumentasi resmi, agar *SaaS premium boilerplate* ini memiliki basis kode yang bersih, stabil, dan siap dijual.

## 2. Instruksi Refactoring Frontend (`app/(main)/rekomendasi/page.tsx`)
AI Agent harus menulis ulang logika *state* di halaman ini menggunakan standar *native* dari `@ai-sdk/react`.

### Aturan Ketat Implementasi:
- **Pembersihan Total:** Hapus seluruh *bypass* kotor termasuk komentar `// @ts-nocheck`, `as any`, variabel `displayMessages`, dan manual `setInput`.
- **Inisialisasi Hook Murni:** Destructuring *wajib* mengikuti standar ini tanpa penambahan atau pengurangan:
  ```typescript
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: "1",
        role: "assistant",
        content: "Halo! Saya AI Virtual Stylist KKF Label. Mau bepergian kemana hari ini? Biar kami siapkan rekomendasi outfit yang paling cocok untuk kamu!"
      }
    ]
  });
Form Binding Standar:

Elemen <input> wajib diikat murni dengan value={input} dan onChange={handleInputChange}. Dilarang keras menggunakan ekstrak setInput atau fungsi inline manual pada event onChange.

Elemen <form> dikendalikan penuh oleh onSubmit={handleSubmit}.

Lokalisasi: Seluruh teks antarmuka harus dipastikan menggunakan bahasa Indonesia yang rapi dan profesional.

3. Kriteria Selesai (Acceptance Criteria)
Kode bersih dari seluruh workaround dan dummy state.

Render awal UI berjalan normal dan merender pesan initialMessages tanpa menyebabkan blank screen.

Form input dapat diketik (mutable) tanpa memicu peringatan read-only field dari React.

Fungsi submit berhasil meneruskan payload pengguna ke endpoint /api/chat