export type VarianProduk = {
  id: string;
  ukuran: string;
  warna: string;
  stok: number;
};

export type Produk = {
  id: string;
  nama: string;
  slug: string;
  kategori: string;
  harga: number;
  hargaCoret?: number;
  foto: string;
  galeri: string[];
  deskripsi: string;
  rating: number;
  jumlahUlasan: number;
  varian: VarianProduk[];
};

export type ItemKeranjang = {
  idProduk: string;
  idVarian: string;
  nama: string;
  foto: string;
  ukuran: string;
  warna: string;
  harga: number;
  jumlah: number;
  stok: number;
};

export type Wilayah = {
  id: string;
  name: string;
};

export type PilihanOngkir = {
  ekspedisi: string;
  layanan: string;
  biaya: number;
  estimasi: string;
};
