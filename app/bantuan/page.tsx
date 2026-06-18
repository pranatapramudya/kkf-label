"use client";

import { useState } from "react";

interface TipeFaq {
  tanya: string;
  jawab: string;
}

export default function HalamanBantuan() {
  const [indeksBuka, setIndeksBuka] = useState<number | null>(null);

  const dataFaq: TipeFaq[] = [
    {
      tanya: "Apakah produk kkf-label bisa diretur jika salah ukuran?",
      jawab:
        "Bisa banget, sis! Lu punya waktu maksimal 2 hari setelah paket diterima untuk mengajukan retur penukaran size. Pastikan tag/label produk belum dilepas dan baju dalam kondisi belum dicuci ya.",
    },
    {
      tanya: "Bahan kain apa yang dominan digunakan pada produk kkf-label?",
      jawab:
        "Kami fokus memproduksi pakaian minimalis dengan bahan katun premium, knit jersey rajut yang bertekstur lembut, serta serat ceruty silk pilihan yang tidak menerawang, jatuh anggun, dan nyaman dipakai seharian di iklim tropis.",
    },
    {
      tanya: "Pengiriman paket menggunakan kurir apa saja?",
      jawab:
        "Untuk mempermudah pelacakan ongkir, kkf-label bekerja sama dengan J&T Express, JNE, dan SiCepat. Pesanan lu akan dikirim langsung dari gudang pusat kami.",
    },
    {
      tanya: "Berapa lama waktu proses pengemasan baju hingga dikirim?",
      jawab:
        "Proses verifikasi pembayaran dilakukan otomatis melalui sistem payment gateway. Setelah itu, tim kami membutuhkan waktu pengemasan sekitar 1-2 hari kerja sebelum paket dijemput oleh kurir ekspedisi pilihan lu.",
    },
  ];

  return (
    <div className="min-h-screen bg-pink-50/50 text-zinc-900 pt-24 pb-12 font-sans">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            Pusat Bantuan
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Ada kendala atau pertanyaan seputar pesanan? Cek jawaban cepatnya di
            sini, sis.
          </p>
        </div>

        {/* LIST ACCORDION FAQ */}
        <div className="space-y-3">
          {dataFaq.map((item, indeks) => {
            const apakahBuka = indeksBuka === indeks;
            return (
              <div
                key={indeks}
                className="bg-white rounded-2xl shadow-sm border border-pink-100/70 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setIndeksBuka(apakahBuka ? null : indeks)}
                  className="w-full text-left p-5 font-semibold text-zinc-800 flex justify-between items-center gap-4 hover:bg-pink-50/20 transition-colors text-sm md:text-base"
                >
                  <span>{item.tanya}</span>
                  <span
                    className={`text-lg font-bold text-soft-pink-500 transition-transform duration-300 transform ${apakahBuka ? "rotate-45" : "rotate-0"}`}
                  >
                    ＋
                  </span>
                </button>

                {apakahBuka && (
                  <div className="px-5 pb-5 pt-1 text-sm text-zinc-500 leading-relaxed border-t border-pink-50/50 animate-in fade-in duration-200">
                    {item.jawab}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* HUBUNGI ADMIN WA (UPGRADED) */}
        <div className="mt-10 text-center bg-white p-6 rounded-2xl shadow-sm border border-pink-100">
          <h3 className="font-bold text-zinc-800 text-base">
            Belum Menemukan Jawaban Kamu?
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Jangan sungkan untuk berdiskusi langsung dengan tim Layanan
            Pelanggan kami via WhatsApp.
          </p>

          {/* Tombol diganti menjadi Link <a> menuju WA */}
          <a
            // Format URL WA: wa.me/kode_negara_nomor?text=pesan_otomatis
            href="https://wa.me/6285117490449?text=Hai%20KKF%20Label%20CS,%20saya%20mau%20tanya%20seputar%20produk/pesanan%20saya..."
            target="_blank" // Buka di tab baru
            rel="noopener noreferrer" // Keamanan
            className="mt-4 inline-block bg-zinc-900 hover:bg-soft-pink-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition shadow-sm"
          >
            Hubungi Customer Service 💬
          </a>
        </div>
      </div>
    </div>
  );
}
