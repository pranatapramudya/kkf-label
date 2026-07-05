"use client";

import React from "react";
import { ProdukKartu } from "./ProdukKartu";

export function ProductCarousel({ products, autoPlay = false }: { products: any[], autoPlay?: boolean }) {
  if (!products || products.length === 0) return null;

  // Jika autoPlay aktif, gandakan array untuk infinite loop. Jika tidak, pakai array aslinya saja.
  const displayProducts = autoPlay 
    ? [...products, ...products, ...products, ...products] 
    : products;

  return (
    <div className={`relative w-full group py-4 ${autoPlay ? 'overflow-hidden' : 'overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'}`}>
      <div 
        className={`flex ${
          autoPlay 
            ? "w-max animate-marquee hover:[animation-play-state:paused] active:[animation-play-state:paused]" 
            : "w-max md:w-full"
        }`}
        style={autoPlay ? { animationDuration: `${products.length * 20}s` } : undefined}
      >
        {displayProducts.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className={`w-[50vw] md:w-[25vw] px-2 flex-shrink-0 ${!autoPlay ? 'snap-center' : ''}`}
          >
            <ProdukKartu produk={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
