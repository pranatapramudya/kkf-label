# PRD: Prisma Schema Alignment & Build Fix (v52.0)

## 1. Objective
Menyelesaikan *type error* pada saat *build* di Vercel akibat ketidaksesuaian antara nama kolom pada kode `route.ts` dengan skema `prisma.schema`.

## 2. Scope of Work
- **Schema Verification:** Melakukan sinkronisasi antara objek `data` di Prisma `update` dengan model `Pesanan` di `prisma/schema.prisma`.
- **Typo Correction:** Memastikan tidak ada kolom imajiner (seperti `statusTransaksi` jika tidak didefinisikan di skema).
- **Type Casting:** Memastikan penggunaan `as any` diminimalisir atau diganti dengan *Type Assertion* yang benar sesuai Enum/Tipe data di Prisma.

## 3. Strict Guidelines
- **No Imaginary Columns:** Dilarang menambah field di kode `prisma.update` jika belum terdaftar di `schema.prisma`.
- **Force Re-sync:** Jika kolom memang diperlukan (seperti untuk status Midtrans), wajib menambahkan field tersebut ke `schema.prisma` terlebih dahulu.