"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { hapusProduk, pulihkanProduk } from "./actions";
import {
  Loader2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Edit2,
  RotateCcw,
} from "lucide-react";

export default function TabelProduk({ dataProduk }: { dataProduk: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Reset halaman saat dataProduk berubah (karena filter)
  useEffect(() => {
    setCurrentPage(1);
  }, [dataProduk]);

  const totalPages = Math.ceil(dataProduk.length / itemsPerPage);
  const produkTampil = dataProduk.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // STATE MODAL MODERN
  const [modalHapus, setModalHapus] = useState({
    terbuka: false,
    id: "",
    nama: "",
  });
  const [notifikasi, setNotifikasi] = useState({
    terbuka: false,
    pesan: "",
    tipe: "sukses",
  });
  const [sedangMenghapus, setSedangMenghapus] = useState(false);
  const [sedangMemulihkan, setSedangMemulihkan] = useState<string | null>(null);

  const eksekusiPulihkan = async (id: string) => {
    setSedangMemulihkan(id);
    const respon = await pulihkanProduk(id);
    setSedangMemulihkan(null);

    if (respon.sukses) {
      setNotifikasi({ terbuka: true, pesan: respon.pesan, tipe: "sukses" });
    } else {
      setNotifikasi({ terbuka: true, pesan: respon.pesan, tipe: "gagal" });
    }

    setTimeout(() => {
      setNotifikasi((prev) => ({ ...prev, terbuka: false }));
    }, 3000);
  };

  const picuHapus = (id: string, nama: string) => {
    setModalHapus({ terbuka: true, id, nama });
  };

  const eksekusiHapus = async () => {
    setSedangMenghapus(true);
    const respon = await hapusProduk(modalHapus.id);
    setSedangMenghapus(false);
    setModalHapus({ terbuka: false, id: "", nama: "" });

    if (respon.sukses) {
      setNotifikasi({ terbuka: true, pesan: respon.pesan, tipe: "sukses" });
    } else {
      setNotifikasi({ terbuka: true, pesan: respon.pesan, tipe: "gagal" });
    }

    setTimeout(() => {
      setNotifikasi((prev) => ({ ...prev, terbuka: false }));
    }, 3000);
  };

  return (
    <div className="bg-white border border-pink-100 rounded-2xl overflow-hidden relative shadow-sm">
      {/* =========================================
          VIEW 1: TAMPILAN MOBILE (KARTU) PERBAIKAN PRESISI
      ========================================= */}
      <div className="md:hidden flex flex-col gap-4 p-4 bg-zinc-50/50">
        {produkTampil.length === 0 ? (
          <div className="p-8 text-center text-zinc-400 italic bg-white rounded-xl border border-pink-50">
            Belum ada produk di database.
          </div>
        ) : (
          produkTampil.map((item) => (
            <div
              key={item.id}
              className={`bg-white border border-pink-100 rounded-2xl p-5 shadow-sm flex flex-col gap-5 relative ${item.isArchived ? "opacity-60 grayscale-[50%]" : ""}`}
            >
              {/* Pita Arsip (Kiri Atas) */}
              {item.isArchived && (
                <div className="absolute top-0 left-0 bg-zinc-600 text-white text-[10px] font-bold px-3 py-1 rounded-tl-xl rounded-br-xl shadow-sm z-10">
                  DIARSIPKAN
                </div>
              )}
              {/* Pita Diskon (Lebih Rapi di Pojok) */}
              {item.diskonPersen > 0 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl rounded-tr-xl shadow-sm">
                  {item.diskonPersen}% OFF
                </div>
              )}

              {/* Header Kartu: Judul & Deskripsi */}
              <div className="pr-10">
                <h3 className="font-bold text-zinc-900 text-base leading-tight line-clamp-2">
                  {item.nama}
                </h3>
                <p className="text-xs text-zinc-400 mt-1 line-clamp-1">
                  {item.deskripsi || "Tanpa deskripsi"}
                </p>
              </div>

              {/* Info Box: Harga & Stok (Lebih Lega) */}
              <div className="flex flex-wrap justify-between items-center gap-3 bg-zinc-50 p-3.5 rounded-xl border border-zinc-100">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Harga
                  </p>
                  <p className="font-bold text-zinc-900 text-sm">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1">
                    Stok & Kategori
                  </p>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <span className="font-bold text-emerald-600 text-sm">
                      {item.varian?.reduce(
                        (tot: number, v: any) => tot + v.stok,
                        0,
                      ) ?? 0}{" "}
                      Pcs
                    </span>
                    <span className="bg-pink-100 text-soft-pink-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase whitespace-nowrap">
                      {item.kategori?.nama || "Umum"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tombol Aksi Mobile */}
              <div className="flex gap-3">
                {item.isArchived ? (
                  <button
                    onClick={() => eksekusiPulihkan(item.id)}
                    disabled={sedangMemulihkan === item.id}
                    className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100"
                  >
                    {sedangMemulihkan === item.id ? <Loader2 size={16} className="animate-spin" /> : <RotateCcw size={16} />}
                    {sedangMemulihkan === item.id ? "Memulihkan..." : "Pulihkan"}
                  </button>
                ) : (
                  <>
                    <Link
                      href={`/admin/produk/edit/${item.id}`}
                      className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all border border-amber-100"
                    >
                      <Edit2 size={16} /> Edit
                    </Link>
                    <button
                      onClick={() => picuHapus(item.id, item.nama)}
                      className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100"
                    >
                      <Trash2 size={16} /> Hapus
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* =========================================
          VIEW 2: TAMPILAN PC/DESKTOP (TABEL)
          Hanya muncul di layar Lebar (hidden md:block)
      ========================================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-zinc-50/80 border-b border-pink-100 text-zinc-400 uppercase text-xs font-bold tracking-wider">
            <tr>
              <th className="p-4">Info Produk</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Harga</th>
              <th className="p-4">Diskon</th>
              <th className="p-4">Stok Varian</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50">
            {produkTampil.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-8 text-center text-zinc-400 italic"
                >
                  Belum ada produk di database.
                </td>
              </tr>
            ) : (
              produkTampil.map((item) => (
                <tr
                  key={item.id}
                  className={`transition-colors ${item.isArchived ? "bg-zinc-50/50 opacity-60" : "hover:bg-pink-50/20"}`}
                >
                  <td className="p-4 relative">
                    {item.isArchived && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-3/4 bg-zinc-400 rounded-r-md"></span>
                    )}
                    <div className="font-semibold text-zinc-900 flex items-center gap-2">
                      {item.nama}
                      {item.isArchived && (
                        <span className="bg-zinc-200 text-zinc-600 text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider">ARSIP</span>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 truncate max-w-[180px]">
                      {item.deskripsi || "Tanpa deskripsi"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-pink-50 text-soft-pink-700 px-2.5 py-1 rounded-lg text-xs font-bold">
                      {item.kategori?.nama || "Umum"}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-zinc-800">
                    Rp {item.harga.toLocaleString("id-ID")}
                  </td>
                  <td className="p-4">
                    {item.diskonPersen > 0 ? (
                      <span className="bg-red-50 text-red-600 border border-red-100 px-2 py-0.5 rounded-md text-xs font-bold">
                        {item.diskonPersen}% OFF
                      </span>
                    ) : (
                      <span className="text-zinc-300 text-xs">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-100">
                      {item.varian?.reduce(
                        (tot: number, v: any) => tot + v.stok,
                        0,
                      ) ?? 0}{" "}
                      Pcs
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    {item.isArchived ? (
                      <button
                        onClick={() => eksekusiPulihkan(item.id)}
                        disabled={sedangMemulihkan === item.id}
                        className="px-3 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all border border-emerald-100 flex items-center gap-1"
                      >
                        {sedangMemulihkan === item.id ? <Loader2 size={14} className="animate-spin" /> : <RotateCcw size={14} />} Pulihkan
                      </button>
                    ) : (
                      <>
                        <Link
                          href={`/admin/produk/edit/${item.id}`}
                          className="px-3 py-1.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl text-xs font-bold transition-all border border-amber-100"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => picuHapus(item.id, item.nama)}
                          className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-xl text-xs font-bold transition-all border border-red-100"
                        >
                          Hapus
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================
          NAVIGASI PAGINASI (GLOBAL)
      ========================================= */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-pink-50 flex items-center justify-between bg-zinc-50/50">
          <span className="text-sm text-zinc-500 font-medium">
            Halaman {currentPage} dari {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Sebelumnya
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}

      {/* === MODAL CONFIRMATION DIALOG === */}
      {modalHapus.terbuka && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-zinc-950/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-pink-50 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-red-500 mb-3">
              <div className="p-2 bg-red-50 rounded-full">
                <AlertTriangle size={22} />
              </div>
              <h3 className="text-lg font-bold text-zinc-900">Hapus Produk?</h3>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed">
              Apakah lu yakin ingin menghapus produk{" "}
              <span className="font-bold text-zinc-800">
                "{modalHapus.nama}"
              </span>
              ? Tindakan ini permanen dari Supabase.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-end gap-2.5">
              <button
                disabled={sedangMenghapus}
                onClick={() =>
                  setModalHapus({ terbuka: false, id: "", nama: "" })
                }
                className="w-full sm:w-auto px-4 py-2.5 bg-zinc-50 hover:bg-zinc-100 rounded-xl text-sm font-bold text-zinc-600 transition"
              >
                Batal
              </button>
              <button
                disabled={sedangMenghapus}
                onClick={eksekusiHapus}
                className="w-full sm:w-auto px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold shadow-sm transition flex items-center justify-center gap-2"
              >
                {sedangMenghapus ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : null}
                {sedangMenghapus ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* === TOAST FLOATING NOTIFICATION === */}
      {notifikasi.terbuka && (
        <div className="fixed bottom-5 right-5 left-5 sm:left-auto z-[999] bg-zinc-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-zinc-800 animate-in slide-in-from-bottom-5 duration-300">
          <CheckCircle
            size={18}
            className={
              notifikasi.tipe === "sukses" ? "text-emerald-400" : "text-red-400"
            }
          />
          <p className="text-xs font-bold tracking-wide">{notifikasi.pesan}</p>
        </div>
      )}
    </div>
  );
}
