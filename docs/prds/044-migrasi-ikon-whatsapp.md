# PRD 044: Refactoring UI/UX - Migrasi Floating Action Button (FAB) ke WhatsApp

## 1. Konteks & Tujuan
Berdasarkan evaluasi antarmuka pengguna (UI) pada tampilan mobile, terdapat *Floating Action Button* (FAB) di sudut kanan bawah yang saat ini menggunakan ikon robot (AI Chat/Bot). Untuk meningkatkan rasio konversi dan memberikan opsi komunikasi yang lebih familiar bagi pelanggan di Indonesia, ikon ini perlu diganti menjadi ikon WhatsApp.
Tujuan PRD ini adalah menginstruksikan AI Agent untuk melacak komponen FAB tersebut dan mengganti *asset* visualnya menggunakan fail gambar WhatsApp yang sudah tersedia di direktori lokal proyek.

## 2. Instruksi Eksekusi Frontend
AI Agent wajib melakukan penyesuaian pada komponen UI terkait dengan langkah-langkah berikut:

### A. Pelacakan Komponen FAB
- Telusuri struktur komponen global yang merender tombol melayang di sudut kanan bawah. Komponen ini kemungkinan berada di file `app/layout.tsx`, `app/(main)/layout.tsx`, atau merupakan komponen terpisah seperti `FloatingButton.tsx` atau `ChatWidget.tsx`.
- Identifikasi elemen tombol atau tautan yang memiliki *styling* posisi *fixed* di kanan bawah (biasanya menggunakan kelas *utility* Tailwind seperti `fixed bottom-... right-...`).

### B. Migrasi Asset Visual (Ikon)
- Hapus implementasi ikon robot yang saat ini digunakan (baik itu berasal dari *library* seperti `lucide-react`, `react-icons`, ataupun SVG *inline*).
- Gantikan ikon tersebut dengan elemen gambar yang memanggil aset dari direktori publik. Gunakan komponen `<Image />` bawaan Next.js atau tag `<img>` standar.
- Arahkan properti sumber daya (`src`) ke *path*: `/icons/whatsapp.png`.
- Pastikan gambar diberikan kelas penataan ukuran yang proporsional agar posisinya pas di tengah lingkaran tombol (misalnya mengatur lebar dan tinggi secara spesifik, serta menggunakan `object-contain`).

### C. Penyesuaian Interaksi & Tema WhatsApp
- Sesuaikan warna latar belakang (*background*) pada lingkaran tombol tersebut agar selaras dengan warna hijau identitas merek WhatsApp (hex: `#25D366`), jika warna hijau yang sekarang dirasa belum pas.
- Pastikan komponen tersebut dibungkus dengan tag *anchor* (`<a>` atau `<Link>`) yang *href*-nya mengarah ke tautan API WhatsApp (`https://wa.me/...`) agar tombol tersebut fungsional ketika diklik.

## 3. Kriteria Selesai (Acceptance Criteria)
- Ikon robot pada pojok kanan bawah berhasil dihapus dan digantikan dengan ikon `whatsapp.png`.
- Penempatan gambar proporsional, tidak terpotong, dan berada tepat di tengah lingkaran (secara vertikal dan horizontal).
- Perubahan komponen tidak menyebabkan *error* hidrasi (hydration error) pada Next.js di sisi klien.