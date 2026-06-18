import type { Produk } from "@/types/produk";

export const kategoriPilihan = ["Semua", "Dress", "Blouse", "Outer", "Setelan"];

export const produkContoh: Produk[] = [
  {
    id: "aurora-midi-dress",
    nama: "Aurora Midi Dress",
    slug: "aurora-midi-dress",
    kategori: "Dress",
    harga: 289000,
    hargaCoret: 349000,
    foto: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
    galeri: [
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80"
    ],
    deskripsi:
      "Dress midi ringan dengan siluet feminin, cocok untuk acara santai, brunch, atau semi-formal.",
    rating: 4.9,
    jumlahUlasan: 128,
    varian: [
      { id: "aurora-s-pink", ukuran: "S", warna: "Soft Pink", stok: 12 },
      { id: "aurora-m-cream", ukuran: "M", warna: "Cream", stok: 9 },
      { id: "aurora-l-rose", ukuran: "L", warna: "Dusty Rose", stok: 6 }
    ]
  },
  {
    id: "luna-satin-blouse",
    nama: "Luna Satin Blouse",
    slug: "luna-satin-blouse",
    kategori: "Blouse",
    harga: 199000,
    foto: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
    galeri: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=900&q=80"
    ],
    deskripsi:
      "Blouse satin lembut dengan finishing clean, mudah dipadukan untuk gaya kantor maupun harian.",
    rating: 4.8,
    jumlahUlasan: 96,
    varian: [
      { id: "luna-s-white", ukuran: "S", warna: "Putih", stok: 15 },
      { id: "luna-m-pink", ukuran: "M", warna: "Blush Pink", stok: 13 },
      { id: "luna-l-mauve", ukuran: "L", warna: "Mauve", stok: 5 }
    ]
  },
  {
    id: "serena-knit-outer",
    nama: "Serena Knit Outer",
    slug: "serena-knit-outer",
    kategori: "Outer",
    harga: 259000,
    foto: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
    galeri: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80"
    ],
    deskripsi:
      "Outer knit bernuansa minimalis dengan tekstur nyaman untuk layering sepanjang hari.",
    rating: 4.7,
    jumlahUlasan: 73,
    varian: [
      { id: "serena-all-rose", ukuran: "All Size", warna: "Rose Beige", stok: 18 },
      { id: "serena-all-ivory", ukuran: "All Size", warna: "Ivory", stok: 11 }
    ]
  },
  {
    id: "nara-easy-set",
    nama: "Nara Easy Set",
    slug: "nara-easy-set",
    kategori: "Setelan",
    harga: 329000,
    foto: "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
    galeri: [
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?auto=format&fit=crop&w=900&q=80",
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=80"
    ],
    deskripsi:
      "Setelan effortless dengan potongan rapi, dirancang untuk mobilitas tinggi tanpa kehilangan kesan manis.",
    rating: 4.9,
    jumlahUlasan: 141,
    varian: [
      { id: "nara-s-pink", ukuran: "S", warna: "Pink Mist", stok: 8 },
      { id: "nara-m-latte", ukuran: "M", warna: "Latte", stok: 10 },
      { id: "nara-l-black", ukuran: "L", warna: "Hitam", stok: 7 }
    ]
  }
];
