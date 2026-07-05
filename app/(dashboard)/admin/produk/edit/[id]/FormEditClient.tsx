"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Video,
  Camera,
} from "lucide-react";
import { uploadFotoProduk, uploadVideoProduk } from "@/lib/supabase";
import { ekstrakWarnaGambar } from "@/lib/colorExtractor";
import { compressImage } from "@/lib/imageCompressor";

export default function FormEditClient({ produkAwal }: { produkAwal: any }) {
  const router = useRouter();

  const [judul, setJudul] = useState(produkAwal.nama);
  const [kategori, setKategori] = useState(produkAwal.kategori?.nama || "");
  const [deskripsi, setDeskripsi] = useState(produkAwal.deskripsi || "");

  const formatRibuan = (nilai: string) => {
    const raw = nilai.replace(/\D/g, "");
    return raw.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const [hargaNormal, setHargaNormal] = useState(
    formatRibuan(produkAwal.harga.toString()),
  );
  const [costPrice, setCostPrice] = useState(
    formatRibuan(produkAwal.costPrice?.toString() || "0"),
  );
  const [diskon, setDiskon] = useState(
    produkAwal.diskonPersen?.toString() || "0",
  );

  const [daftarVarian, setDaftarVarian] = useState(
    produkAwal.varian.map((v: any) => ({
      id: v.id,
      ukuran: v.ukuran,
      warna: v.warna,
      stok: formatRibuan(v.stok.toString()),
    })),
  );

  const [fileFoto, setFileFoto] = useState<File[]>([]);
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [teksLoading, setTeksLoading] = useState("Simpan Perubahan Produk");
  const [notifikasi, setNotifikasi] = useState({
    terbuka: false,
    pesan: "",
    tipe: "sukses",
  });

  const [riwayatKategori, setRiwayatKategori] = useState<string[]>([]);
  const [showDropdownKategori, setShowDropdownKategori] = useState(false);

  const listKategoriAman = Array.isArray(riwayatKategori)
    ? riwayatKategori
    : [];
  const kategoriTerfilter = listKategoriAman.filter((k: string) =>
    k.toLowerCase().includes(kategori.toLowerCase()),
  );

  // 🔥 UBAH API SUMBER DATA: BUKAN DARI ANALITIK, TAPI DARI DAFTAR PRODUK AKTIF 🔥
  useEffect(() => {
    const fetchKategori = async () => {
      try {
        const res = await fetch("/api/admin/produk");
        if (res.ok) {
          const produkLive = await res.json();
          // Ekstrak nama kategori dari produk yang beneran masih ada
          const kategoriAktifBeneran = Array.from(
            new Set(
              produkLive
                .map((p: any) => p.kategori?.nama || p.kategori)
                .filter(Boolean),
            ),
          ) as string[];
          setRiwayatKategori(kategoriAktifBeneran);
        }
      } catch (e) {
        console.error("Gagal narik kategori", e);
      }
    };
    fetchKategori();
  }, []);

  const tampilkanNotifikasi = (
    pesan: string,
    tipe: "sukses" | "gagal" = "sukses",
  ) => {
    setNotifikasi({ terbuka: true, pesan, tipe });
    setTimeout(
      () => setNotifikasi((prev) => ({ ...prev, terbuka: false })),
      3500,
    );
  };

  const tambahBarisVarian = () =>
    setDaftarVarian([
      ...daftarVarian,
      { id: "", ukuran: "", warna: "", stok: "" },
    ]);
  const hapusBarisVarian = (index: number) =>
    setDaftarVarian(daftarVarian.filter((_: any, i: number) => i !== index));
  const updateVarian = (index: number, field: string, value: string) => {
    const varianBaru = [...daftarVarian];
    varianBaru[index] = {
      ...varianBaru[index],
      [field]: field === "stok" ? formatRibuan(value) : value,
    };
    setDaftarVarian(varianBaru);
  };

  const simpanPerubahan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangMenyimpan(true);

    try {
      let fotoUtamaBaru = produkAwal.fotoUtama;
      let galeriFotoBaru = produkAwal.galeriFoto;
      let videoUrlBaru = produkAwal.videoUrl;

      if (fileFoto.length > 0) {
        setTeksLoading("Mengunggah Foto Baru ke Supabase...");
        const listUrlFoto = [];
        for (const file of fileFoto) {
          const url = await uploadFotoProduk(file);
          listUrlFoto.push(url);
        }
        fotoUtamaBaru = listUrlFoto[0];
        galeriFotoBaru = listUrlFoto;
      }

      if (fileVideo) {
        setTeksLoading("Mengunggah Video Baru ke Supabase...");
        videoUrlBaru = await uploadVideoProduk(fileVideo);
      }

      setTeksLoading("Menyimpan Perubahan ke Database...");

      const hargaMurni = parseInt(hargaNormal.replace(/\./g, "") || "0", 10);
      const costPriceMurni = parseInt(costPrice.replace(/\./g, "") || "0", 10);
      const diskonMurni = parseInt(diskon.replace(/\./g, "") || "0", 10);
      const varianMurni = daftarVarian.map((v: any) => ({
        id: v.id || undefined,
        ukuran: v.ukuran,
        warna: v.warna,
        stok: parseInt(v.stok.replace(/\./g, "") || "0", 10),
      }));

      const respons = await fetch(`/api/admin/produk/${produkAwal.id}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          judul,
          kategori,
          hargaNormal: hargaMurni,
          costPrice: costPriceMurni,
          diskon: diskonMurni,
          deskripsi,
          daftarVarian: varianMurni,
          fotoUtama: fotoUtamaBaru,
          galeriFoto: galeriFotoBaru,
          videoUrl: videoUrlBaru,
        }),
      });

      if (!respons.ok) {
        const errData = await respons.json();
        throw new Error(errData.pesan || "Gagal memperbarui produk.");
      }

      tampilkanNotifikasi(
        "MANTAP BRE! Perubahan produk berhasil disimpan!",
        "sukses",
      );
      setTimeout(() => {
        router.push("/admin");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      tampilkanNotifikasi("ERROR: " + err.message, "gagal");
      setSedangMenyimpan(false);
      setTeksLoading("Simpan Perubahan Produk");
    }
  };

  return (
    <>
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center gap-4 mb-6 border-b border-pink-100 pb-4">
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="text-zinc-500 hover:text-zinc-900 font-bold flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg transition"
          >
            <ArrowLeft size={16} /> Kembali
          </button>
          <h3 className="text-xl font-bold text-zinc-900">
            Edit Produk: {produkAwal.nama}
          </h3>
        </div>

        <form onSubmit={simpanPerubahan} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              Judul Produk
            </label>
            <input
              type="text"
              required
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <div className="relative">
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                Kategori
              </label>
              <input
                type="text"
                required
                autoComplete="new-password" // JURUS ANTI CHROME CACHE
                value={kategori}
                onChange={(e) => {
                  setKategori(e.target.value);
                  setShowDropdownKategori(true);
                }}
                onFocus={() => setShowDropdownKategori(true)}
                onBlur={() =>
                  setTimeout(() => setShowDropdownKategori(false), 200)
                }
                className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
                placeholder="Ketik/Pilih dari riwayat..."
              />
              {showDropdownKategori && (
                <ul className="absolute z-50 w-full mt-1 bg-white border border-zinc-200 rounded-xl shadow-lg max-h-48 overflow-y-auto py-1 animate-in fade-in slide-in-from-top-2">
                  {kategoriTerfilter.length > 0
                    ? kategoriTerfilter.map((kat: string) => (
                        <li
                          key={kat}
                          onClick={() => {
                            setKategori(kat);
                            setShowDropdownKategori(false);
                          }}
                          className="px-4 py-2.5 text-sm text-zinc-700 hover:bg-soft-pink-50 hover:text-soft-pink-600 font-medium cursor-pointer transition-colors"
                        >
                          {kat}
                        </li>
                      ))
                    : kategori.trim() === "" && (
                        <li className="px-4 py-2.5 text-sm text-zinc-400 italic text-center">
                          Ketik untuk mencari...
                        </li>
                      )}

                  {kategori.trim() !== "" &&
                    !listKategoriAman.some(
                      (k: string) =>
                        k.toLowerCase() === kategori.trim().toLowerCase(),
                    ) && (
                      <li
                        onClick={() => {
                          setKategori(kategori.trim());
                          setShowDropdownKategori(false);
                        }}
                        className="px-4 py-2.5 text-sm font-bold text-soft-pink-600 hover:bg-soft-pink-50 cursor-pointer border-t border-pink-50 flex items-center gap-2"
                      >
                        <Plus size={16} /> Buat Kategori: "{kategori.trim()}"
                      </li>
                    )}
                </ul>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                Harga Jual
              </label>
              <div className="relative w-full">
                <span className="absolute left-4 top-3.5 text-sm font-bold text-zinc-400">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={hargaNormal}
                  onChange={(e) => setHargaNormal(formatRibuan(e.target.value))}
                  className="w-full border border-zinc-300 py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                HPP (Modal)
              </label>
              <div className="relative w-full">
                <span className="absolute left-4 top-3.5 text-sm font-bold text-zinc-400">
                  Rp
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  required
                  value={costPrice}
                  onChange={(e) => setCostPrice(formatRibuan(e.target.value))}
                  className="w-full border border-zinc-300 py-3 pl-11 pr-4 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                Diskon Promo (%)
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={diskon}
                onChange={(e) => setDiskon(formatRibuan(e.target.value))}
                className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              Deskripsi & Bahan
            </label>
            <textarea
              required
              rows={4}
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 transition"
            />
          </div>

          <div className="rounded-xl border border-pink-100 bg-soft-pink-50/40 p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bold text-zinc-900">Varian & Stok Produk</h2>
              <button
                type="button"
                onClick={tambahBarisVarian}
                className="flex items-center gap-2 rounded-lg bg-soft-pink-100 px-3 py-1.5 text-sm font-bold text-soft-pink-700 hover:bg-soft-pink-200 transition"
              >
                <Plus size={16} /> Tambah Varian
              </button>
            </div>

            <div className="space-y-3">
              {daftarVarian.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-end gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100"
                >
                  <div className="w-full md:flex-1">
                    <label className="block text-xs font-bold text-zinc-600 mb-1">
                      Ukuran
                    </label>
                    <input
                      type="text"
                      required
                      value={item.ukuran}
                      onChange={(e) =>
                        updateVarian(index, "ukuran", e.target.value)
                      }
                      className="w-full border border-zinc-300 p-2.5 rounded-lg focus:outline-none focus:border-soft-pink-500 text-sm"
                    />
                  </div>
                  <div className="w-full md:flex-1">
                    <label className="block text-xs font-bold text-zinc-600 mb-1">
                      Warna (RGB/Hex)
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        required
                        value={item.warna?.startsWith('#') ? item.warna : '#000000'}
                        onChange={(e) =>
                          updateVarian(index, "warna", e.target.value)
                        }
                        className="h-10 w-10 shrink-0 cursor-pointer rounded-lg border border-zinc-300 p-0.5"
                      />
                      <input
                        type="text"
                        required
                        value={item.warna}
                        onChange={(e) =>
                          updateVarian(index, "warna", e.target.value)
                        }
                        className="w-full border border-zinc-300 p-2.5 rounded-lg focus:outline-none focus:border-soft-pink-500 text-sm"
                        placeholder="#FFC0CB"
                      />
                      <button
                        type="button"
                        onClick={() => document.getElementById(`scan-warna-edit-${index}`)?.click()}
                        className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-zinc-700 transition"
                        title="Scan dari Foto"
                      >
                        <Camera size={18} />
                      </button>
                      <input
                        type="file"
                        id={`scan-warna-edit-${index}`}
                        className="hidden"
                        accept="image/*"
                        onChange={async (e) => {
                          if (e.target.files && e.target.files[0]) {
                            try {
                              const hex = await ekstrakWarnaGambar(e.target.files[0]);
                              updateVarian(index, "warna", hex);
                            } catch (err) {
                              console.error("Gagal scan warna", err);
                            }
                            // Reset input agar bisa discan ulang jika gambar sama
                            e.target.value = "";
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-full md:w-24">
                    <label className="block text-xs font-bold text-zinc-600 mb-1">
                      Stok
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={item.stok}
                      onChange={(e) =>
                        updateVarian(index, "stok", e.target.value)
                      }
                      className="w-full border border-zinc-300 p-2.5 rounded-lg focus:outline-none focus:border-soft-pink-500 text-sm"
                    />
                  </div>
                  {daftarVarian.length > 1 && (
                    <button
                      type="button"
                      onClick={() => hapusBarisVarian(index)}
                      className="w-full md:w-[42px] h-[42px] flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition mt-2 md:mt-0"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
            <div className="p-4 border-2 border-dashed border-pink-200 rounded-xl bg-pink-50/50 flex gap-4 items-center">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Foto Saat Ini
                </span>
                <img
                  src={produkAwal.fotoUtama || "/logo-kkf.jpeg"}
                  alt="Foto Produk"
                  className="h-16 w-16 object-cover rounded-xl border border-pink-200 shadow-sm bg-white"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-zinc-700 mb-1 cursor-pointer">
                  Ganti Foto (Opsional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files) {
                      const rawFiles = Array.from(e.target.files);
                      
                      // Kompres semua gambar secara paralel
                      const compressedFiles = await Promise.all(
                        rawFiles.map(file => compressImage(file))
                      );
                      
                      setFileFoto(compressedFiles);
                      
                      if (compressedFiles.length > 0) {
                        try {
                          const hex = await ekstrakWarnaGambar(compressedFiles[0]);
                          const varianBaru = [...daftarVarian];
                          // Otomatis isi warna varian pertama jika kosong atau timpa saja untuk kemudahan
                          if (varianBaru.length > 0) {
                            varianBaru[0].warna = hex;
                            setDaftarVarian(varianBaru);
                          }
                        } catch (err) {
                          console.error("Gagal ekstrak warna", err);
                        }
                      }
                    }
                  }}
                  className="w-full text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:font-bold file:bg-soft-pink-100 file:text-soft-pink-700 hover:file:bg-soft-pink-200 transition cursor-pointer"
                />
              </div>
            </div>

            <div className="p-4 border-2 border-dashed border-sky-200 rounded-xl bg-sky-50/50 flex gap-4 items-center">
              <div className="shrink-0 flex flex-col items-center gap-2">
                <span className="text-[10px] font-bold text-zinc-500 uppercase">
                  Video Saat Ini
                </span>
                <div className="h-16 w-16 bg-black rounded-xl border border-sky-200 shadow-sm overflow-hidden flex items-center justify-center relative">
                  {produkAwal.videoUrl ? (
                    <video
                      src={produkAwal.videoUrl}
                      className="w-full h-full object-cover opacity-70"
                      muted
                      playsInline
                    />
                  ) : (
                    <Video size={20} className="text-zinc-600 opacity-50" />
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-zinc-700 mb-1 cursor-pointer">
                  Ganti Video (Max 15MB)
                </label>
                <input
                  type="file"
                  accept="video/mp4,video/webm"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      if (file.size > 15 * 1024 * 1024) {
                        tampilkanNotifikasi(
                          "Ukuran video maksimal 15MB bos!",
                          "gagal",
                        );
                        e.target.value = "";
                        return;
                      }
                      setFileVideo(file);
                    }
                  }}
                  className="w-full text-[10px] text-zinc-500 file:mr-2 file:py-1 file:px-3 file:rounded-md file:border-0 file:font-bold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 transition cursor-pointer"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={sedangMenyimpan}
            className="w-full bg-soft-pink-600 hover:bg-soft-pink-700 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center disabled:bg-zinc-400"
          >
            {sedangMenyimpan ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : null}
            {teksLoading}
          </button>
        </form>
      </div>

      {notifikasi.terbuka && (
        <div className="fixed top-20 right-5 left-5 md:left-auto md:bottom-5 md:top-auto z-[9999] bg-zinc-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-zinc-800 animate-in slide-in-from-top-5 md:slide-in-from-bottom-5 duration-300">
          {notifikasi.tipe === "sukses" ? (
            <CheckCircle size={18} className="text-emerald-400" />
          ) : (
            <AlertTriangle size={18} className="text-red-400" />
          )}
          <p className="text-xs font-bold tracking-wide">{notifikasi.pesan}</p>
        </div>
      )}
    </>
  );
}
