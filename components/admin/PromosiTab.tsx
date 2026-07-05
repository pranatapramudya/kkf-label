"use client";

import { useState, useEffect } from "react";
import { Loader2, Send, Megaphone, CheckCircle, Mail, AlertCircle } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export default function PromosiTab() {
  const [daftarPelanggan, setDaftarPelanggan] = useState<any[]>([]);
  const [memuatData, setMemuatData] = useState(true);
  const [mengirim, setMengirim] = useState(false);

  // Form Promo
  const [judulPromo, setJudulPromo] = useState("PROMO SPESIAL KKF LABEL 🎉");
  const [isiPesan, setIsiPesan] = useState(
    "Halo kak! Terima kasih sudah berbelanja di KKF Label.\n\nKhusus buat kakak, ada voucher diskon spesial nih: KKF10K\n\nBuruan pakai kodenya sebelum kehabisan ya. 💕"
  );

  const [notifikasi, setNotifikasi] = useState({ tampil: false, pesan: "", tipe: "sukses" });

  useEffect(() => {
    const fetchPelanggan = async () => {
      try {
        const res = await fetch("/api/admin/promosi");
        if (res.ok) {
          const data = await res.json();
          setDaftarPelanggan(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setMemuatData(false);
      }
    };
    fetchPelanggan();
  }, []);

  const tampilNotif = (pesan: string, tipe = "sukses") => {
    setNotifikasi({ tampil: true, pesan, tipe });
    setTimeout(() => setNotifikasi({ tampil: false, pesan: "", tipe: "sukses" }), 4000);
  };

  const kirimEmailMassal = async () => {
    setMengirim(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: judulPromo,
          content: isiPesan,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal mengirim email massal");
      }

      tampilNotif(result.message || "Berhasil mengirim broadcast email promo!");
    } catch (error: any) {
      tampilNotif(error.message, "gagal");
    } finally {
      setMengirim(false);
    }
  };

  const subjectEmail = encodeURIComponent(judulPromo);
  const bodyEmail = encodeURIComponent(isiPesan);

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300 w-full">
      <div className="grid md:grid-cols-3 gap-6">
        {/* KOLOM KIRI: FORM PROMO */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-soft-pink-50 text-soft-pink-600 shadow-sm">
                <Megaphone size={20} />
              </span>
              <h3 className="font-bold text-zinc-900 text-lg">Buat Promo Email</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Subjek Email
                </label>
                <input
                  type="text"
                  value={judulPromo}
                  onChange={(e) => setJudulPromo(e.target.value)}
                  className="w-full border border-zinc-300 p-2.5 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm font-bold"
                  placeholder="Contoh: BIG SALE 12.12"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-600 mb-1.5">
                  Isi Email Promo
                </label>
                <textarea
                  rows={6}
                  value={isiPesan}
                  onChange={(e) => setIsiPesan(e.target.value)}
                  className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm"
                  placeholder="Ketik isi email promo di sini..."
                />
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl mt-4">
                <p className="text-[10px] font-bold text-zinc-600 mb-2 uppercase tracking-wider">Preview Pesan Email</p>
                <div className="text-sm text-zinc-800 whitespace-pre-wrap">
                  <span className="font-bold">Subjek: {judulPromo}</span>{"\n\n"}
                  {isiPesan}
                </div>
              </div>

              <button
                onClick={kirimEmailMassal}
                disabled={mengirim}
                className="w-full flex items-center justify-center gap-2 bg-soft-pink-600 hover:bg-soft-pink-700 disabled:bg-soft-pink-300 text-white px-4 py-3 rounded-xl text-sm font-bold transition shadow-sm mt-4"
              >
                {mengirim ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Kirim Email Massal
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: DAFTAR PELANGGAN */}
        <div className="md:col-span-2">
          <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm h-full flex flex-col">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="font-bold text-zinc-900 text-lg">Pelanggan Setia</h3>
                <p className="text-xs text-zinc-600 mt-1">Total {daftarPelanggan.length} pelanggan yang pernah order.</p>
              </div>
            </div>

            {memuatData ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
                <Loader2 className="animate-spin text-soft-pink-500" size={24} />
                <p className="text-sm font-medium">Menarik data dari database...</p>
              </div>
            ) : (
              <div className="flex-1">
                {daftarPelanggan.length === 0 ? (
                  <div className="text-center py-10 text-zinc-600 italic text-sm">Belum ada pelanggan dengan status Selesai.</div>
                ) : (
                  <>
                    {/* Tampilan Desktop (Table) */}
                    <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead>
                          <tr className="border-b border-pink-100 text-zinc-600">
                            <th className="pb-3 font-semibold px-2">Nama</th>
                            <th className="pb-3 font-semibold px-2">Kontak</th>
                            <th className="pb-3 font-semibold px-2">Order Terakhir</th>
                            <th className="pb-3 font-semibold px-2">Total Belanja</th>
                            <th className="pb-3 font-semibold px-2 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody>
                          {daftarPelanggan.map((p, index) => (
                            <tr key={index} className="border-b border-pink-50 last:border-0 hover:bg-pink-50/30 transition-colors">
                              <td className="py-3 px-2 font-bold text-zinc-800">{p.nama}</td>
                              <td className="py-3 px-2 text-zinc-600">
                                <div>{p.telepon}</div>
                                <div className="text-xs text-zinc-600">{p.email || "-"}</div>
                              </td>
                              <td className="py-3 px-2 text-zinc-600 text-xs">
                                {new Date(p.pesananTerakhir).toLocaleDateString("id-ID")}
                              </td>
                              <td className="py-3 px-2 font-bold text-soft-pink-600">
                                {formatRupiah(p.totalBelanja)}
                              </td>
                              <td className="py-3 px-2 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {p.email && (
                                    <a
                                      href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}&su=${subjectEmail}&body=${bodyEmail}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-lg transition shadow-sm"
                                    >
                                      <Mail size={14} /> Email
                                    </a>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Tampilan Mobile (Card) */}
                    <div className="sm:hidden space-y-4">
                      {daftarPelanggan.map((p, index) => (
                        <div key={index} className="bg-white border border-pink-100 rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-zinc-800">{p.nama}</h4>
                              <p className="text-xs text-zinc-600">{new Date(p.pesananTerakhir).toLocaleDateString("id-ID")}</p>
                            </div>
                            <span className="font-bold text-soft-pink-600 text-sm">{formatRupiah(p.totalBelanja)}</span>
                          </div>
                          <div className="text-xs text-zinc-600 mb-4">
                            <p>📞 {p.telepon}</p>
                            {p.email && <p>📧 {p.email}</p>}
                          </div>
                          <div className="flex gap-2">
                            {p.email && (
                              <a
                                href={`https://mail.google.com/mail/?view=cm&fs=1&to=${p.email}&su=${subjectEmail}&body=${bodyEmail}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg transition shadow-sm"
                              >
                                <Mail size={14} /> Email
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {notifikasi.tampil && (
        <div className={`fixed bottom-5 right-5 z-[99999] text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300 ${notifikasi.tipe === "sukses" ? "bg-zinc-900" : "bg-red-500"}`}>
          {notifikasi.tipe === "sukses" ? <CheckCircle size={18} className="text-emerald-400" /> : <AlertCircle size={18} />}
          <p className="text-xs font-bold tracking-wide">{notifikasi.pesan}</p>
        </div>
      )}
    </div>
  );
}

