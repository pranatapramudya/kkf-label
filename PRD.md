# PRD: Scalable Analytics Pagination (v42.0)

## 1. Objective
Menerapkan sistem *pagination* (3 data per halaman) pada *Horizontal Bar Chart* untuk menjaga densitas visual yang konsisten dan *clean*, terlepas dari berapa banyak produk yang ada.

## 2. Scope of Work
- **Pagination State:** Mengimplementasikan `useState` untuk melacak `currentPage`.
- **Data Slicing:** Membuat fungsi kalkulasi untuk memotong array data (misal: `data.slice(page * 3, page * 3 + 3)`).
- **Navigation Controls:** Menambahkan tombol navigasi (Prev/Next) yang minimalis dan *user-friendly* tepat di bawah *chart*.
- **State Guardrails:** Tombol "Prev" harus di- `disabled` jika `currentPage === 0`, dan tombol "Next" di- `disabled` jika `(currentPage + 1) * 3 >= data.length`.

## 3. Strict Guidelines
- **Responsive Navigation:** Tombol navigasi harus terlihat jelas tapi tidak mengganggu *layout* utama. Gunakan ikon (Chevron) untuk menghemat ruang.
- **Smooth Transition:** Tidak perlu animasi kompleks, cukup *re-render* data yang konsisten saat halaman berpindah.