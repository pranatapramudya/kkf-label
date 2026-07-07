# PRD 043: Algoritma Ketersediaan Stok & Distribusi Rekomendasi (Smart Inventory RAG)

## 1. Konteks & Tujuan
Sistem E-Commerce KKF Label membutuhkan logika manajemen inventaris yang cerdas pada fitur AI Stylist. Masalah saat ini: AI berpotensi merekomendasikan produk yang stoknya habis (Out of Stock), dan algoritma tidak melakukan pemerataan eksposur terhadap produk non-winning (yang berpotensi menjadi *dead stock*). Tujuan PRD ini adalah memodifikasi kueri *database* agar menerapkan *Absolute Zero-Stock Filter* dan merancang algoritma *Shuffling* di sisi *backend* untuk mendistribusikan rekomendasi produk secara seimbang antara *winning product* dan produk lainnya.

## 2. Instruksi Eksekusi Backend (`app/api/chat/route.ts`)
AI Agent wajib memodifikasi alur pengambilan data RAG dengan logika berikut:

### A. Implementasi Absolute Zero-Stock Filter
- Temukan kueri `prisma.product.findMany`.
- Tambahkan klausa `where` yang secara absolut memfilter produk dengan kondisi stok lebih dari 0. (Asumsi nama kolom adalah `stok` atau `stock`, misalnya: `where: { stok: { gt: 0 } }`).
- AI Agent TIDAK BOLEH memasukkan produk dengan stok habis ke dalam *context window* model AI.

### B. Algoritma Distribusi Data (Shuffle & Slice)
- Hapus pengurutan statis seperti `orderBy: { id: 'asc' }` atau urutan penjualan absolut pada Prisma yang membuat produk non-winning tenggelam.
- Ambil sampel data yang cukup besar (misalnya `take: 40` produk *ready stock*).
- Sebelum data di- *map* menjadi *string* RAG, buat sebuah fungsi JavaScript murni untuk mengacak ( *shuffle* ) array produk tersebut secara acak (misalnya menggunakan algoritma *Fisher-Yates* atau sekadar `sort(() => Math.random() - 0.5)`).
- Setelah diacak, potong array tersebut (menggunakan `.slice(0, 15)`) untuk mengambil 15 produk campuran.
- 15 produk yang sudah terdistribusi secara acak inilah yang kemudian diserialisasi menjadi teks dan dikirim ke *System Prompt*.

### C. Penyesuaian System Prompt
- Tambahkan instruksi pada *System Prompt* agar AI memberikan variasi rekomendasi.
- **Teks Instruksi Tambahan:** "Saat memberikan rekomendasi, berikan opsi yang bervariasi. Berikan setidaknya satu produk utama yang sangat relevan, dan satu produk alternatif dengan gaya atau kategori yang sedikit berbeda untuk memberikan pilihan kepada pelanggan."

## 3. Kriteria Selesai (Acceptance Criteria)
- AI tidak pernah merekomendasikan produk yang nilai stoknya di *database* adalah 0.
- Jika pengguna meminta rekomendasi umum berkali-kali pada sesi *chat* yang berbeda, AI merekomendasikan variasi produk yang berbeda-beda (karena efek algoritma *shuffle*), membantu mengangkat *sales* produk non-winning.
- Kompilasi TypeScript sukses tanpa *error* terkait tipe data array.