"use client";

import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProdukKartu } from "./ProdukKartu";

export function ProductCarousel({ products }: { products: any[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 2,
    breakpoints: {
      "(min-width: 768px)": { slidesToScroll: 4 },
    },
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  if (!products || products.length === 0) return null;

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {products.map((item) => (
            <div
              key={item.id}
              // flex-[0_0_50%] = 2 items per view (Mobile)
              // md:flex-[0_0_25%] = 4 items per view (Desktop)
              className="pl-4 flex-[0_0_50%] md:flex-[0_0_25%] min-w-0"
            >
              <ProdukKartu produk={item} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons (Desktop only, hidden on mobile for touch swipe) */}
      <button
        onClick={scrollPrev}
        disabled={!prevBtnEnabled}
        className={`absolute top-1/2 -left-4 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border border-zinc-100 text-zinc-600 transition-all
          ${
            !prevBtnEnabled
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 md:flex hidden hover:bg-soft-pink-50 hover:text-soft-pink-600"
          }`}
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={scrollNext}
        disabled={!nextBtnEnabled}
        className={`absolute top-1/2 -right-4 -translate-y-1/2 z-10 p-2 bg-white rounded-full shadow-md border border-zinc-100 text-zinc-600 transition-all
          ${
            !nextBtnEnabled
              ? "opacity-0 pointer-events-none"
              : "opacity-0 group-hover:opacity-100 md:flex hidden hover:bg-soft-pink-50 hover:text-soft-pink-600"
          }`}
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
