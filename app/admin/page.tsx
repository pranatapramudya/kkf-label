"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { uploadFotoProduk, uploadVideoProduk } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Barcode from "react-barcode";
import {
  CircleDollarSign,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
  RefreshCw,
  ArrowLeft,
  Plus,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  BarChart2,
  Package,
  ShoppingCart,
  Headphones,
  Megaphone,
  MousePointerClick,
  ShoppingCart as CartIcon,
  Printer,
  FileText,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  LogOut,
} from "lucide-react";
import { formatRupiah } from "@/lib/format";
import TabelProduk from "./produk/TabelProduk";
import PromosiTab from "@/components/admin/PromosiTab";
import { useClerk, UserButton } from "@clerk/nextjs";

// ==========================================
// 🔥 KOMPONEN DROPDOWN MEWAH
// ==========================================
const opsiBulanGlobal = [
  { value: "-1", label: "Semua Bulan" },
  ...[
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ].map((b, i) => ({ value: i.toString(), label: b })),
];

function DropdownMewah({
  value,
  options,
  onChange,
  placeholder,
  widthClass = "w-full",
}: any) {
  const [buka, setBuka] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const klikLuar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setBuka(false);
    };
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  return (
    <div className={`relative ${widthClass} shrink-0`} ref={ref}>
      <button
        onClick={() => setBuka(!buka)}
        className="w-full flex items-center justify-between bg-white border border-zinc-200 text-sm font-bold text-zinc-700 px-4 py-2.5 rounded-xl hover:border-soft-pink-300 focus:outline-none transition shadow-sm"
      >
        <span className="truncate">
          {options.find((o: any) => o.value === value)?.label || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform text-zinc-500 ${buka ? "rotate-180" : ""}`}
        />
      </button>

      {buka && (
        <ul className="absolute z-[999] mt-2 w-full bg-white border border-pink-100 rounded-xl shadow-xl max-h-56 overflow-y-auto py-1 animate-in fade-in zoom-in-95">
          {options.map((opt: any) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setBuka(false);
              }}
              className={`px-4 py-2.5 text-sm cursor-pointer transition flex items-center justify-between ${value === opt.value ? "bg-soft-pink-50 text-soft-pink-700 font-bold" : "text-zinc-600 hover:bg-zinc-50"}`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ==========================================
// 1. KOMPONEN TAMBAH PRODUK
// ==========================================
function FormTambahProduk({
  onKembali,
  onSukses,
  onError,
  riwayatKategori,
}: any) {
  const [judul, setJudul] = useState("");
  const [kategori, setKategori] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [hargaNormal, setHargaNormal] = useState("");
  const [diskon, setDiskon] = useState("");
  const [daftarVarian, setDaftarVarian] = useState([
    { ukuran: "", warna: "", stok: "" },
  ]);
  const [fileFoto, setFileFoto] = useState<File[]>([]);
  const [fileVideo, setFileVideo] = useState<File | null>(null);
  const [sedangMenyimpan, setSedangMenyimpan] = useState(false);
  const [teksLoading, setTeksLoading] = useState("Simpan & Publish Produk");
  const [showDropdownKategori, setShowDropdownKategori] = useState(false);

  const listKategoriAman = Array.isArray(riwayatKategori)
    ? riwayatKategori
    : [];
  const kategoriTerfilter = listKategoriAman.filter((k: string) =>
    k.toLowerCase().includes(kategori.toLowerCase()),
  );

  const formatRibuan = (nilai: string) =>
    nilai.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const tambahBarisVarian = () =>
    setDaftarVarian([...daftarVarian, { ukuran: "", warna: "", stok: "" }]);
  const hapusBarisVarian = (index: number) =>
    setDaftarVarian(daftarVarian.filter((_, i) => i !== index));
  const updateVarian = (index: number, field: string, value: string) => {
    const varianBaru = [...daftarVarian];
    varianBaru[index] = {
      ...varianBaru[index],
      [field]: field === "stok" ? formatRibuan(value) : value,
    };
    setDaftarVarian(varianBaru);
  };

  const simpanProduk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fileFoto.length === 0)
      return onError("Wajib pilih minimal 1 foto produk!");
    setSedangMenyimpan(true);
    setTeksLoading("Mengunggah Media ke Supabase...");

    try {
      const listUrlFoto = [];
      for (const file of fileFoto) {
        const url = await uploadFotoProduk(file);
        listUrlFoto.push(url);
      }

      let urlVideo = null;
      if (fileVideo) {
        setTeksLoading("Mengunggah Video...");
        urlVideo = await uploadVideoProduk(fileVideo);
      }

      setTeksLoading("Menyimpan ke Database...");
      const hargaMurni = parseInt(hargaNormal.replace(/\./g, "") || "0", 10);
      const diskonMurni = parseInt(diskon.replace(/\./g, "") || "0", 10);
      const varianMurni = daftarVarian.map((v) => ({
        ...v,
        stok: parseInt(v.stok.replace(/\./g, "") || "0", 10),
      }));

      const respons = await fetch("/api/admin/produk", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          judul,
          kategori,
          hargaNormal: hargaMurni,
          diskon: diskonMurni,
          deskripsi,
          daftarVarian: varianMurni,
          fotoUtama: listUrlFoto[0],
          galeriFoto: listUrlFoto,
          videoUrl: urlVideo,
        }),
      });

      if (!respons.ok) throw new Error("Gagal menyimpan ke database.");
      onSukses();
    } catch (galat: any) {
      onError("Gagal Simpan: " + galat.message);
    } finally {
      setSedangMenyimpan(false);
      setTeksLoading("Simpan & Publish Produk");
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-pink-100 animate-in fade-in zoom-in-95 duration-200 mb-20 md:mb-0">
      <div className="flex items-center gap-4 mb-6 border-b border-pink-100 pb-4">
        <button
          type="button"
          onClick={onKembali}
          className="text-zinc-500 hover:text-zinc-900 font-bold flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-3 py-1.5 rounded-lg transition"
        >
          <ArrowLeft size={16} /> Kembali
        </button>
        <h3 className="text-xl font-bold text-zinc-900">Form Tambah Produk</h3>
      </div>
      <form onSubmit={simpanProduk} className="space-y-6">
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
            placeholder="Contoh: Dress Vintage Soft Pink"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="relative">
            <label className="block text-sm font-bold text-zinc-700 mb-1.5">
              Kategori
            </label>
            <input
              type="text"
              required
              autoComplete="new-password"
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
              placeholder="Ketik/Pilih kategori..."
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
              Harga Normal
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
            {daftarVarian.map((item, index) => (
              <div
                key={index}
                className="flex items-end gap-3 rounded-xl bg-white p-4 shadow-sm border border-zinc-100"
              >
                <div className="flex-1">
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
                    placeholder="S, M, L"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-zinc-600 mb-1">
                    Warna
                  </label>
                  <input
                    type="text"
                    required
                    value={item.warna}
                    onChange={(e) =>
                      updateVarian(index, "warna", e.target.value)
                    }
                    className="w-full border border-zinc-300 p-2.5 rounded-lg focus:outline-none focus:border-soft-pink-500 text-sm"
                    placeholder="Soft Pink"
                  />
                </div>
                <div className="w-24">
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
                    placeholder="0"
                  />
                </div>
                {daftarVarian.length > 1 && (
                  <button
                    type="button"
                    onClick={() => hapusBarisVarian(index)}
                    className="h-[42px] w-[42px] flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 mb-6">
          <div className="p-4 border-2 border-dashed border-pink-200 rounded-xl bg-pink-50/50">
            <label className="block text-sm font-bold text-zinc-700 mb-2 cursor-pointer">
              Upload Foto (Wajib, bisa multi)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              required
              onChange={(e) => {
                if (e.target.files) setFileFoto(Array.from(e.target.files));
              }}
              className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-soft-pink-100 file:text-soft-pink-700 cursor-pointer"
            />
          </div>
          <div className="p-4 border-2 border-dashed border-sky-200 rounded-xl bg-sky-50/50">
            <label className="block text-sm font-bold text-zinc-700 mb-2 cursor-pointer">
              Upload Video (Opsional, Max 15MB)
            </label>
            <input
              type="file"
              accept="video/mp4,video/webm"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  const file = e.target.files[0];
                  if (file.size > 15 * 1024 * 1024) {
                    onError("Ukuran video maksimal 15MB bos!");
                    e.target.value = "";
                    return;
                  }
                  setFileVideo(file);
                }
              }}
              className="w-full text-xs file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-bold file:bg-sky-100 file:text-sky-700 cursor-pointer"
            />
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
  );
}

// ==========================================
// 2. KOMPONEN TABEL PESANAN
// ==========================================
function TabelPesanan({ tampilkanNotifikasi }: { tampilkanNotifikasi?: any }) {
  const [daftarPesanan, setDaftarPesanan] = useState<any[]>([]);
  const [sedangMemuat, setSedangMemuat] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  const [pesananDiedit, setPesananDiedit] = useState<any>(null);
  const [formEdit, setFormEdit] = useState({
    statusPesanan: "",
    ekspedisi: "",
    nomorResi: "",
  });
  const [sedangUpdate, setSedangUpdate] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemPerPage = 10;

  const tahunSekarang = new Date().getFullYear();
  const [bulanExport, setBulanExport] = useState("semua");
  const [tahunExport, setTahunExport] = useState(tahunSekarang.toString());

  const opsiBulan = [
    { value: "semua", label: "Semua Bulan" },
    ...[
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ].map((b, i) => ({ value: i.toString(), label: b })),
  ];

  const opsiTahun = Array.from({ length: 5 }, (_, i) => ({
    value: (tahunSekarang - i).toString(),
    label: (tahunSekarang - i).toString(),
  }));

  const fetchPesanan = async () => {
    setSedangMemuat(true);
    try {
      const res = await fetch("/api/admin/pesanan");
      if (res.ok) setDaftarPesanan(await res.json());
    } catch (e) {
      console.error("Gagal memuat pesanan", e);
    } finally {
      setSedangMemuat(false);
    }
  };

  useEffect(() => {
    fetchPesanan();
  }, []);

  const totalPages = Math.ceil(daftarPesanan.length / itemPerPage);
  const dataTampil = daftarPesanan.slice(
    (currentPage - 1) * itemPerPage,
    currentPage * itemPerPage,
  );

  const exportCSV = () => {
    let dataDifilter = daftarPesanan.filter((p) => {
      const tgl = new Date(p.dibuatPada);
      const matchTahun = tgl.getFullYear().toString() === tahunExport;
      const matchBulan =
        bulanExport === "semua"
          ? true
          : tgl.getMonth() === parseInt(bulanExport);
      return matchTahun && matchBulan;
    });

    if (dataDifilter.length === 0)
      return alert("Belum ada data pesanan di periode ini.");

    const headers = [
      "No Invoice",
      "Pelanggan",
      "Waktu Transaksi",
      "Total Rupiah",
      "Status",
      "Kurir",
      "Resi",
    ];
    const csvData = [
      headers.join(","),
      ...dataDifilter.map(
        (p) =>
          `${p.kodePesanan},"${p.namaPenerima}",${new Date(p.dibuatPada).toLocaleString("id-ID").replace(/,/g, "")},${p.total},${p.statusPesanan},${p.ekspedisi || "-"},${p.nomorResi || "-"}`,
      ),
    ].join("\n");

    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const namaBulan =
      bulanExport === "semua"
        ? "Semua"
        : opsiBulan.find((o) => o.value === bulanExport)?.label;
    link.setAttribute("download", `Rekap_KKF_${namaBulan}_${tahunExport}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const bukaModalEdit = (p: any) => {
    setPesananDiedit(p);
    setFormEdit({
      statusPesanan: p.statusPesanan,
      ekspedisi: p.ekspedisi || "",
      nomorResi: p.nomorResi || "",
    });
  };

  const simpanUpdatePesanan = async (e: React.FormEvent) => {
    e.preventDefault();
    setSedangUpdate(true);
    try {
      const res = await fetch(`/api/admin/pesanan/${pesananDiedit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEdit),
      });

      if (!res.ok) throw new Error("Gagal menyimpan perubahan ke database.");

      if (tampilkanNotifikasi)
        tampilkanNotifikasi(
          "Mantap! Status pesanan berhasil diupdate.",
          "sukses",
        );
      else alert("Status pesanan berhasil diupdate!");

      setPesananDiedit(null);
      fetchPesanan();
    } catch (err: any) {
      if (tampilkanNotifikasi)
        tampilkanNotifikasi("Gagal: " + err.message, "gagal");
      else alert("Gagal update pesanan.");
    } finally {
      setSedangUpdate(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="bg-white p-6 rounded-2xl border border-pink-100 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
          <h3 className="font-bold text-zinc-900 text-lg">Rekapan Transaksi</h3>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-fit">
            <DropdownMewah
              value={bulanExport}
              options={opsiBulan}
              onChange={setBulanExport}
              widthClass="w-full sm:w-40"
            />
            <DropdownMewah
              value={tahunExport}
              options={opsiTahun}
              onChange={setTahunExport}
              widthClass="w-full sm:w-28"
            />
            <button
              onClick={exportCSV}
              className="flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 px-5 py-2.5 rounded-xl hover:bg-emerald-100 transition text-sm w-full sm:w-fit shadow-sm"
            >
              <FileText size={16} /> Export CSV
            </button>
          </div>
        </div>

        {sedangMemuat ? (
          <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
            <Loader2 className="animate-spin text-soft-pink-500" size={24} />
            <p className="text-sm font-medium">Menarik data transaksi...</p>
          </div>
        ) : (
          <div className="overflow-x-auto pb-4">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-pink-100 text-zinc-500">
                  <th className="pb-3 font-semibold px-2 w-10 text-center">
                    No
                  </th>
                  <th className="pb-3 font-semibold px-2">No Invoice</th>
                  <th className="pb-3 font-semibold px-2">Pelanggan</th>
                  <th className="pb-3 font-semibold px-2">Total</th>
                  <th className="pb-3 font-semibold px-2">Status</th>
                  <th className="pb-3 font-semibold px-2 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {dataTampil.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-8 text-zinc-400 font-medium"
                    >
                      Belum ada pesanan masuk
                    </td>
                  </tr>
                ) : (
                  dataTampil.map((p, index) => (
                    <tr
                      key={p.id}
                      className="border-b border-pink-50 last:border-0 hover:bg-pink-50/30 transition-colors"
                    >
                      <td className="py-4 text-center text-zinc-500 font-medium px-2">
                        {(currentPage - 1) * itemPerPage + index + 1}
                      </td>
                      <td className="py-4 font-bold text-zinc-900 px-2">
                        {p.kodePesanan}
                      </td>
                      <td className="py-4 text-zinc-600 px-2">
                        {p.namaPenerima}
                      </td>
                      <td className="py-4 font-bold text-soft-pink-600 px-2">
                        {formatRupiah(p.total)}
                      </td>
                      <td className="py-4 px-2">
                        <span
                          className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${p.statusPesanan === "SELESAI" || p.statusPesanan === "SAMPAI" ? "bg-emerald-100 text-emerald-700" : p.statusPesanan === "DIKIRIM" ? "bg-blue-100 text-blue-700" : p.statusPesanan === "DIBATALKAN" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {p.statusPesanan.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-4 text-right px-2 flex justify-end gap-2">
                        <button
                          onClick={() => bukaModalEdit(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:bg-sky-50 px-3 py-1.5 rounded-lg transition border border-sky-100 shadow-sm"
                        >
                          <Package size={14} /> Proses
                        </button>
                        <button
                          onClick={() => setSelectedInvoice(p)}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-soft-pink-600 hover:bg-soft-pink-50 px-3 py-1.5 rounded-lg transition border border-pink-100 shadow-sm"
                        >
                          <Printer size={14} /> Cetak
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-pink-50 pt-5 mt-2">
                <p className="text-xs text-zinc-500 font-medium">
                  Halaman {currentPage} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 bg-zinc-50 text-zinc-600 rounded-lg hover:bg-zinc-100 disabled:opacity-50 transition border border-zinc-200 shadow-sm"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 bg-zinc-50 text-zinc-600 rounded-lg hover:bg-zinc-100 disabled:opacity-50 transition border border-zinc-200 shadow-sm"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {pesananDiedit && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-pink-100 pb-4 mb-5">
              <div>
                <h3 className="text-lg font-bold text-zinc-900">
                  Proses Pesanan
                </h3>
                <p className="text-xs text-zinc-500 mt-1">
                  {pesananDiedit.kodePesanan}
                </p>
              </div>
              <button
                onClick={() => setPesananDiedit(null)}
                className="text-zinc-400 hover:text-red-500 transition bg-zinc-50 p-2 rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={simpanUpdatePesanan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Status Pesanan
                </label>
                <select
                  required
                  value={formEdit.statusPesanan}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, statusPesanan: e.target.value })
                  }
                  className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm font-medium"
                >
                  <option value="MENUNGGU_PEMBAYARAN">
                    Menunggu Pembayaran
                  </option>
                  <option value="DIBAYAR">Sudah Dibayar</option>
                  <option value="DIPROSES">Sedang Diproses (Dikemas)</option>
                  <option value="DIKIRIM">Dikirim (Dalam Perjalanan)</option>
                  <option value="SAMPAI">Paket Sampai</option>
                  <option value="SELESAI">Selesai (Diterima Pembeli)</option>
                  <option value="DIBATALKAN">Dibatalkan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Kurir / Ekspedisi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SPX, JNT, JNE"
                  value={formEdit.ekspedisi}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, ekspedisi: e.target.value })
                  }
                  className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  Nomor Resi (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SPXID12345678"
                  value={formEdit.nomorResi}
                  onChange={(e) =>
                    setFormEdit({ ...formEdit, nomorResi: e.target.value })
                  }
                  className="w-full border border-zinc-300 p-3 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm font-bold tracking-wide"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPesananDiedit(null)}
                  className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={sedangUpdate}
                  className="flex-1 py-3 font-bold text-white bg-soft-pink-600 rounded-xl shadow-md hover:bg-soft-pink-700 transition flex items-center justify-center gap-2 text-sm disabled:bg-zinc-400"
                >
                  {sedangUpdate ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Simpan Update"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🔥 MODAL LABEL PENGIRIMAN (UKURAN A6 THERMAL + BARCODE) 🔥 */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/80 backdrop-blur-sm p-4 print:p-0 print:bg-white print:block">
          {/* 🔥 SUNTIKAN CSS KHUSUS PRINTER THERMAL A6 🔥 */}
          <style type="text/css" media="print">
            {`
              @page { size: 100mm 150mm; margin: 0; }
              body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
              /* Sembunyikan elemen lain saat nge-print */
              aside, header, nav { display: none !important; }
            `}
          </style>

          <div className="bg-white w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] print:max-h-none print:shadow-none print:w-[100mm] print:h-[148mm] print:m-0 print:p-2">
            <div className="p-4 border-4 border-black print:border-2 print:p-2 flex flex-col h-full bg-white relative">
              {/* 1. KOP RESI & KURIR */}
              <div className="flex justify-between items-start border-b-2 border-black pb-2 mb-2">
                <div>
                  <h2 className="text-xl font-black text-black tracking-widest leading-none">
                    KKF LABEL
                  </h2>
                  <p className="text-[10px] font-bold text-black mt-1 uppercase">
                    INV: {selectedInvoice.kodePesanan}
                  </p>
                </div>
                <div className="text-right">
                  <h3 className="text-2xl font-black text-black leading-none uppercase">
                    {selectedInvoice.ekspedisi || "STD"}
                  </h3>
                  <p className="text-[10px] font-bold bg-black text-white px-2 py-0.5 inline-block mt-1">
                    CASHLESS
                  </p>
                </div>
              </div>

              {/* 2. BARCODE AREA */}
              <div className="flex flex-col items-center justify-center border-b-2 border-black pb-2 mb-2">
                <div className="w-full flex justify-center overflow-hidden scale-90 print:scale-100">
                  <Barcode
                    value={
                      selectedInvoice.nomorResi || selectedInvoice.kodePesanan
                    }
                    height={45}
                    width={1.8}
                    displayValue={false}
                    margin={0}
                    background="#ffffff"
                  />
                </div>
                <p className="text-sm font-black tracking-widest mt-1 uppercase">
                  {selectedInvoice.nomorResi || "RESI MENYUSUL"}
                </p>
              </div>

              {/* 3. ALAMAT PENERIMA & PENGIRIM */}
              <div className="flex-1">
                <div className="mb-2 border-b-2 border-black pb-2">
                  <p className="text-[10px] font-black text-black uppercase bg-zinc-200 w-fit px-1 mb-1">
                    Penerima:
                  </p>
                  <p className="font-black text-black text-sm uppercase leading-tight">
                    {selectedInvoice.namaPenerima}
                  </p>
                  <p className="text-[11px] font-bold text-black mt-0.5">
                    {selectedInvoice.teleponPenerima}
                  </p>
                  <p className="text-[11px] text-black mt-0.5 font-semibold leading-snug line-clamp-3">
                    {selectedInvoice.alamatLengkap}, {selectedInvoice.kota},{" "}
                    {selectedInvoice.provinsi}
                  </p>
                </div>

                <div className="mb-2 border-b-2 border-black pb-2 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black text-black uppercase bg-zinc-200 w-fit px-1 mb-1">
                      Pengirim:
                    </p>
                    <p className="font-bold text-black text-xs uppercase leading-tight">
                      KKF Label
                    </p>
                    {/* 🔥 FIX: Nomor HP lu udah dipatenkan di sini 🔥 */}
                    <p className="text-[10px] font-semibold text-black">
                      085117490449
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold">Batas Kirim:</p>
                    <p className="text-[10px] font-black">
                      {new Date(selectedInvoice.dibuatPada).toLocaleDateString(
                        "id-ID",
                      )}
                    </p>
                  </div>
                </div>

                {/* 4. RINCIAN BARANG */}
                <div>
                  <p className="text-[10px] font-black text-black uppercase bg-zinc-200 w-fit px-1 mb-1">
                    Isi Paket:
                  </p>
                  <div className="text-[10px] font-bold text-black leading-snug">
                    {selectedInvoice.item?.map((itm: any, i: number) => (
                      <div key={i} className="flex gap-1 mb-1">
                        <span className="shrink-0">{itm.jumlah}x</span>
                        <span className="uppercase truncate">
                          {itm.namaProduk} ({itm.ukuran || "-"},{" "}
                          {itm.warna || "-"})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tanda Tangan / Note */}
              <div className="mt-auto pt-2 text-center border-t border-dashed border-black">
                <p className="text-[8px] font-bold uppercase">
                  Terima kasih telah berbelanja di KKF Label
                </p>
              </div>
            </div>

            {/* TOMBOL AKSI - HILANG SAAT DI-PRINT */}
            <div className="mt-4 flex gap-3 print:hidden p-4">
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-3 font-bold text-zinc-600 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 font-bold text-white bg-black rounded-xl shadow-md hover:bg-zinc-800 transition flex items-center justify-center gap-2"
              >
                Cetak A6
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. HALAMAN UTAMA ADMIN
// ==========================================
export default function HalamanAdmin() {
  const { signOut } = useClerk();

  const [tabAktif, setTabAktif] = useState("analitik");
  const [terakhirDiperbarui, setTerakhirDiperbarui] = useState("");
  const [sedangRefresh, setSedangRefresh] = useState(false);
  const [modeTambah, setModeTambah] = useState(false);
  const [daftarProduk, setDaftarProduk] = useState<any[]>([]);
  const [memuatProduk, setMemuatProduk] = useState(false);

  const [bukaKalkulator, setBukaKalkulator] = useState(false);
  const [kalkulatorBulan, setKalkulatorBulan] = useState(new Date().getMonth().toString());
  const [kalkulatorTahun, setKalkulatorTahun] = useState(new Date().getFullYear().toString());
  const [pendapatanSelesai, setPendapatanSelesai] = useState(0);
  const [hargaBeliCalc, setHargaBeliCalc] = useState("");
  const profitKalkulator = pendapatanSelesai - Number(hargaBeliCalc.replace(/\D/g, ""));
  const [memuatKalkulator, setMemuatKalkulator] = useState(false);

  const [notifikasiAdmin, setNotifikasiAdmin] = useState({
    terbuka: false,
    pesan: "",
    tipe: "sukses",
  });

  const [filterWaktu, setFilterWaktu] = useState("7hari");
  const [filterBulan, setFilterBulan] = useState(new Date().getMonth().toString());
  const [filterTahun, setFilterTahun] = useState(new Date().getFullYear().toString());
  const [modeGrafikTop, setModeGrafikTop] = useState("terjual");
  const [memuatAnalitik, setMemuatAnalitik] = useState(true);

  const [dataAnalitik, setDataAnalitik] = useState({
    totalPenjualan: 0,
    pesananBaru: 0,
    produkAktif: 0,
    daftarKategori: [],
    grafikPenjualan: [],
    grafikProdukTerjual: [],
    grafikProdukDilihat: [],
  });

  const tahunSekarang = new Date().getFullYear();
  const daftarTahun = Array.from(
    { length: tahunSekarang - 2024 + 1 },
    (_, i) => tahunSekarang - i,
  );

  const tampilkanNotifikasi = (
    pesan: string,
    tipe: "sukses" | "gagal" = "sukses",
  ) => {
    setNotifikasiAdmin({ terbuka: true, pesan, tipe });
    setTimeout(
      () => setNotifikasiAdmin((prev) => ({ ...prev, terbuka: false })),
      3500,
    );
  };

  const updateWaktuRefresh = () => {
    const sekarang = new Date();
    setTerakhirDiperbarui(
      `${sekarang.getHours().toString().padStart(2, "0")}:${sekarang.getMinutes().toString().padStart(2, "0")}:${sekarang.getSeconds().toString().padStart(2, "0")}`,
    );
  };

  // 🔥 FUNGSI TARIK DATA SILUMAN 🔥
  const tarikProdukDariDB = async (sembunyi = false) => {
    if (!sembunyi) setMemuatProduk(true);
    try {
      const respons = await fetch("/api/admin/produk");
      if (respons.ok) setDaftarProduk(await respons.json());
    } catch (galat) {
      console.error(galat);
    } finally {
      if (!sembunyi) setMemuatProduk(false);
    }
  };

  const tarikDataAnalitik = async (sembunyi = false) => {
    if (!sembunyi) setMemuatAnalitik(true);
    try {
      const respons = await fetch(`/api/admin/analitik?filter=${filterWaktu}&bulan=${filterBulan}&tahun=${filterTahun}`);
      if (respons.ok) {
        setDataAnalitik(await respons.json());
        updateWaktuRefresh();
      }
    } catch (galat) {
      console.error(galat);
    } finally {
      if (!sembunyi) setMemuatAnalitik(false);
    }
  };

  // 🔥 EFEK REFRESH SILUMAN TIAP 10 DETIK 🔥
  useEffect(() => {
    if (tabAktif === "produk") {
      tarikProdukDariDB(false);
      const intervalRealtime = setInterval(() => {
        tarikProdukDariDB(true);
      }, 10000);
      return () => clearInterval(intervalRealtime);
    }
    if (tabAktif === "analitik") {
      tarikDataAnalitik(false);
      const intervalRealtime = setInterval(() => {
        tarikDataAnalitik(true);
      }, 10000);
      return () => clearInterval(intervalRealtime);
    }
  }, [tabAktif, filterWaktu, filterBulan, filterTahun]);

  useEffect(() => {
    if(bukaKalkulator) {
       const fetchKalkulator = async () => {
         setMemuatKalkulator(true);
         try {
            const res = await fetch(`/api/admin/kalkulator?bulan=${kalkulatorBulan}&tahun=${kalkulatorTahun}`);
            if(res.ok) {
               const data = await res.json();
               setPendapatanSelesai(data.totalPendapatan);
            }
         } catch(e) {}
         setMemuatKalkulator(false);
       };
       fetchKalkulator();
    }
  }, [bukaKalkulator, kalkulatorBulan, kalkulatorTahun]);

  const tarikDataTerbaru = () => {
    setSedangRefresh(true);
    updateWaktuRefresh();
    if (tabAktif === "produk") tarikProdukDariDB(true);
    if (tabAktif === "analitik") tarikDataAnalitik(true);
    setTimeout(() => setSedangRefresh(false), 800);
  };

  const statistikRingkas = [
    {
      judul: "Total pendapatan bersih",
      nilai: formatRupiah(dataAnalitik.totalPenjualan),
      tren: "Sesuai filter",
      ikon: CircleDollarSign,
    },
    {
      judul: "Pesanan masuk",
      nilai: dataAnalitik.pesananBaru.toString(),
      tren: "Menunggu diproses",
      ikon: ShoppingBag,
    },
    {
      judul: "Produk tayang",
      nilai: dataAnalitik.produkAktif.toString(),
      tren: "Live di Database",
      ikon: PackageCheck,
    },
  ];

  const daftarMenu = [
    { id: "analitik", ikon: BarChart2, label: "Analitik" },
    { id: "produk", ikon: Package, label: "Produk" },
    { id: "pesanan", ikon: ShoppingCart, label: "Pesanan" },
    { id: "promosi", ikon: Megaphone, label: "Promosi" },
  ];

  const dataGrafikTopAktif =
    modeGrafikTop === "dilihat"
      ? dataAnalitik.grafikProdukDilihat
      : dataAnalitik.grafikProdukTerjual;
  const kategoriAktifReal = Array.from(
    new Set(
      daftarProduk.map((p) => p.kategori?.nama || p.kategori).filter(Boolean),
    ),
  ) as string[];

  return (
    <div className="fixed top-0 left-0 w-full h-[100dvh] z-[100] flex bg-pink-50/30 text-zinc-900 font-sans overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-pink-100 z-50">
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/logo-kkf.png"
              alt="KKF Label"
              className="h-10 w-10 rounded-md object-cover border border-pink-100 shadow-sm"
            />
            <div>
              <p className="text-[10px] font-bold text-soft-pink-600 uppercase tracking-wider">
                Workspace
              </p>
              <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                KKF LABEL
              </h1>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {daftarMenu.map((menu) => (
            <button
              key={menu.id}
              onClick={() => {
                setTabAktif(menu.id);
                setModeTambah(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all font-medium flex items-center gap-3 ${tabAktif === menu.id ? "bg-soft-pink-100/70 text-soft-pink-700 font-bold shadow-sm" : "hover:bg-pink-50 text-zinc-600"}`}
            >
              <menu.ikon size={20} /> {menu.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-pink-100 flex flex-col gap-3">
          <button
            onClick={async () => {
              await signOut();
              window.location.href = "/";
            }}
            className="flex items-center justify-center gap-2 text-red-500 bg-red-50 hover:bg-red-100 w-full px-4 py-3 rounded-xl font-bold transition outline-none shadow-sm border border-red-100"
          >
            <LogOut size={18} /> Keluar Sistem
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-zinc-50/50 relative h-full">
        <header className="md:hidden shrink-0 bg-white border-b border-pink-100 p-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-zinc-900">KKF-LABEL-ADMIN</span>
          </div>
          <div className="bg-white p-1 rounded-full border border-pink-100 shadow-sm flex items-center justify-center shrink-0 w-10 h-10">
            <UserButton
              appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
            />
          </div>
        </header>

        <div className="shrink-0 px-4 md:px-8 py-4 md:pt-8 pb-0 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <h2 className="text-2xl font-bold text-zinc-900 tracking-tight capitalize">
            {tabAktif.replace("-", " ")}
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setBukaKalkulator(true)}
              className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 sm:px-3 py-1.5 rounded-full shadow-sm hover:bg-emerald-100 transition"
            >
              <CircleDollarSign size={14} />
              <span className="hidden sm:inline">Kalkulator Profit</span>
              <span className="sm:hidden">Profit</span>
            </button>
            <button
              onClick={tarikDataTerbaru}
              className="flex items-center gap-2 text-xs font-medium text-zinc-500 bg-white border border-zinc-200 px-3 py-1.5 rounded-full shadow-sm w-fit hover:bg-zinc-50 transition"
            >
              <RefreshCw
                size={12}
                className={
                  sedangRefresh ? "animate-spin text-soft-pink-500" : ""
                }
              />{" "}
              Diperbarui: {terakhirDiperbarui}
            </button>
            <div className="hidden md:flex items-center justify-center bg-white p-1.5 rounded-full border border-pink-100 shadow-sm hover:shadow-md transition-all shrink-0 w-12 h-12 cursor-pointer">
              <UserButton
                appearance={{ elements: { userButtonAvatarBox: "w-9 h-9" } }}
              />
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 pt-4 pb-32 md:pb-8 relative">
          {tabAktif === "pesanan" && (
            <TabelPesanan tampilkanNotifikasi={tampilkanNotifikasi} />
          )}

          {tabAktif === "analitik" && (
            <div className="space-y-6 max-w-6xl animate-in fade-in zoom-in-95 duration-300">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-zinc-900 text-lg">
                    Ringkasan Performa
                  </h3>
                  <p className="text-sm text-zinc-500">
                    Database live dari server PostgreSQL KKF-Label.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full xl:w-fit">
                  <div className="flex items-center overflow-x-auto bg-white p-1 rounded-xl border border-pink-100 shadow-sm w-full sm:w-fit whitespace-nowrap [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {["hari", "minggu"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setFilterWaktu(filter)}
                        className={`px-4 py-1.5 text-[11px] sm:text-xs rounded-lg capitalize transition-all shrink-0 ${filterWaktu === filter ? "bg-pink-100 text-pink-700 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-900 font-medium"}`}
                      >
                        {filter === "hari" ? "Hari Ini" : "Minggu Ini"}
                      </button>
                    ))}
                    <button
                        onClick={() => setFilterWaktu("bulanan")}
                        className={`px-4 py-1.5 text-[11px] sm:text-xs rounded-lg capitalize transition-all shrink-0 ${filterWaktu === "bulanan" ? "bg-pink-100 text-pink-700 font-bold shadow-sm" : "text-zinc-500 hover:text-zinc-900 font-medium"}`}
                      >
                        Bulanan
                    </button>
                  </div>
                  {filterWaktu === "bulanan" && (
                    <>
                      <div className="shrink-0 w-full sm:w-32 z-[60]">
                        <DropdownMewah
                          value={filterBulan}
                          options={opsiBulanGlobal}
                          onChange={setFilterBulan}
                          placeholder="Pilih Bulan"
                          widthClass="w-full"
                        />
                      </div>
                      <div className="shrink-0 w-full sm:w-28 z-[60]">
                        <DropdownMewah
                          value={filterTahun}
                          options={daftarTahun.map((tahun) => ({
                            value: tahun.toString(),
                            label: tahun.toString(),
                          }))}
                          onChange={setFilterTahun}
                          placeholder="Tahun"
                          widthClass="w-full"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {memuatAnalitik ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500 gap-2">
                  <Loader2
                    className="animate-spin text-soft-pink-500"
                    size={32}
                  />
                  <p className="text-sm font-medium">
                    Sinkronisasi data dari Prisma...
                  </p>
                </div>
              ) : (
                <>
                  <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {statistikRingkas.map((st) => (
                      <article
                        key={st.judul}
                        className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm relative overflow-hidden group"
                      >
                        <div className="flex items-start justify-between gap-4 relative z-10">
                          <div>
                            <p className="text-sm font-bold text-zinc-500">
                              {st.judul}
                            </p>
                            <p className="mt-2 text-2xl font-black text-zinc-900">
                              {st.nilai}
                            </p>
                          </div>
                          <span className="grid h-12 w-12 place-items-center rounded-full bg-soft-pink-50 text-soft-pink-600 transition-transform group-hover:scale-110">
                            <st.ikon size={24} />
                          </span>
                        </div>
                        <p className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2.5 py-1 rounded-md relative z-10">
                          <TrendingUp size={14} /> {st.tren}
                        </p>
                      </article>
                    ))}
                  </section>

                  <section className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm">
                      <div className="mb-6">
                        <h3 className="font-bold text-zinc-900">
                          Tren Pendapatan Real-Time
                        </h3>
                        <p className="text-xs text-zinc-500">
                          Pendapatan kotor dari tabel Pesanan.
                        </p>
                      </div>
                      <div className="h-[250px] w-full text-xs">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={dataAnalitik.grafikPenjualan}
                            margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid
                              strokeDasharray="3 3"
                              vertical={false}
                              stroke="#fce7f3"
                            />
                            <XAxis
                              dataKey="hari"
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#71717a" }}
                              dy={10}
                            />
                            <YAxis
                              axisLine={false}
                              tickLine={false}
                              tick={{ fill: "#71717a" }}
                              tickFormatter={(value) => `Rp${value / 1000}k`}
                            />
                            <Tooltip
                              contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                              }}
                              formatter={(value: any) => [
                                `Rp ${Number(value).toLocaleString("id-ID")}`,
                                "Pendapatan",
                              ]}
                            />
                            <Line
                              type="monotone"
                              dataKey="total"
                              stroke="#db2777"
                              strokeWidth={3}
                              dot={{
                                r: 4,
                                fill: "#db2777",
                                strokeWidth: 2,
                                stroke: "#fff",
                              }}
                              activeDot={{ r: 6 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm flex flex-col">
                      <div className="mb-6 flex justify-between items-start gap-2">
                        <div>
                          <h3 className="font-bold text-zinc-900">
                            Top Produk Live
                          </h3>
                          <p className="text-[10px] text-zinc-500">
                            Berdasarkan{" "}
                            {modeGrafikTop === "dilihat"
                              ? "klik pengunjung"
                              : "unit terjual"}
                            .
                          </p>
                        </div>
                        <div className="flex bg-zinc-50 p-1 rounded-lg border border-zinc-200 shrink-0">
                          <button
                            onClick={() => setModeGrafikTop("terjual")}
                            className={`p-1.5 rounded-md transition-all ${modeGrafikTop === "terjual" ? "bg-white shadow-sm text-soft-pink-600" : "text-zinc-400 hover:text-zinc-600"}`}
                          >
                            <CartIcon size={14} />
                          </button>
                          <button
                            onClick={() => setModeGrafikTop("dilihat")}
                            className={`p-1.5 rounded-md transition-all ${modeGrafikTop === "dilihat" ? "bg-white shadow-sm text-soft-pink-600" : "text-zinc-400 hover:text-zinc-600"}`}
                          >
                            <MousePointerClick size={14} />
                          </button>
                        </div>
                      </div>
                      <div className="flex-1 w-full text-xs min-h-[200px]">
                        {dataGrafikTopAktif.length === 0 ? (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 italic">
                            Belum ada data
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={dataGrafikTopAktif}
                              layout="vertical"
                              margin={{
                                top: 0,
                                right: 0,
                                left: -20,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid
                                strokeDasharray="3 3"
                                horizontal={false}
                                stroke="#fce7f3"
                              />
                              <XAxis
                                type="number"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#71717a" }}
                              />
                              <YAxis
                                dataKey="nama"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#3f3f46", fontSize: 10 }}
                                width={90}
                                tickFormatter={(value) =>
                                  value.length > 12
                                    ? value.substring(0, 12) + "..."
                                    : value
                                }
                              />
                              <Tooltip
                                cursor={{ fill: "#fdf2f8" }}
                                contentStyle={{
                                  borderRadius: "12px",
                                  border: "none",
                                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                                }}
                                formatter={(value: any) => [
                                  `${value} ${modeGrafikTop === "terjual" ? "Pcs" : "Views"}`,
                                  modeGrafikTop === "terjual"
                                    ? "Terjual"
                                    : "Dilihat",
                                ]}
                              />
                              <Bar
                                dataKey="jumlah"
                                fill="#f472b6"
                                radius={[0, 4, 4, 0]}
                                barSize={24}
                              />
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          )}

          {tabAktif === "produk" && (
            <div className="space-y-6 max-w-6xl">
              {!modeTambah ? (
                <>
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-bold text-zinc-900 text-lg">
                      Daftar Produk
                    </h3>
                    <button
                      onClick={() => setModeTambah(true)}
                      className="hidden sm:flex bg-soft-pink-600 hover:bg-soft-pink-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-sm items-center gap-2"
                    >
                      <Plus size={18} /> Tambah Produk Baru
                    </button>
                    <button
                      onClick={() => setModeTambah(true)}
                      className="sm:hidden bg-soft-pink-600 hover:bg-soft-pink-700 text-white p-2.5 rounded-xl transition shadow-sm flex items-center justify-center"
                    >
                      <Plus size={22} />
                    </button>
                  </div>
                  <div className="rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden mb-8">
                    {memuatProduk ? (
                      <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
                        <Loader2
                          className="animate-spin text-soft-pink-500"
                          size={24}
                        />
                        <p className="text-sm font-medium">
                          Menarik data dari database Prisma...
                        </p>
                      </div>
                    ) : (
                      <TabelProduk dataProduk={daftarProduk} />
                    )}
                  </div>
                </>
              ) : (
                <FormTambahProduk
                  riwayatKategori={kategoriAktifReal}
                  onKembali={() => setModeTambah(false)}
                  onSukses={() => {
                    setModeTambah(false);
                    tarikProdukDariDB(true);
                    tampilkanNotifikasi(
                      "MANTAP BRE! Produk berhasil masuk database!",
                      "sukses",
                    );
                  }}
                  onError={(pesan: string) =>
                    tampilkanNotifikasi(pesan, "gagal")
                  }
                />
              )}
            </div>
          )}

          {tabAktif === "promosi" && <PromosiTab />}
        </main>

        {bukaKalkulator && (
          <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-in zoom-in-95">
              <div className="flex justify-between items-center mb-5 border-b border-zinc-100 pb-3">
                <h3 className="font-bold text-zinc-900 flex items-center gap-2">
                  <CircleDollarSign className="text-emerald-500" size={18} />{" "}
                  Kalkulator Profit
                </h3>
                <button
                  onClick={() => setBukaKalkulator(false)}
                  className="text-zinc-400 hover:text-red-500 bg-zinc-50 rounded-full p-1.5 transition"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <DropdownMewah
                    value={kalkulatorBulan}
                    options={opsiBulanGlobal}
                    onChange={setKalkulatorBulan}
                    placeholder="Bulan"
                    widthClass="w-1/2"
                  />
                  <DropdownMewah
                    value={kalkulatorTahun}
                    options={daftarTahun.map(t => ({value: t.toString(), label: t.toString()}))}
                    onChange={setKalkulatorTahun}
                    placeholder="Tahun"
                    widthClass="w-1/2"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">
                    Total Pendapatan (Status Selesai)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-zinc-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      disabled
                      value={memuatKalkulator ? "Menghitung..." : formatRupiah(pendapatanSelesai)}
                      className="w-full border border-zinc-300 py-2.5 pl-10 pr-3 rounded-xl bg-zinc-50 text-zinc-700 font-bold focus:outline-none text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-600 mb-1">
                    Total Pengeluaran / Modal
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-sm font-bold text-zinc-400">
                      Rp
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={hargaBeliCalc}
                      onChange={(e) => {
                        const angkaMurni = e.target.value.replace(/\D/g, "");
                        setHargaBeliCalc(
                          angkaMurni ? formatRupiah(Number(angkaMurni)) : "",
                        );
                      }}
                      className="w-full border border-zinc-300 py-2.5 pl-10 pr-3 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div
                  className={`p-4 rounded-xl mt-4 border ${profitKalkulator > 0 ? "bg-emerald-50 border-emerald-100" : profitKalkulator < 0 ? "bg-red-50 border-red-100" : "bg-zinc-50 border-zinc-200"}`}
                >
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-1">
                    Total Profit Margin
                  </p>
                  <p
                    className={`text-2xl font-black ${profitKalkulator > 0 ? "text-emerald-600" : profitKalkulator < 0 ? "text-red-600" : "text-zinc-800"}`}
                  >
                    {profitKalkulator > 0 ? "+" : ""}
                    {formatRupiah(profitKalkulator)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {notifikasiAdmin.terbuka && (
          <div className="fixed top-20 right-5 left-5 md:left-auto md:bottom-5 md:top-auto z-[99999] bg-zinc-900 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-3 border border-zinc-800 animate-in slide-in-from-top-5 md:slide-in-from-bottom-5 duration-300">
            {notifikasiAdmin.tipe === "sukses" ? (
              <CheckCircle size={18} className="text-emerald-400" />
            ) : (
              <AlertTriangle size={18} className="text-red-400" />
            )}
            <p className="text-xs font-bold tracking-wide">
              {notifikasiAdmin.pesan}
            </p>
          </div>
        )}
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 w-full z-[9999] bg-white border-t border-pink-100 shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2">
          {daftarMenu.map((menu) => {
            const isActive = tabAktif === menu.id;
            return (
              <button
                key={menu.id}
                onClick={() => {
                  setTabAktif(menu.id);
                  setModeTambah(false);
                }}
                className="relative flex flex-col items-center w-16 h-full"
              >
                <div
                  className={`absolute transition-all duration-300 ease-in-out flex items-center justify-center ${isActive ? "-top-5 h-14 w-14 bg-soft-pink-600 text-white rounded-full shadow-lg border-4 border-pink-50" : "top-2 h-8 w-8 text-zinc-400 hover:text-soft-pink-500"}`}
                >
                  <menu.ikon size={isActive ? 24 : 22} />
                </div>
                <span
                  className={`absolute transition-all duration-300 font-bold ${isActive ? "bottom-1 text-[10px] text-soft-pink-600" : "bottom-1.5 text-[9px] text-zinc-500"}`}
                >
                  {menu.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
