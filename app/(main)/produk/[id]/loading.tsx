import React from "react";

export default function LoadingProdukDetail() {
  return (
    <div className="kontainer-halaman pt-0 md:py-6 pb-32 md:pb-12 animate-pulse w-full max-w-[100vw] overflow-x-hidden">
      <div className="grid gap-6 md:gap-8 lg:grid-cols-2 w-full max-w-full">
        {/* Gambar Skeleton */}
        <div className="w-full flex flex-col gap-3">
          <div className="w-full aspect-square md:aspect-[4/5] bg-zinc-200 md:rounded-2xl border border-pink-50" />
          <div className="flex gap-3 w-full px-4 md:px-0">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-16 w-16 md:h-20 md:w-20 flex-none bg-zinc-200 rounded-lg"
              />
            ))}
          </div>
        </div>

        {/* Info Skeleton */}
        <div className="flex flex-col w-full mt-4 md:mt-0 space-y-4 px-4 md:px-0">
          <div className="h-6 w-24 bg-soft-pink-100 rounded-full" />
          <div className="h-10 w-3/4 bg-zinc-200 rounded-lg" />
          
          <div className="flex gap-4">
            <div className="h-6 w-32 bg-zinc-200 rounded-lg" />
            <div className="h-6 w-10 bg-zinc-200 rounded-lg ml-auto" />
          </div>

          <div className="h-8 w-48 bg-zinc-200 rounded-lg mt-2" />

          <div className="space-y-2 mt-4">
            <div className="h-4 w-full bg-zinc-200 rounded" />
            <div className="h-4 w-full bg-zinc-200 rounded" />
            <div className="h-4 w-4/5 bg-zinc-200 rounded" />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-6">
            <div className="h-16 w-full bg-zinc-200 rounded-xl" />
            <div className="h-16 w-full bg-zinc-200 rounded-xl" />
          </div>

          <div className="flex gap-3 mt-6">
            <div className="h-12 flex-1 bg-zinc-200 rounded-xl" />
            <div className="h-12 flex-1 bg-zinc-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
