"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export function ProdukKartu({ produk }: { produk: any }) {
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

  return (
    <Link
      href={`/produk/${produk.id}`}
      className="group block overflow-hidden rounded-2xl border border-pink-50 bg-white shadow-sm transition hover:shadow-md relative"
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
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>

      {/* INFO PRODUK */}
      <div className="p-4 sm:p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-soft-pink-500 mb-1">
          {produk.kategori?.nama || "KATEGORI"}
        </p>
        <h3 className="text-sm font-semibold text-zinc-900 mb-2 truncate">
          {produk.nama}
        </h3>

        <div className="flex items-end gap-2">
          {/* Harga Final */}
          <p className="text-sm font-bold text-zinc-800">
            Rp {hargaAkhir.toLocaleString("id-ID")}
          </p>
          {/* Harga Coret (Muncul kalau ada diskon) */}
          {adaDiskon && (
            <p className="text-xs text-gray-400 line-through mb-0.5">
              Rp {hargaAsli.toLocaleString("id-ID")}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
