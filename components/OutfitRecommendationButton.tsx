"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function OutfitRecommendationButton() {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showAlert) {
      timer = setTimeout(() => {
        setShowAlert(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert]);

  return (
    <>
      <button 
        onClick={() => setShowAlert(true)} 
        className="flex flex-col items-center gap-2 group min-w-[80px] bg-transparent border-none outline-none cursor-pointer"
      >
        <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center group-hover:bg-pink-50 group-hover:scale-105 transition-all shadow-md border border-pink-100">
          <Image 
            src="/icons/icon-technical-support.png" 
            alt="Rekomendasi Outfit" 
            width={40} 
            height={40} 
            className="object-contain" 
          />
        </div>
        <span className="text-[10px] font-bold text-black text-center uppercase tracking-wide max-w-[80px] leading-tight">
          Rekomendasi Outfit
        </span>
      </button>

      {/* Modern Alert Modal / Toast */}
      {showAlert && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-5 duration-300">
          <div className="bg-zinc-900/95 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium border border-zinc-700 whitespace-nowrap">
            <span>Fitur ini sedang dalam tahap pengembangan 🚀</span>
          </div>
        </div>
      )}
    </>
  );
}
