"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn } from "lucide-react";

export function GaleriProduk({
  fotoUtama,
  galeriFoto,
}: {
  fotoUtama: string;
  galeriFoto: string[];
}) {
  // Gabungin foto utama dan galeri jadi satu deretan, pastiin nggak ada yang dobel
  const semuaFoto = Array.from(new Set([fotoUtama, ...(galeriFoto || [])]));

  const [indexAktif, setIndexAktif] = useState(0);
  const [zoomBuka, setZoomBuka] = useState(false);

  const geserKiri = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndexAktif((prev) => (prev === 0 ? semuaFoto.length - 1 : prev - 1));
  };

  const geserKanan = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndexAktif((prev) => (prev === semuaFoto.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto md:max-w-none">
      {/* GUDANG UTAMA: FOTO BESAR & SLIDER */}
      <div
        className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-100 group cursor-zoom-in border border-pink-50 shadow-sm"
        onClick={() => setZoomBuka(true)}
      >
        <img
          src={semuaFoto[indexAktif]}
          alt="KKF Label Produk"
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy" // Ini yang bikin ringan
        />

        {/* Ikon Kaca Pembesar (Muncul pas di-hover di PC) */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full text-zinc-700 shadow-lg">
            <ZoomIn size={24} />
          </div>
        </div>

        {/* Tombol Kiri Kanan (Cuma muncul kalau foto lebih dari 1) */}
        {semuaFoto.length > 1 && (
          <>
            <button
              onClick={geserKiri}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={geserKanan}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* THUMBNAIL BAWAH (Bisa nampung 10+ foto, bisa di-scroll ke samping) */}
      {semuaFoto.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {semuaFoto.map((foto, idx) => (
            <button
              key={idx}
              onClick={() => setIndexAktif(idx)}
              className={`relative shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                indexAktif === idx
                  ? "border-soft-pink-500 opacity-100 shadow-md"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={foto}
                alt={`Thumbnail ${idx}`}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL ZOOM FULLSCREEN HD (Pas gambar di-klik) */}
      {/* ======================================================== */}
      {zoomBuka && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => setZoomBuka(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
          >
            <X size={28} />
          </button>

          <img
            src={semuaFoto[indexAktif]}
            alt="Zoom HD"
            className="w-full h-full object-contain p-4 md:p-10 animate-in zoom-in-95 duration-300"
          />

          {/* Navigasi Kiri Kanan di mode Fullscreen */}
          {semuaFoto.length > 1 && (
            <>
              <button
                onClick={geserKiri}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all"
              >
                <ChevronLeft size={32} />
              </button>
              <button
                onClick={geserKanan}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-black/40 hover:bg-black/60 p-3 rounded-full transition-all"
              >
                <ChevronRight size={32} />
              </button>
            </>
          )}

          {/* Indikator halaman foto di bawah (misal: 2 / 10) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-bold px-4 py-1.5 rounded-full tracking-widest">
            {indexAktif + 1} / {semuaFoto.length}
          </div>
        </div>
      )}
    </div>
  );
}
