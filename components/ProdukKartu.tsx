"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

import { Star, MapPin } from "lucide-react";

export function ProdukKartu({ 
  produk, 
  priority = false,
  averageRating: propAverageRating,
  totalSold: propTotalSold
}: { 
  produk: any, 
  priority?: boolean,
  averageRating?: number,
  totalSold?: number
}) {
  // PENGAMAN FOTO: Kalau URL kurang dari 5 huruf (misal kosong/asal ketik), paksa pakai logo KKF
  const fotoValid =
    produk.fotoUtama && produk.fotoUtama.length > 5
      ? produk.fotoUtama
      : "/logo-kkf.jpeg";
  const galeri = [fotoValid];

  const [indexFoto, setIndexFoto] = useState(0);

  // KALKULASI DISKON REAL-TIME
  const adaDiskon = produk.diskonPersen && produk.diskonPersen > 0;
  const hargaAsli = produk.harga || 0;
  const hargaAkhir = adaDiskon
    ? hargaAsli - hargaAsli * (produk.diskonPersen / 100)
    : hargaAsli;

  const totalSold = propTotalSold !== undefined 
    ? propTotalSold 
    : produk.itemPesanan?.reduce((acc: number, curr: any) => acc + curr.jumlah, 0);

  const averageRating = propAverageRating !== undefined
    ? propAverageRating
    : produk.ulasan && produk.ulasan.length > 0
      ? produk.ulasan.reduce((acc: number, curr: any) => acc + curr.rating, 0) / produk.ulasan.length
      : undefined;

  return (
    <Link
      href={`/produk/${produk.id}`}
      prefetch={true}
      className="group flex flex-col h-full overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-sm transition hover:shadow-md relative"
    >
      {/* LABEL DISKON (Muncul otomatis kalau ada diskon) */}
      {adaDiskon && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
          -{produk.diskonPersen}%
        </div>
      )}

      {/* AREA FOTO */}
      <div className="relative aspect-[4/5] overflow-hidden bg-zinc-100">
        <div
          className="flex w-full h-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${indexFoto * 100}%)` }}
        >
          {galeri.map((img: string, i: number) => (
            <div key={i} className="relative h-full min-w-full">
              <Image
                src={img}
                alt={produk.nama || "Produk KKF"}
                fill
                priority={priority}
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* INFO PRODUK */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col">
        <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-soft-pink-500 mb-1 truncate">
          {produk.kategori?.nama || "KATEGORI"}
        </p>
        <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 mb-1.5 line-clamp-2 leading-tight">
          {produk.nama}
        </h3>

        {/* Dynamic Social Proof */}
        {(averageRating !== undefined || totalSold !== undefined) && (
          <div className="flex items-center gap-1.5 mb-2 text-[10px] sm:text-xs text-zinc-500 font-medium">
            {averageRating !== undefined && averageRating > 0 && (
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
            
            {averageRating !== undefined && averageRating > 0 && totalSold !== undefined && totalSold > 0 && (
              <span className="text-zinc-300">|</span>
            )}

            {totalSold !== undefined && totalSold > 0 && (
              <span>Terjual {totalSold >= 1000 ? `${(totalSold/1000).toFixed(1)}k+` : totalSold}</span>
            )}
          </div>
        )}

        <div className="flex justify-between items-end mt-auto pt-1 gap-2">
          <div className="flex flex-col items-start shrink-0">
            {/* Harga Coret (Muncul kalau ada diskon) */}
            {adaDiskon && (
              <p className="text-[10px] text-zinc-400 line-through mb-0.5">
                Rp {hargaAsli.toLocaleString("id-ID")}
              </p>
            )}
            {/* Harga Final */}
            <p className="text-sm font-bold text-zinc-800">
              Rp {hargaAkhir.toLocaleString("id-ID")}
            </p>
          </div>
          
          <div className="flex items-center gap-0.5 text-zinc-500 mb-0.5 min-w-0">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="text-[9px] whitespace-nowrap truncate text-right">Sumedang, Jawa Barat</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
