"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatRupiah } from "@/lib/format";
import { Upload, CheckCircle, Copy, AlertTriangle, Loader2, Clock } from "lucide-react";

export default function ClientPembayaran({ order }: { order: any }) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    if (!order.dibuatPada) return;
    const hitungSisa = () => {
      const expired = new Date(order.dibuatPada).getTime() + 60 * 60 * 1000;
      const sekarang = new Date().getTime();
      const selisih = Math.floor((expired - sekarang) / 1000);
      setTimeLeft(selisih > 0 ? selisih : 0);
    };
    
    hitungSisa();
    const interval = setInterval(hitungSisa, 1000);
    return () => clearInterval(interval);
  }, [order.dibuatPada]);

  const mnt = Math.floor(timeLeft / 60);
  const dtk = timeLeft % 60;
  const formatWaktu = `${String(mnt).padStart(2, '0')}:${String(dtk).padStart(2, '0')}`;

  // Mapping rekening
  const getRekening = (metode: string) => {
    switch (metode) {
      case "MANUAL_BCA":
        return { bank: "BCA", norek: "7740246032", nama: "Fitri Amalia" };
      case "MANUAL_BRI":
        return { bank: "BRI", norek: "009401105773507", nama: "Fitri Amalia" };
      case "MANUAL_SHOPEEPAY":
        return { bank: "ShopeePay", norek: "08112099998", nama: "Fitri Amalia" };
      case "MANUAL_GOPAY":
        return { bank: "GoPay", norek: "08112099998", nama: "Fitri Amalia" };
      default:
        return null;
    }
  };

  const rekening = getRekening(order.metodePembayaran);

  const handleCopy = () => {
    if (rekening) {
      navigator.clipboard.writeText(rekening.norek);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyNominal = () => {
    navigator.clipboard.writeText(order.total.toString());
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Pilih gambar bukti transfer terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("invoice", order.kodePesanan);

      const res = await fetch("/api/upload-bukti", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.pesan || "Gagal mengunggah bukti transfer.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (order.statusPesanan !== "MENUNGGU_PEMBAYARAN") {
    return (
      <div className="min-h-screen bg-pink-50/30 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">Pembayaran Diproses</h2>
          <p className="text-zinc-600 mb-6">
            Status pesanan <strong>{order.kodePesanan}</strong> saat ini adalah {order.statusPesanan.replace("_", " ")}. Silakan pantau riwayat pengiriman Anda.
          </p>
          <Link 
            href="/lacak-pesanan"
            className="w-full inline-block bg-soft-pink-600 text-white font-bold py-3 rounded-xl hover:bg-soft-pink-700 transition"
          >
            Lacak Pesanan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50/30 py-6 px-4">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-5">
          <h1 className="text-xl md:text-3xl font-bold text-zinc-900 mb-1.5">Menunggu Pembayaran</h1>
          <p className="text-sm md:text-base text-zinc-600">Selesaikan pembayaran untuk pesanan <span className="font-bold text-soft-pink-600">{order.kodePesanan}</span></p>
          
          {!success && (
            <div className="inline-flex items-center justify-center gap-2 mt-3 bg-red-100 text-red-600 px-3 py-1.5 rounded-full border border-red-200">
              <Clock size={16} />
              <span className="text-xs md:text-sm font-bold tracking-wide">Sisa Waktu: {formatWaktu}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-pink-100 p-5 md:p-6 mb-4">
          <div className="text-center mb-4 pb-4 border-b border-pink-50">
            <p className="text-sm font-medium text-zinc-500 mb-2">Total Tagihan</p>
            <div className="flex items-center justify-center gap-3">
              <p className="text-2xl md:text-3xl font-black text-soft-pink-600">{formatRupiah(order.total)}</p>
              <button 
                onClick={handleCopyNominal}
                className="p-1.5 bg-soft-pink-50 text-soft-pink-600 rounded-lg hover:bg-soft-pink-100 transition flex items-center justify-center"
                title="Salin Nominal"
              >
                {copiedNominal ? <CheckCircle size={18} /> : <Copy size={18} />}
              </button>
            </div>
            {copiedNominal && <p className="text-xs text-emerald-600 font-bold mt-2 animate-in fade-in zoom-in-95">Nominal berhasil disalin!</p>}
          </div>

          {rekening ? (
            <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200 mb-5">
              <p className="text-xs font-medium text-zinc-500 mb-2">Transfer ke rekening berikut:</p>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-zinc-100 shadow-sm">
                <div>
                  <p className="font-bold text-zinc-900 text-sm">{rekening.bank}</p>
                  <p className="text-lg md:text-xl font-mono font-bold tracking-wider text-zinc-800 my-0.5">{rekening.norek}</p>
                  <p className="text-xs text-zinc-600">a/n {rekening.nama}</p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-2.5 bg-soft-pink-50 text-soft-pink-600 rounded-xl hover:bg-soft-pink-100 transition flex flex-col items-center gap-1"
                >
                  {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
                  <span className="text-[10px] font-bold">{copied ? "Disalin" : "Salin"}</span>
                </button>
              </div>
            </div>
          ) : (
             <div className="bg-red-50 p-4 rounded-xl text-red-600 text-sm font-medium border border-red-100 mb-5">
               Metode pembayaran tidak valid untuk transfer manual.
             </div>
          )}

          {!success && (
            <div className="space-y-4">
              <h3 className="font-bold text-zinc-900 text-lg">Konfirmasi Pembayaran</h3>
              <p className="text-sm text-zinc-600 mb-4">
                Silakan unggah foto/screenshot bukti transfer Anda di sini agar admin dapat segera memproses pesanan.
              </p>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-6 text-center hover:bg-zinc-50 transition cursor-pointer relative">
                  <input 
                    type="file" 
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) => {
                      const selected = e.target.files?.[0];
                      if (selected) {
                        if (selected.size > 3 * 1024 * 1024) {
                          setError("Ukuran gambar melebihi 3MB.");
                          setFile(null);
                        } else {
                          setError("");
                          setFile(selected);
                        }
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center gap-2 pointer-events-none">
                    <Upload size={32} className={file ? "text-soft-pink-500" : "text-zinc-400"} />
                    {file ? (
                      <p className="text-sm font-bold text-soft-pink-600">{file.name}</p>
                    ) : (
                      <>
                        <p className="text-sm font-bold text-zinc-700">Pilih gambar atau tarik ke sini</p>
                        <p className="text-xs text-zinc-500">Maks. 3MB (JPG, PNG, WEBP)</p>
                      </>
                    )}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex items-start gap-2 text-red-600 text-sm font-medium">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                    <p>{error}</p>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={!file || isSubmitting || timeLeft <= 0}
                  className={`w-full font-bold py-4 rounded-xl transition shadow-md flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-soft-pink-600 text-white opacity-70 cursor-not-allowed"
                      : !file || timeLeft <= 0
                        ? "bg-zinc-300 text-zinc-500 cursor-not-allowed shadow-none"
                        : "bg-soft-pink-600 hover:bg-soft-pink-700 text-white"
                  }`}
                >
                  {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                  {isSubmitting ? "Mengunggah..." : timeLeft <= 0 ? "Waktu Habis" : "Kirim Bukti Pembayaran"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5 border-[6px] border-emerald-50 shadow-sm">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2">Pembayaran Sukses!</h2>
            <p className="text-zinc-600 text-sm mb-8 leading-relaxed">
              Bukti transfer Anda telah kami terima dan sedang diverifikasi oleh admin. Terima kasih!
            </p>
            
            <div className="flex flex-col gap-3">
              <Link 
                href="/lacak-pesanan"
                className="w-full bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl hover:bg-emerald-600 shadow-md transition text-sm flex items-center justify-center"
              >
                Lihat Pesanan Saya
              </Link>
              <Link 
                href="/"
                className="w-full border-2 border-zinc-200 text-zinc-600 bg-white font-bold py-3 px-4 rounded-xl hover:bg-zinc-50 transition text-sm flex items-center justify-center"
              >
                Kembali ke Beranda
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
