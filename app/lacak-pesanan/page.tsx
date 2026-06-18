"use client";

import { useState } from "react";
import {
  Search,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  Loader2,
  AlertTriangle,
  Receipt,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";

export default function LacakPesananPage() {
  const [kodeInvoice, setKodeInvoice] = useState("");
  const [sedangMencari, setSedangMencari] = useState(false);
  const [errorPesan, setErrorPesan] = useState("");

  const [hasilDB, setHasilDB] = useState<any>(null);
  const [hasilLacak, setHasilLacak] = useState<any>(null);

  const lacakSekarang = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kodeInvoice) return;

    setSedangMencari(true);
    setErrorPesan("");
    setHasilDB(null);
    setHasilLacak(null);

    try {
      const respons = await fetch("/api/lacak", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kodeInvoice }),
      });

      const data = await respons.json();

      if (!respons.ok) {
        throw new Error(data.pesan || "Gagal melacak pesanan.");
      }

      setHasilDB(data.pesan);
      setHasilLacak(data.lacak);
    } catch (galat: any) {
      setErrorPesan(galat.message);
    } finally {
      setSedangMencari(false);
    }
  };

  return (
    <div className="min-h-screen bg-pink-50/30 py-10 px-4 md:px-8 font-sans text-zinc-900 pb-32">
      <div className="max-w-3xl mx-auto">
        {/* HEADER & FORM PENCARIAN */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-soft-pink-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-soft-pink-600 shadow-sm border border-pink-50">
            <Search size={32} />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 tracking-tight">
            Lacak Pesanan
          </h1>
          <p className="text-zinc-500 mt-2">
            Pantau status pesanan dan posisi paketmu saat ini.
          </p>
        </div>

        <form
          onSubmit={lacakSekarang}
          className="bg-white p-2 pl-4 md:pl-6 rounded-full shadow-md border border-pink-100 flex items-center gap-3 animate-in fade-in zoom-in-95 duration-500 delay-100 mb-8 focus-within:ring-2 ring-soft-pink-200 transition-all"
        >
          <Receipt size={20} className="text-zinc-400 shrink-0" />
          <input
            type="text"
            required
            value={kodeInvoice}
            onChange={(e) => setKodeInvoice(e.target.value)}
            placeholder="CONTOH: KKF-24061901"
            className="flex-1 bg-transparent py-3 md:py-4 outline-none text-zinc-900 font-bold placeholder:font-normal placeholder:text-zinc-400 uppercase"
          />
          <button
            type="submit"
            disabled={sedangMencari || !kodeInvoice}
            className="bg-soft-pink-600 hover:bg-soft-pink-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-full transition shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {sedangMencari ? (
              <Loader2 size={18} className="animate-spin" />
            ) : null}
            <span className="hidden md:inline">
              {sedangMencari ? "Mencari..." : "Lacak Paket"}
            </span>
            <span className="md:hidden">{sedangMencari ? "..." : "Lacak"}</span>
          </button>
        </form>

        {errorPesan && (
          <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 font-medium animate-in fade-in duration-300 shadow-sm">
            <AlertTriangle size={20} className="shrink-0" />
            <p>{errorPesan}</p>
          </div>
        )}

        {/* HASIL PENCARIAN */}
        {hasilDB && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 fade-in">
            {/* KARTU INFO INVOICE */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-pink-50 pb-5 mb-5">
                <div>
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Nomor Invoice
                  </p>
                  <h3 className="text-xl font-black text-zinc-900">
                    {hasilDB.kodePesanan}
                  </h3>
                </div>
                <div className="text-left md:text-right">
                  <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Status Pembayaran
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-lg text-xs font-bold uppercase ${
                      hasilDB.statusPesanan === "DIBAYAR" ||
                      hasilDB.statusPesanan === "SELESAI"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {hasilDB.statusPesanan}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500 mb-1">Penerima</p>
                  <p className="font-bold text-zinc-900 line-clamp-1">
                    {hasilDB.namaPenerima}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Total Belanja</p>
                  <p className="font-bold text-soft-pink-600">
                    {formatRupiah(hasilDB.total)}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Ekspedisi</p>
                  <p className="font-bold text-zinc-900 uppercase">
                    {hasilDB.ekspedisi || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 mb-1">Nomor Resi</p>
                  <p className="font-bold text-zinc-900">
                    {hasilDB.nomorResi || "Belum diinput admin"}
                  </p>
                </div>
              </div>
            </div>

            {/* KARTU TIMELINE LACAK RESI */}
            <div className="bg-white p-6 md:p-8 rounded-3xl border border-pink-100 shadow-sm relative overflow-hidden">
              <h3 className="text-lg font-bold text-zinc-900 mb-6 flex items-center gap-2">
                <Truck size={20} className="text-soft-pink-500" /> Status
                Pengiriman
              </h3>

              {!hasilDB.nomorResi ? (
                <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <Package size={40} className="mx-auto text-zinc-300 mb-3" />
                  <p className="text-zinc-600 font-medium">
                    Pesanan sedang diproses oleh admin KKF.
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Resi pengiriman belum tersedia.
                  </p>
                </div>
              ) : hasilLacak?.riwayat?.length > 0 ? (
                <div className="relative pl-2 md:pl-4">
                  {/* Garis vertikal timeline */}
                  <div className="absolute left-[15px] md:left-[23px] top-2 bottom-2 w-0.5 bg-pink-100"></div>

                  <div className="space-y-6 relative">
                    {hasilLacak.riwayat.map((item: any, index: number) => {
                      const isLatest = index === 0; // Data dari API biasanya dibalik, index 0 itu terbaru
                      const isDelivered =
                        item.manifest_code === "DELIVERED" ||
                        hasilLacak.status === "DELIVERED";

                      return (
                        <div
                          key={index}
                          className="flex gap-4 md:gap-6 relative z-10"
                        >
                          {/* Ikon Lingkaran */}
                          <div
                            className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${
                              isLatest && isDelivered
                                ? "bg-emerald-500 text-white"
                                : isLatest
                                  ? "bg-soft-pink-500 text-white"
                                  : "bg-zinc-200 text-zinc-500"
                            }`}
                          >
                            {isLatest && isDelivered ? (
                              <CheckCircle size={16} />
                            ) : isLatest ? (
                              <Truck size={16} />
                            ) : (
                              <MapPin size={16} />
                            )}
                          </div>

                          {/* Teks Deskripsi */}
                          <div
                            className={`flex-1 pt-1 ${isLatest ? "opacity-100" : "opacity-60"}`}
                          >
                            <p
                              className={`text-sm md:text-base font-bold ${isLatest ? "text-soft-pink-600" : "text-zinc-700"}`}
                            >
                              {item.manifest_description}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500 font-medium">
                              <span>{item.manifest_date}</span>
                              <span className="w-1 h-1 rounded-full bg-zinc-300"></span>
                              <span>{item.manifest_time}</span>
                            </div>
                            {item.city_name && (
                              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                                <MapPin size={12} /> {item.city_name}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <AlertTriangle
                    size={40}
                    className="mx-auto text-amber-300 mb-3"
                  />
                  <p className="text-zinc-600 font-medium">
                    Resi {hasilDB.nomorResi} belum bisa dilacak.
                  </p>
                  <p className="text-sm text-zinc-400 mt-1">
                    Biasanya butuh 1x24 jam setelah paket diserahkan ke kurir.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
