"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Package,
  Truck,
  Star,
  User,
  LogOut,
  ShoppingBag,
  Loader2,
  CheckCircle,
  ChevronRight,
  X,
  AlertTriangle,
  Search,
  MapPin,
  Clock,
  Copy,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import ColorBadge from "@/components/ColorBadge";

export default function HalamanAkunSaya() {
  const router = useRouter();

  const [kontak, setKontak] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [dataPesanan, setDataPesanan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabAktif, setTabAktif] = useState("semua");

  // State Notif Modern
  const [toast, setToast] = useState({
    show: false,
    message: "",
    tipe: "sukses",
  });

  const showNotif = (msg: string, tipe: "sukses" | "gagal" = "sukses") => {
    setToast({ show: true, message: msg, tipe });
    setTimeout(
      () => setToast({ show: false, message: "", tipe: "sukses" }),
      2500,
    );
  };

  // State Modal Ulasan
  const [modalUlasan, setModalUlasan] = useState(false);
  const [itemUlasan, setItemUlasan] = useState<any>(null);
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState("");
  const [sedangKirim, setSedangKirim] = useState(false);

  // State Modal Konfirmasi Pesanan Diterima
  const [modalKonfirm, setModalKonfirm] = useState<string | null>(null);
  const [sedangKonfirm, setSedangKonfirm] = useState(false);

  // State Lacak dihapus (dipindah ke halaman Lacak Pesanan)

  // State untuk Copy Order ID
  const [copiedOrderId, setCopiedOrderId] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedOrderId(text);
    showNotif("Order ID disalin!", "sukses");
    setTimeout(() => setCopiedOrderId(null), 2000);
  };

  useEffect(() => {
    const kontakTersimpan = localStorage.getItem("kkf_user_kontak");
    if (kontakTersimpan) {
      setKontak(kontakTersimpan);
      setIsLogin(true);
      tarikDataPesanan(kontakTersimpan);
    } else {
      setLoading(false);
    }
  }, []);

  const tarikDataPesanan = async (infoKontak: string) => {
    setLoading(true);
    try {
      const kontakBersih = infoKontak.trim();
      const res = await fetch(`/api/pesanan/user?kontak=${encodeURIComponent(kontakBersih)}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        console.log("[Pesanan Saya] Fetch berhasil:", data.length, "pesanan");
        setDataPesanan(data);
      } else {
        console.error("[Pesanan Saya] Fetch gagal, status:", res.status);
        setDataPesanan([]);
      }
    } catch (e) {
      console.error("[Pesanan Saya] Network error:", e);
      setDataPesanan([]);
    } finally {
      setLoading(false);
    }
  };

  const simpanKontak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kontak) return;
    localStorage.setItem("kkf_user_kontak", kontak);
    setIsLogin(true);
    tarikDataPesanan(kontak);
  };

  const logout = () => {
    localStorage.removeItem("kkf_user_kontak");
    setKontak("");
    setIsLogin(false);
    setDataPesanan([]);
  };

  const eksekusiPesananDiterima = async () => {
    if (!modalKonfirm) return;
    setSedangKonfirm(true);
    try {
      await fetch("/api/pesanan/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idPesanan: modalKonfirm, status: "SELESAI" }),
      });
      tarikDataPesanan(kontak);
      setTabAktif("ulasan");
      showNotif("Pesanan berhasil dikonfirmasi!", "sukses");
    } catch (e) {
      showNotif("Gagal mengupdate pesanan", "gagal");
    } finally {
      setSedangKonfirm(false);
      setModalKonfirm(null);
    }
  };

  const bukaBeriUlasan = (item: any, pesanan: any) => {
    setItemUlasan({
      ...item,
      pesananId: pesanan.id,
      namaPenerima: pesanan.namaPenerima,
    });
    setRating(5);
    setKomentar("");
    setModalUlasan(true);
  };

  const kirimUlasan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangKirim(true);
    try {
      const res = await fetch("/api/ulasan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          produkId: itemUlasan.produkId,
          pesananId: itemUlasan.pesananId,
          rating,
          comment: komentar,
          namaGuest: itemUlasan.namaPenerima,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      showNotif("Terima kasih atas ulasanmu! ⭐", "sukses");
      setModalUlasan(false);
    } catch (error: any) {
      showNotif(error.message || "Gagal mengirim ulasan.", "gagal");
    } finally {
      setSedangKirim(false);
    }
  };

  // Fungsi Lacak Paket dipindah ke halaman Lacak Pesanan

  const listBelumBayar = dataPesanan.filter((p) => {
    const s = p.statusPesanan?.toUpperCase() || "";
    return s.includes("MENUNGGU") || s.includes("PENDING");
  });
  const listDikemas = dataPesanan.filter((p) => {
    const s = p.statusPesanan?.toUpperCase() || "";
    return s.includes("PROSES") || s.includes("KEMAS");
  });
  const listDikirim = dataPesanan.filter((p) => {
    const s = p.statusPesanan?.toUpperCase() || "";
    return s.includes("KIRIM");
  });
  const listUlasan = dataPesanan.filter((p) => {
    const s = p.statusPesanan?.toUpperCase() || "";
    return s.includes("SELESAI");
  });

  const pesananTampil =
    tabAktif === "belum_bayar"
      ? listBelumBayar
      : tabAktif === "dikemas"
        ? listDikemas
        : tabAktif === "dikirim"
          ? listDikirim
          : tabAktif === "ulasan"
            ? listUlasan
            : dataPesanan;

  if (!isLogin) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={32} className="text-pink-600" />
        </div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">
          Lacak Pesanan Kamu
        </h2>
        <p className="text-sm text-zinc-500 mb-8 max-w-xs">
          Masukkan Email atau Nomor WhatsApp yang kamu gunakan saat belanja.
        </p>
        <form onSubmit={simpanKontak} className="w-full max-w-xs space-y-4">
          <input
            type="text"
            placeholder="0812xxxx / email@mu.com"
            value={kontak}
            onChange={(e) => setKontak(e.target.value)}
            className="w-full border-b-2 border-zinc-200 py-3 text-center focus:outline-none focus:border-pink-600 font-bold transition"
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-full shadow-md active:scale-95 transition"
          >
            Lihat Pesanan Saya
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24 font-sans text-zinc-900">
      {/* 🔥 SUNTIKAN UI TOAST MODERN 🔥 */}
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999999] bg-zinc-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-200">
          {toast.tipe === "sukses" ? (
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          )}
          <p className="text-xs font-bold tracking-wide whitespace-nowrap">
            {toast.message}
          </p>
        </div>
      )}

      {/* Background Gradien Baru */}
      <div className="absolute top-0 w-full h-72 bg-gradient-to-b from-pink-500/90 to-transparent z-0 pointer-events-none"></div>

      {/* Container Konten (PC Friendly) */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 pt-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="h-16 w-16 shrink-0 bg-white/40 rounded-full flex items-center justify-center border border-white/60 backdrop-blur-sm shadow-inner">
              <User size={32} className="text-rose-950" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="font-semibold text-sm truncate w-full pr-2 text-rose-950">{kontak}</h1>
              <p className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full w-fit mt-1.5 shadow-sm">
                Pelanggan KKF
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="shrink-0 text-rose-900/80 hover:text-rose-950 transition p-2 bg-white/40 rounded-full backdrop-blur-sm"
          >
            <LogOut size={18} />
          </button>
        </div>


        {/* Navigasi Status */}
        <div className="bg-white rounded-2xl shadow-md border border-pink-50 p-4 mb-5">
          <div className="flex items-center justify-between border-b border-pink-50 pb-3 mb-4">
            <h2 className="font-black text-zinc-900 text-sm">Pesanan Saya</h2>
            <button
              onClick={() => setTabAktif("semua")}
              className="text-[10px] font-bold text-zinc-500 flex items-center hover:text-pink-600 transition"
            >
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>

          <div className="flex justify-between items-start px-2">
            {[
              {
                id: "belum_bayar",
                label: "Belum Bayar",
                ikon: CreditCard,
                count: listBelumBayar.length,
              },
              {
                id: "dikemas",
                label: "Dikemas",
                ikon: Package,
                count: listDikemas.length,
              },
              {
                id: "dikirim",
                label: "Dikirim",
                ikon: Truck,
                count: listDikirim.length,
              },
              {
                id: "ulasan",
                label: "Beri Ulasan",
                ikon: Star,
                count: listUlasan.length,
              },
            ].map((menu) => (
              <button
                key={menu.id}
                onClick={() => setTabAktif(menu.id)}
                className={`flex flex-col items-center gap-2 group relative w-[4.5rem] transition-all ${tabAktif === menu.id ? "scale-105" : "opacity-80"}`}
              >
                <div
                  className={`relative ${tabAktif === menu.id ? "text-pink-600" : "text-zinc-600"}`}
                >
                  <menu.ikon
                    size={26}
                    strokeWidth={tabAktif === menu.id ? 2 : 1.5}
                  />
                  {menu.count > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-[18px] min-w-[18px] px-1 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                      {menu.count}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] text-center font-bold leading-tight ${tabAktif === menu.id ? "text-pink-600" : "text-zinc-500"}`}
                >
                  {menu.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* List Pesanan */}
        <div className="w-full overflow-x-auto">
          <div className="flex flex-col md:grid md:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-1 md:col-span-2 flex justify-center py-10">
                <Loader2 className="animate-spin text-pink-500" />
              </div>
          ) : pesananTampil.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-pink-50 shadow-sm">
              <ShoppingBag size={32} className="text-zinc-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-zinc-500">
                Tidak ada pesanan di kategori ini
              </p>
            </div>
          ) : (
            pesananTampil.map((order) => {
              let totalDiskon = 0;
              order.item.forEach((itm: any) => {
                // Tarik harga katalog asli, fallback ke harga beli jika null
                const hargaAsli = itm.produk?.harga || itm.harga; 
                const hargaBeli = itm.harga; // Ini harga yang udah dipotong diskon di DB
                if (hargaAsli > hargaBeli) {
                  totalDiskon += (hargaAsli - hargaBeli) * itm.jumlah;
                }
              });

              return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-pink-100 p-4 animate-in fade-in slide-in-from-bottom-2"
              >
                <div className="flex justify-between items-center border-b border-pink-50 pb-3 mb-3">
                  <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1.5">
                    <ShoppingBag size={14} className="text-zinc-400" />{" "}
                    {order.kodePesanan}
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(order.kodePesanan); }}
                      className="ml-0.5 p-1 hover:bg-zinc-100 rounded text-zinc-400 hover:text-pink-600 transition"
                      title="Salin Order ID"
                    >
                      {copiedOrderId === order.kodePesanan ? <CheckCircle size={12} className="text-emerald-500" /> : <Copy size={12} />}
                    </button>
                  </span>
                  <span
                    className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider ${
                      order.statusPesanan?.toUpperCase() === "SELESAI"
                        ? "bg-emerald-100 text-emerald-700"
                        : order.statusPesanan?.toUpperCase() === "MENUNGGU_PEMBAYARAN" || order.statusPesanan?.toUpperCase() === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-pink-100 text-pink-700"
                    }`}
                  >
                    {order.statusPesanan.replace("_", " ")}
                  </span>
                </div>

                {order.item.map((itm: any, i: number) => (
                  <div key={i} className="flex gap-3 mb-3">
                    <div className="h-20 w-20 bg-zinc-100 rounded-xl overflow-hidden shrink-0 border border-zinc-100 relative shadow-sm">
                      <img
                        src={itm.produk?.fotoUtama || "/logo-kkf.png"}
                        alt={itm.namaProduk}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 py-1">
                      <h3 className="text-xs font-bold text-zinc-900 line-clamp-2 leading-snug">
                        {itm.namaProduk}
                      </h3>
                      <div className="text-[10px] font-medium text-zinc-500 mt-1 flex items-center gap-1">
                        <span>Varian: {itm.ukuran} -</span> <ColorBadge text={itm.warna || ''} />
                      </div>
                      <div className="flex justify-between items-center mt-2.5">
                        <span className="text-[11px] font-bold text-zinc-600">
                          x{itm.jumlah}
                        </span>
                        <div className="flex flex-col items-end">
                          {/* Tampilkan harga coret JIKA harga asli lebih besar dari harga beli */}
                          {(itm.produk?.harga || itm.harga) > itm.harga && (
                            <span className="text-[10px] text-gray-400 line-through">
                              {formatRupiah(itm.produk?.harga || itm.harga)}
                            </span>
                          )}
                          {/* WAJIB nampilin item.harga sebagai harga bayar! */}
                          <span className="text-xs font-black text-pink-600">
                            {formatRupiah(itm.harga)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-dashed border-zinc-200 mt-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] text-zinc-500 font-medium">Ongkos Kirim:</span>
                    <span className="text-[11px] font-bold text-zinc-700">{formatRupiah(order.ongkir || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[11px] text-zinc-500 font-medium">Total Diskon:</span>
                    <span className={`text-[11px] ${totalDiskon > 0 ? "text-red-500 font-medium" : "text-zinc-700 font-bold"}`}>
                      {totalDiskon > 0 ? `- ${formatRupiah(totalDiskon)}` : "-"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-1.5 mt-1.5 border-t border-zinc-100">
                    <span className="text-xs text-zinc-500 font-bold">
                      Total Belanja:
                    </span>
                    <span className="text-sm font-black text-zinc-900">
                      {formatRupiah(order.total)}
                    </span>
                  </div>
                </div>

                {/* 🔥 PERUBAHAN TOMBOL AKSI: Ada tombol Lacak di mode Dikirim 🔥 */}
                <div className="mt-4 flex justify-end gap-2 border-t border-pink-50 pt-4">
                  {(order.statusPesanan === "DIKIRIM" ||
                    order.statusPesanan === "SAMPAI") && (
                    <div className="flex gap-2 w-full justify-end">
                      <button
                        onClick={() => router.push(`/lacak-pesanan?invoice=${order.kodePesanan}`)}
                        className="border border-pink-200 text-pink-600 bg-pink-50 text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-pink-100 transition flex items-center gap-1.5 shadow-sm"
                      >
                        <Search size={14} /> Lacak
                      </button>
                      <button
                        onClick={() => setModalKonfirm(order.id)}
                        className="bg-pink-600 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-sm hover:bg-pink-700 transition"
                      >
                        Diterima
                      </button>
                    </div>
                  )}
                  {order.statusPesanan === "SELESAI" && (
                    <div className="flex gap-2 w-full justify-end">
                      <button
                        onClick={() =>
                          router.push(`/produk/${order.item[0].produkId}`)
                        }
                        className="border border-zinc-300 text-zinc-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-zinc-50 transition"
                      >
                        Beli Lagi
                      </button>
                      <button
                        onClick={() => bukaBeriUlasan(order.item[0], order)}
                        className="bg-pink-50 border border-pink-200 text-pink-600 text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-pink-100 transition shadow-sm"
                      >
                        Nilai Produk
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
            })
          )}
        </div>
        </div>
      </div>

      {/* MODAL ULASAN */}
      {modalUlasan && itemUlasan && (
        <div className="fixed inset-0 z-[99998] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-5 border-b border-zinc-100 pb-3">
              <h3 className="font-black text-zinc-900">Nilai Produk</h3>
              <button
                onClick={() => setModalUlasan(false)}
                className="text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-full p-1.5 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={kirimUlasan} className="space-y-5">
              <div className="flex gap-3 items-center bg-zinc-50 p-3 rounded-2xl border border-zinc-100">
                <img
                  src={itemUlasan.produk?.fotoUtama || "/logo-kkf.png"}
                  className="h-12 w-12 rounded-xl object-cover"
                  alt="Produk"
                />
                <p className="text-xs font-bold text-zinc-700 line-clamp-2 leading-snug">
                  {itemUlasan.namaProduk}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-500 mb-2 text-center">
                  Beri Kualitas Produk
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none transition-transform active:scale-90"
                    >
                      <Star
                        size={36}
                        className={`${rating >= star ? "fill-amber-400 text-amber-400 drop-shadow-sm" : "text-zinc-300"} transition-colors`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-bold text-zinc-600 mb-2">
                  Tulis Ulasanmu
                </p>
                <textarea
                  rows={3}
                  required
                  value={komentar}
                  onChange={(e) => setKomentar(e.target.value)}
                  placeholder="Bagaimana kualitas bahan dan jahitannya?"
                  className="w-full border border-zinc-300 p-3 rounded-2xl focus:outline-none focus:border-pink-500 text-sm resize-none bg-zinc-50/50 focus:bg-white transition"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={sedangKirim}
                className="w-full bg-pink-600 text-white font-bold py-3.5 rounded-2xl shadow-md hover:bg-pink-700 transition flex items-center justify-center disabled:opacity-70"
              >
                {sedangKirim ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Kirim Ulasan Sekarang"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 MODAL KONFIRMASI MODERN (Fix: Udah Dikeluarin dari Ulasan) 🔥 */}
      {modalKonfirm && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-xs p-6 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package size={32} />
            </div>
            <h3 className="font-black text-zinc-900 text-lg mb-2">
              Pesanan Diterima?
            </h3>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              Pastikan paket sudah kamu terima dengan aman dan sesuai pesanan ya
              kak!
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setModalKonfirm(null)}
                className="flex-1 py-3 text-xs font-bold text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition"
              >
                Batal
              </button>
              <button
                onClick={eksekusiPesananDiterima}
                disabled={sedangKonfirm}
                className="flex-1 py-3 text-xs font-bold text-white bg-pink-600 rounded-xl shadow-md hover:bg-pink-700 transition flex items-center justify-center"
              >
                {sedangKonfirm ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Ya, Selesai"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Lacak Resi dihapus, pindah ke halaman khusus */}
    </div>
  );
}
