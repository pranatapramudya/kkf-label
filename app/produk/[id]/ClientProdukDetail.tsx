"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  ShoppingBag,
  MessageCircle,
  CheckCircle,
  AlertTriangle,
  Minus,
  Plus,
  X,
  ChevronRight,
  PlayCircle,
  ChevronLeft,
} from "lucide-react";
import { useKeranjang } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";

export default function ClientProdukDetail({ produk }: { produk: any }) {
  const { tambahItem } = useKeranjang();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const mediaItems: { type: string; url: string }[] = [];
  if (produk.videoUrl && produk.videoUrl.trim() !== "") {
    mediaItems.push({ type: "video", url: produk.videoUrl });
  }
  const semuaFoto = [produk.fotoUtama, ...(produk.galeriFoto || [])].filter(
    (f) => f && f.trim() !== "",
  );
  semuaFoto.forEach((url) => mediaItems.push({ type: "image", url }));

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const [varianAktif, setVarianAktif] = useState<any>(null);
  const [jumlah, setJumlah] = useState(1);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    tipe: "sukses",
  });
  const [bacaSelengkapnya, setBacaSelengkapnya] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tipeAksi, setTipeAksi] = useState<"keranjang" | "beli">("keranjang");

  const maxStok = varianAktif ? varianAktif.stok : produk.stokTotal || 1;
  const adaDiskon = produk.diskonPersen && produk.diskonPersen > 0;
  const hargaAsli = Number(produk.harga) || 0;
  const hargaAkhir = adaDiskon
    ? hargaAsli - hargaAsli * (produk.diskonPersen / 100)
    : hargaAsli;
  const hargaCoret = adaDiskon ? hargaAsli : Number(produk.hargaCoret) || null;

  const kurangJumlah = () => setJumlah((prev) => Math.max(1, prev - 1));
  const tambahJumlah = () => setJumlah((prev) => Math.min(maxStok, prev + 1));

  const showNotif = (msg: string, tipe: "sukses" | "gagal" = "sukses") => {
    setToast({ show: true, message: msg, tipe });
    setTimeout(
      () => setToast({ show: false, message: "", tipe: "sukses" }),
      2000,
    );
  };

  const lompatKeSlide = (index: number) => {
    setActiveIndex(index);
    if (scrollContainerRef.current) {
      const slideWidth = scrollContainerRef.current.clientWidth;
      scrollContainerRef.current.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const scrollPosition = scrollContainerRef.current.scrollLeft;
    const slideWidth = scrollContainerRef.current.clientWidth;
    const newIndex = Math.round(scrollPosition / slideWidth);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  };

  const scrollNext = () => {
    if (activeIndex < mediaItems.length - 1) lompatKeSlide(activeIndex + 1);
  };

  const scrollPrev = () => {
    if (activeIndex > 0) lompatKeSlide(activeIndex - 1);
  };

  const handlePilihVarian = (v: any, index: number) => {
    setVarianAktif(v);
    setJumlah(1);
    const offsetVideo = produk.videoUrl ? 1 : 0;
    lompatKeSlide(index + offsetVideo);
    showNotif(`Pilih varian: ${v.ukuran}, ${v.warna}`, "sukses");
  };

  const getPayloadKeranjang = () => {
    return {
      idVarian: varianAktif?.id || produk.id,
      idProduk: produk.id,
      nama: produk.nama,
      foto: produk.fotoUtama || "/logo-kkf.jpeg",
      ukuran: varianAktif?.ukuran || "",
      warna: varianAktif?.warna || "",
      harga: hargaAkhir,
      hargaCoret: hargaAsli,
      jumlah: Number(jumlah) || 1,
    };
  };

  const handleSubmitDesktop = (tipe: "keranjang" | "beli") => {
    if (!varianAktif && produk.varian?.length > 0)
      return showNotif("Pilih varian dulu kak!", "gagal");
    tambahItem(getPayloadKeranjang());
    if (tipe === "beli") router.push("/checkout");
    else showNotif("Berhasil ditambahkan ke keranjang!", "sukses");
  };

  const handleSubmitModal = () => {
    if (!varianAktif && produk.varian?.length > 0)
      return showNotif("Pilih varian produk dulu ya!", "gagal");
    tambahItem(getPayloadKeranjang());
    setShowModal(false);
    if (tipeAksi === "beli") router.push("/checkout");
    else showNotif("Dimasukkan ke keranjang 🛍️", "sukses");
  };

  return (
    <div className="kontainer-halaman pt-0 md:py-6 pb-32 md:pb-12 relative overflow-x-hidden">
      {toast.show && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[999999] bg-zinc-900/90 backdrop-blur-sm text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2.5 animate-in fade-in zoom-in-95 slide-in-from-bottom-5 duration-200">
          {toast.tipe === "sukses" ? (
            <CheckCircle size={16} className="text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle size={16} className="text-amber-400 shrink-0" />
          )}
          <p className="text-xs font-bold tracking-wide whitespace-nowrap">
            {toast.message}
          </p>
        </div>
      )}

      <div className="grid gap-6 md:gap-8 lg:grid-cols-2">
        {/* 🔥 FIX GALERI: w-full MURNI TANPA HACK MARGIN ANEH 🔥 */}
        <div className="w-full flex flex-col gap-3">
          {!isMounted ? (
            <div className="aspect-square w-full bg-zinc-100 animate-pulse md:rounded-2xl border border-pink-50"></div>
          ) : (
            <>
              <div className="relative w-full aspect-square md:aspect-[4/5] bg-black md:rounded-2xl overflow-hidden shadow-sm group">
                <div
                  ref={scrollContainerRef}
                  onScroll={handleScroll}
                  className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                  {mediaItems.map((item, idx) => (
                    <div
                      key={idx}
                      // 🔥 OBATNYA DI SINI: min-w-full biar ukurannya solid 100% layar 🔥
                      className="min-w-full w-full h-full shrink-0 snap-center flex items-center justify-center bg-black relative"
                    >
                      {item.type === "video" ? (
                        <video
                          src={item.url}
                          poster={produk.fotoUtama || "/logo-kkf.jpeg"}
                          autoPlay
                          muted
                          loop
                          playsInline
                          controls
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Image
                          src={item.url}
                          alt={`${produk.nama} ${idx}`}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-contain"
                          priority={idx === 0}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <button
                  onClick={scrollPrev}
                  disabled={activeIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-soft-pink-600 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white md:block hidden disabled:hidden cursor-pointer"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={scrollNext}
                  disabled={activeIndex === mediaItems.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-soft-pink-600 shadow-md backdrop-blur-sm opacity-0 transition-opacity group-hover:opacity-100 hover:bg-white md:block hidden disabled:hidden cursor-pointer"
                >
                  <ChevronRight size={24} />
                </button>

                {mediaItems.length > 1 && (
                  <div className="absolute top-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full pointer-events-none shadow-sm border border-white/10 md:hidden">
                    {activeIndex + 1} / {mediaItems.length}
                  </div>
                )}
              </div>

              {mediaItems.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 pt-1 w-full snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {mediaItems.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => lompatKeSlide(idx)}
                      className={`relative h-16 w-16 md:h-20 md:w-16 flex-none shrink-0 overflow-hidden rounded-lg transition-all snap-center cursor-pointer ${
                        activeIndex === idx
                          ? "ring-2 ring-soft-pink-500 ring-offset-2 opacity-100 shadow-sm"
                          : "border-2 border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      {item.type === "video" ? (
                        <div className="relative w-full h-full bg-zinc-900 flex items-center justify-center">
                          <video
                            src={item.url}
                            className="object-cover w-full h-full opacity-50"
                            muted
                          />
                          <PlayCircle
                            size={20}
                            className="absolute inset-0 m-auto text-white shadow-lg drop-shadow-md"
                          />
                        </div>
                      ) : (
                        <Image
                          src={item.url}
                          alt={`Thumb ${idx}`}
                          fill
                          sizes="(max-width: 768px) 20vw, 10vw"
                          className="object-cover bg-white border border-pink-50 rounded-lg"
                        />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* INFORMASI PRODUK */}
        <div className="flex flex-col">
          <span className="rounded-full bg-soft-pink-100 px-3 py-1 text-xs font-semibold text-soft-pink-700 uppercase w-fit">
            {produk.kategori?.nama || "Umum"}
          </span>
          <h1 className="mt-4 text-2xl sm:text-3xl font-bold text-zinc-900 leading-tight">
            {produk.nama}
          </h1>

          <div className="mt-3 flex items-center gap-2 text-sm text-zinc-600">
            <Star size={16} className="fill-soft-pink-400 text-soft-pink-400" />
            <span className="font-semibold text-zinc-900">4.9</span>
            <span>({produk.ulasan?.length || 128} ulasan)</span>
          </div>

          <div className="mt-5 flex items-center gap-3 border-b border-pink-50 pb-5">
            <p className="text-2xl font-bold text-zinc-900">
              {formatRupiah(hargaAkhir)}
            </p>
            {hargaCoret && (
              <p className="text-sm text-zinc-400 line-through">
                {formatRupiah(hargaCoret)}
              </p>
            )}
            {adaDiskon && (
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs font-bold">
                Hemat {produk.diskonPersen}%
              </span>
            )}
          </div>

          <div className="mt-5 text-sm leading-relaxed text-zinc-600 text-justify whitespace-pre-line">
            {bacaSelengkapnya
              ? produk.deskripsi
              : produk.deskripsi?.length > 180
                ? `${produk.deskripsi.substring(0, 180)}...`
                : produk.deskripsi}
          </div>
          {produk.deskripsi?.length > 180 && (
            <button
              onClick={() => setBacaSelengkapnya(!bacaSelengkapnya)}
              className="text-soft-pink-600 text-sm font-bold mt-1 w-fit"
            >
              {bacaSelengkapnya ? "Tutup deskripsi" : "Baca selengkapnya"}
            </button>
          )}

          {produk.varian && produk.varian.length > 0 && (
            <div
              className="md:hidden mt-6 border-y border-pink-50 py-3.5 flex items-center justify-between cursor-pointer"
              onClick={() => {
                setTipeAksi("keranjang");
                setShowModal(true);
              }}
            >
              <span className="text-sm font-bold text-zinc-900">
                Pilih Varian
              </span>
              <div className="flex items-center gap-1 text-sm text-zinc-500">
                <span>
                  {varianAktif
                    ? `${varianAktif.ukuran}, ${varianAktif.warna}`
                    : "Pilih Varian"}
                </span>
                <ChevronRight size={18} />
              </div>
            </div>
          )}

          <div className="hidden md:block mt-6 border-t border-pink-50 pt-6">
            {produk.varian && produk.varian.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-bold text-zinc-900 mb-3">
                  Pilih varian
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {produk.varian.map((v: any, idx: number) => (
                    <button
                      key={v.id}
                      onClick={() => handlePilihVarian(v, idx)}
                      className={`px-4 py-3 text-sm rounded-xl border flex flex-col items-start transition-all text-left ${
                        varianAktif?.id === v.id
                          ? "border-soft-pink-500 bg-soft-pink-50/50 text-soft-pink-700 font-bold shadow-sm"
                          : "border-zinc-200 text-zinc-600 hover:border-soft-pink-300 hover:bg-zinc-50"
                      }`}
                    >
                      <span className="w-full truncate">
                        {v.ukuran} &middot; {v.warna}
                      </span>
                      <span
                        className={`text-[10px] mt-1 ${varianAktif?.id === v.id ? "font-bold" : "font-normal opacity-70"}`}
                      >
                        Sisa Stok: {v.stok}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-8">
              <p className="text-sm font-bold text-zinc-900 mb-3">Jumlah</p>
              <div className="flex items-center gap-4 w-fit border border-zinc-200 rounded-full px-4 py-2 bg-white">
                <button
                  onClick={kurangJumlah}
                  disabled={jumlah <= 1}
                  className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg outline-none"
                >
                  &minus;
                </button>
                <span className="text-sm font-bold text-zinc-900 w-6 text-center">
                  {jumlah}
                </span>
                <button
                  onClick={tambahJumlah}
                  disabled={jumlah >= maxStok}
                  className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg outline-none"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSubmitDesktop("keranjang")}
                className="flex-1 bg-soft-pink-50 border border-soft-pink-200 text-soft-pink-600 font-bold py-3.5 rounded-xl hover:bg-soft-pink-100 transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Tambah Keranjang
              </button>
              <button
                onClick={() => handleSubmitDesktop("beli")}
                className="flex-1 bg-soft-pink-600 text-white font-bold py-3.5 rounded-xl hover:bg-soft-pink-700 transition shadow-md"
              >
                Beli Sekarang
              </button>
            </div>
          </div>

          <section className="mt-8 rounded-2xl border border-pink-100 bg-zinc-50/50 p-5 md:p-7">
            <h2 className="font-semibold text-zinc-900">Ulasan pelanggan</h2>
            <div className="mt-4 space-y-4">
              {[
                "Potongannya rapi dan warnanya cantik di kulit.",
                "Bahannya adem, cocok dipakai seharian.",
                "Pengiriman cepat dan packing-nya aman.",
              ].map((ulasan, idx) => (
                <div
                  key={idx}
                  className="border-b border-pink-50 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex gap-1 text-soft-pink-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} className="fill-current" />
                    ))}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-zinc-600">
                    {ulasan}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-3 px-4 flex items-center gap-3 z-[90] pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)]">
        <button className="flex flex-col items-center justify-center text-zinc-500 hover:text-soft-pink-600 px-2 transition-colors">
          <MessageCircle size={22} />
          <span className="text-[9px] font-bold mt-1">Chat</span>
        </button>
        <button
          onClick={() => {
            setTipeAksi("keranjang");
            setShowModal(true);
          }}
          className="flex-1 bg-soft-pink-50 text-soft-pink-600 font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-sm border border-soft-pink-200 active:scale-95 transition-transform"
        >
          <ShoppingBag size={18} /> Keranjang
        </button>
        <button
          onClick={() => {
            setTipeAksi("beli");
            setShowModal(true);
          }}
          className="flex-1 bg-soft-pink-600 text-white font-bold py-3 rounded-xl shadow-md active:scale-95 transition-transform"
        >
          Beli Sekarang
        </button>
      </div>

      {showModal && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-[99998] md:hidden transition-opacity"
            onClick={() => setShowModal(false)}
          />
          <div className="fixed bottom-0 left-0 w-full bg-white rounded-t-3xl z-[99999] flex flex-col max-h-[85vh] md:hidden animate-in slide-in-from-bottom-full duration-300 shadow-[0_-20px_40px_-10px_rgba(0,0,0,0.2)]">
            <div className="p-4 flex gap-4 relative border-b border-pink-50">
              <div className="relative -mt-10 h-28 w-28 shrink-0 rounded-xl border-4 border-white bg-white shadow-md overflow-hidden">
                <Image
                  src={produk.fotoUtama || "/logo-kkf.jpeg"}
                  fill
                  sizes="112px"
                  className="object-cover"
                  alt="Varian"
                />
              </div>

              <div className="pt-2 pr-6">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-xl font-bold text-soft-pink-600">
                    {formatRupiah(hargaAkhir)}
                  </p>
                  {adaDiskon && (
                    <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px] font-bold">
                      Hemat {produk.diskonPersen}%
                    </span>
                  )}
                </div>
                {hargaCoret && (
                  <p className="text-xs text-zinc-400 line-through">
                    {formatRupiah(hargaCoret)}
                  </p>
                )}
                <p className="text-sm text-zinc-500 mt-1">
                  Sisa Stok: {maxStok}
                </p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 bg-zinc-100 rounded-full p-1.5 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-6">
              {produk.varian && produk.varian.length > 0 && (
                <div>
                  <p className="text-sm font-bold text-zinc-900 mb-3">
                    Varian Tersedia
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {produk.varian.map((v: any, idx: number) => (
                      <button
                        key={v.id}
                        onClick={() => handlePilihVarian(v, idx)}
                        className={`px-4 py-2.5 text-sm rounded-xl border transition-all ${
                          varianAktif?.id === v.id
                            ? "border-soft-pink-500 bg-soft-pink-50 text-soft-pink-700 font-bold shadow-sm"
                            : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                        }`}
                      >
                        {v.ukuran} - {v.warna}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-sm font-bold text-zinc-900 mb-3">
                  Jumlah Pembelian
                </p>
                <div className="flex items-center gap-4 w-fit border border-zinc-200 rounded-full px-4 py-2 bg-white">
                  <button
                    onClick={kurangJumlah}
                    disabled={jumlah <= 1}
                    className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg outline-none"
                  >
                    &minus;
                  </button>
                  <span className="text-sm font-bold text-zinc-900 w-6 text-center">
                    {jumlah}
                  </span>
                  <button
                    onClick={tambahJumlah}
                    disabled={jumlah >= maxStok}
                    className="text-zinc-500 hover:text-soft-pink-600 disabled:opacity-50 text-lg outline-none"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-pink-50 pb-[env(safe-area-inset-bottom)]">
              <button
                onClick={handleSubmitModal}
                className="w-full bg-soft-pink-600 text-white font-bold py-3.5 rounded-xl shadow-md active:bg-soft-pink-700 transition"
              >
                {tipeAksi === "keranjang"
                  ? "Masukkan Keranjang"
                  : "Beli Sekarang"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
