"use client";

import { useState } from "react";
import {
  ShoppingBag,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useKeranjang } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export function FormTambahKeranjang({ produk }: { produk: any }) {
  const { tambahItem } = useKeranjang();
  const router = useRouter();

  const [varianAktif, setVarianAktif] = useState<any>(
    produk.varian?.length > 0 ? produk.varian[0] : null,
  );
  const [jumlah, setJumlah] = useState(1);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    tipe: "sukses",
  });

  const maxStok = varianAktif ? varianAktif.stok : produk.stokTotal || 1;

  const kurangJumlah = () => setJumlah((prev) => Math.max(1, prev - 1));
  const tambahJumlah = () => setJumlah((prev) => Math.min(maxStok, prev + 1));

  const showNotif = (msg: string, tipe: "sukses" | "gagal" = "sukses") => {
    setToast({ show: true, message: msg, tipe });
    setTimeout(
      () => setToast({ show: false, message: "", tipe: "sukses" }),
      3000,
    );
  };

  const getHargaFinal = () => {
    const hargaAsli = Number(produk.harga) || 0;
    const diskon = Number(produk.diskonPersen) || 0;
    if (diskon > 0) return hargaAsli - hargaAsli * (diskon / 100);
    return hargaAsli;
  };

  // KUNCI DISKON: 'hargaCoret' gw masukin ke sini biar kebaca di Checkout!
  const getPayloadKeranjang = () => {
    return {
      idVarian: varianAktif?.id || produk.id,
      idProduk: produk.id,
      nama: produk.nama,
      foto:
        produk.fotoUtama && produk.fotoUtama.trim() !== ""
          ? produk.fotoUtama
          : "/logo-kkf.jpeg",
      ukuran: varianAktif?.ukuran || "",
      warna: varianAktif?.warna || "",
      harga: getHargaFinal(),
      hargaCoret: Number(produk.harga) || 0, // <--- INI NYAWANYA!
      jumlah: Number(jumlah) || 1,
      stok: varianAktif ? varianAktif.stok : produk.stokTotal || 1,
    };
  };

  const handleTambahKeranjang = () => {
    if (!varianAktif && produk.varian?.length > 0)
      return showNotif("Pilih varian dulu kak!", "gagal");

    tambahItem(getPayloadKeranjang());
    showNotif("Berhasil ditambahkan ke keranjang!", "sukses");
  };

  const handleBeliSekarang = () => {
    if (!varianAktif && produk.varian?.length > 0)
      return showNotif("Pilih varian dulu kak!", "gagal");

    tambahItem(getPayloadKeranjang());
    router.push("/checkout");
  };

  return (
    <div className="mt-6 relative">
      {/* Toast dibikin max-w biar nggak bikin layar bocor horizontal */}
      {toast.show && (
        <div className="fixed top-20 right-4 max-w-[90vw] z-[99999] bg-zinc-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-5 duration-300">
          {toast.tipe === "sukses" ? (
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle size={18} className="text-amber-400 shrink-0" />
          )}
          <p className="text-xs font-bold tracking-wide">{toast.message}</p>
        </div>
      )}

      {produk.varian && produk.varian.length > 0 && (
        <div className="mb-5">
          <p className="text-sm font-bold text-zinc-900 mb-3">Pilih varian</p>
          <div className="flex flex-col gap-2">
            {produk.varian.map((v: any) => (
              <button
                key={v.id}
                onClick={() => {
                  setVarianAktif(v);
                  setJumlah(1);
                }}
                className={`px-4 py-3 text-sm rounded-xl border flex justify-between items-center w-full transition-all ${
                  varianAktif?.id === v.id
                    ? "border-soft-pink-500 bg-soft-pink-50/50 text-soft-pink-700 font-bold"
                    : "border-zinc-200 text-zinc-600 hover:border-soft-pink-300 hover:bg-zinc-50"
                }`}
              >
                <span>
                  {v.ukuran} &middot; {v.warna}
                </span>
                <span className="text-xs font-normal opacity-70">
                  Stok {v.stok}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-bold text-zinc-900 mb-3">Jumlah</p>
        <div className="flex items-center gap-4 w-fit border border-zinc-200 rounded-full px-4 py-2">
          <button
            onClick={kurangJumlah}
            disabled={jumlah <= 1}
            className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg leading-none outline-none"
          >
            &minus;
          </button>
          <span className="text-sm font-bold text-zinc-900 w-6 text-center">
            {jumlah}
          </span>
          <button
            onClick={tambahJumlah}
            disabled={jumlah >= maxStok}
            className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg leading-none outline-none"
          >
            +
          </button>
        </div>
      </div>

      <div className="hidden md:flex gap-3">
        <button
          onClick={handleTambahKeranjang}
          className="flex-1 bg-soft-pink-100 text-soft-pink-600 font-bold py-3.5 rounded-xl hover:bg-soft-pink-200 transition flex items-center justify-center gap-2"
        >
          <ShoppingBag size={18} /> Tambah ke Keranjang
        </button>
        <button
          onClick={handleBeliSekarang}
          className="flex-1 bg-soft-pink-600 text-white font-bold py-3.5 rounded-xl hover:bg-soft-pink-700 transition shadow-md"
        >
          Beli Sekarang
        </button>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-3 px-4 flex items-center gap-3 z-[9999] pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <button className="flex flex-col items-center justify-center text-zinc-500 hover:text-soft-pink-600 px-1 transition-colors">
          <MessageCircle size={22} />
          <span className="text-[9px] font-bold mt-1">Chat</span>
        </button>
        <button
          onClick={handleTambahKeranjang}
          className="flex-1 bg-soft-pink-100 text-soft-pink-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors active:bg-soft-pink-200 shadow-sm border border-pink-200"
        >
          <ShoppingBag size={18} /> Keranjang
        </button>
        <button
          onClick={handleBeliSekarang}
          className="flex-1 bg-soft-pink-600 text-white font-bold py-3 rounded-xl shadow-md transition-colors active:bg-soft-pink-700"
        >
          Beli Sekarang
        </button>
      </div>
    </div>
  );
}
