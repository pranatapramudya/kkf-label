"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X, ZoomIn, PlayCircle } from "lucide-react";
import Image from "next/image";

export function GaleriProduk({
  fotoUtama,
  galeriFoto,
}: {
  fotoUtama: string;
  galeriFoto: string[];
}) {
  // 🔥 Gabungin foto utama dan galeri jadi satu deretan, pastiin nggak ada yang dobel
  const semuaFoto = Array.from(new Set([fotoUtama, ...(galeriFoto || [])]));
  const totalGambar = semuaFoto.length;

  const [indexAktif, setIndexAktif] = useState(0);
  const [zoomBuka, setZoomBuka] = useState(false);
  const autoplayTimer = useRef<NodeJS.Timeout | null>(null);

  // --- 🔥 LOGIC AUTOPLAY SLIDESHOW ---
  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
      autoplayTimer.current = null;
    }
  };

  const startAutoplay = () => {
    if (totalGambar <= 1 || zoomBuka) return; // Kalau cuma 1 foto atau lagi buka zoom, jangan jalan sendiri
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setIndexAktif((prev) => (prev === totalGambar - 1 ? 0 : prev + 1));
    }, 4000); // Ganti foto setiap 4 detik
  };

  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [totalGambar, zoomBuka]); // Restart kalau zoom ditutup

  // --- 🔥 LOGIC NAVIGASI MANUAL ---
  const geserKiri = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndexAktif((prev) => (prev === 0 ? totalGambar - 1 : prev - 1));
    startAutoplay();
  };

  const geserKanan = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIndexAktif((prev) => (prev === totalGambar - 1 ? 0 : prev + 1));
    startAutoplay();
  };

  const handleThumbnailClick = (idx: number) => {
    setIndexAktif(idx);
    startAutoplay();
  };

  // --- 🔥 LOGIC DETEKSI VIDEO ---
  const isVideo = (url: string) => {
    if (!url) return false;
    return url.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/);
  };

  const mediaAktif = semuaFoto[indexAktif];
  const isMediaVideo = isVideo(mediaAktif);

  return (
    <div className="flex flex-col gap-4 w-full max-w-md mx-auto md:max-w-none">
      {/* ======================================================== */}
      {/* 🔥 GUDANG UTAMA: FOTO/VIDEO BESAR & SLIDER */}
      {/* FIX: aspect-square (kotak 1:1) buat HP, aspect-[4/5] buat PC */}
      {/* ======================================================== */}
      <div
        className="relative aspect-square md:aspect-[4/5] w-full rounded-2xl overflow-hidden bg-zinc-100 group cursor-zoom-in border border-pink-50 shadow-sm"
        onClick={() => !isMediaVideo && setZoomBuka(true)} // Kalau video nggak usah di-zoom
      >
        {isMediaVideo ? (
          <video
            src={mediaAktif}
            autoPlay
            muted
            loop
            playsInline // WAJIB ada buat iOS
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Image
            src={mediaAktif}
            alt="KKF Label Produk"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={indexAktif === 0}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}

        {/* Ikon Kaca Pembesar (Muncul pas di-hover di PC, kecuali kalau video) */}
        {!isMediaVideo && (
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/80 backdrop-blur-sm p-3 rounded-full text-zinc-700 shadow-lg">
              <ZoomIn size={24} />
            </div>
          </div>
        )}

        {/* Tombol Kiri Kanan */}
        {totalGambar > 1 && (
          <>
            <button
              onClick={geserKiri}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={geserKanan}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-zinc-800 p-2 rounded-full shadow-md backdrop-blur-sm transition-all z-10 opacity-0 group-hover:opacity-100"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {/* ======================================================== */}
      {/* 🔥 THUMBNAIL BAWAH (Bisa nampung banyak foto) */}
      {/* ======================================================== */}
      {totalGambar > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {semuaFoto.map((media, idx) => {
            const isThumbVideo = isVideo(media);

            return (
              <button
                key={idx}
                onClick={() => handleThumbnailClick(idx)}
                className={`relative shrink-0 w-20 h-20 md:w-20 md:h-24 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                  indexAktif === idx
                    ? "border-soft-pink-500 opacity-100 shadow-md scale-105 ring-2 ring-pink-100"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                {isThumbVideo ? (
                  <div className="absolute inset-0 bg-black flex items-center justify-center">
                    <video
                      src={media}
                      className="w-full h-full object-cover opacity-70"
                    />
                    <PlayCircle className="absolute text-white" size={24} />
                  </div>
                ) : (
                  <Image
                    src={media}
                    alt={`Thumbnail ${idx}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* ======================================================== */}
      {/* 🔥 MODAL ZOOM FULLSCREEN HD (Tetep dipertahankan) */}
      {/* ======================================================== */}
      {zoomBuka && !isMediaVideo && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center animate-in fade-in duration-200">
          <button
            onClick={() => setZoomBuka(false)}
            className="absolute top-5 right-5 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all z-50"
          >
            <X size={28} />
          </button>

          <div className="relative w-full h-full p-4 md:p-10 animate-in zoom-in-95 duration-300">
            <Image
              src={mediaAktif}
              alt="Zoom HD"
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>

          {totalGambar > 1 && (
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

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm font-bold px-4 py-1.5 rounded-full tracking-widest">
            {indexAktif + 1} / {totalGambar}
          </div>
        </div>
      )}
    </div>
  );
}
