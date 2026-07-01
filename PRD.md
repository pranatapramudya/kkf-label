# Update PRD: Investigasi & Perbaikan Bug API Upload Bukti (Error 500)

## 1. Gejala dan Analisis Masalah Saat Ini
- **Kondisi:** Saat pembeli mengunggah bukti transfer manual, server mengembalikan status 500 (Internal Server Error).
- **Fakta Penting:** Pesanan (Order) tetap masuk dan terlihat di Dashboard Admin dengan status `MENUNGGU_PEMBAYARAN`. 
- **Kesimpulan:** Alur `checkout` di `/api/payment` berjalan sempurna. Kerusakan murni terisolasi pada _endpoint_ `/api/upload-bukti/route.ts` yang bertugas memperbarui (update) baris pesanan tersebut.

## 2. Area Audit Utama untuk AI Agent
Endpoint `/api/upload-bukti/route.ts` harus diaudit pada tiga titik rawan ini:
1. **Ekstraksi FormData:** Di Next.js App Router, pemrosesan berkas (File) dari `request.formData()` sering menyebabkan _crash_ jika tidak di- _parse_ menjadi `Buffer` atau `ArrayBuffer` sebelum dikirim ke Supabase.
2. **Koneksi Supabase Storage:** Pastikan pemanggilan `supabase.storage.from('bukti-transfer').upload()` menggunakan variabel lingkungan (_environment variables_) yang valid (`NEXT_PUBLIC_SUPABASE_URL` dan anon/service key).
3. **Kueri Prisma (Database Update):** Pastikan parameter pencarian (`where`) saat melakukan `prisma.order.update` menggunakan kolom yang tepat. Seringkali *frontend* mengirim `invoice` (contoh: KKF-12345), namun Prisma mencari berdasarkan `id` (integer/UUID), sehingga menyebabkan _crash_ di sisi ORM.

## 3. Ekspektasi Output
- API harus membungkus seluruh proses dengan blok `try-catch`.
- API harus memberikan balasan `json` berisi pesan *error* spesifik (tidak hanya kode 500) agar mempermudah _debugging_ lanjutan.