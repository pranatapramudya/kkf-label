"use client";

import Image from "next/image";
import Link from "next/link";

export default function OutfitRecommendationButton() {
  return (
    <Link 
      href="/rekomendasi"
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
    </Link>
  );
}
