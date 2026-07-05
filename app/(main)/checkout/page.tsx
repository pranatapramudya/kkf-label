"use client";

import Image from "next/image";
import Script from "next/script"; // 🔥 Wajib buat manggil fungsi popup Midtrans
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  CreditCard,
  Loader2,
  MapPin,
  Minus,
  Plus,
  Trash2,
  Truck,
  AlertTriangle,
  Search,
  ChevronDown,
  Check,
  CheckCircle,
  Package,
  MessageCircle,
} from "lucide-react";
import { useKeranjang } from "@/context/CartContext";
import { formatRupiah } from "@/lib/format";
import type { PilihanOngkir, Wilayah } from "@/types/produk";
import ColorBadge from "@/components/ColorBadge";

const daftarEkspedisi = [
  { value: "jne", label: "JNE" },
  { value: "jnt", label: "J&T" },
  { value: "sicepat", label: "SiCepat" },
  { value: "pos", label: "Pos Indonesia" },
  { value: "gojek", label: "Gojek" },
];

const DropdownPencarian = ({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  valueKey = "id",
  labelKey = "name",
}: any) => {
  const [buka, setBuka] = useState(false);
  const [kataKunci, setKataKunci] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const klikLuar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setBuka(false);
    };
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  const opsiTerpilih = options.find((o: any) => o[valueKey] === value);
  const opsiDifilter = options.filter((o: any) =>
    o[labelKey]?.toLowerCase().includes(kataKunci.toLowerCase()),
  );

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setBuka(!buka)}
        className={`flex w-full items-center justify-between border border-zinc-200 p-3 rounded-xl text-sm transition focus:border-soft-pink-500 focus:outline-none ${
          disabled
            ? "bg-zinc-50 text-zinc-400 cursor-not-allowed"
            : "bg-white text-zinc-900 hover:border-soft-pink-300"
        }`}
      >
        <span className="truncate">
          {opsiTerpilih ? opsiTerpilih[labelKey] : placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform text-zinc-400 ${buka ? "rotate-180" : ""}`}
        />
      </button>

      {buka && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-pink-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-2 border-b border-pink-50 p-3">
            <Search size={16} className="text-soft-pink-400 shrink-0" />
            <input
              type="text"
              placeholder="Cari ekspedisi..."
              value={kataKunci}
              onChange={(e) => setKataKunci(e.target.value)}
              className="w-full bg-transparent text-sm focus:outline-none text-zinc-900 placeholder:text-zinc-400"
            />
          </div>
          <ul className="max-h-60 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {opsiDifilter.length === 0 ? (
              <li className="p-3 text-center text-sm text-zinc-500">
                Pencarian tidak ditemukan
              </li>
            ) : (
              opsiDifilter.map((opsi: any) => (
                <li
                  key={opsi[valueKey]}
                  onClick={() => {
                    onChange(opsi[valueKey]);
                    setBuka(false);
                    setKataKunci("");
                  }}
                  className={`flex cursor-pointer items-center justify-between rounded-lg p-2.5 text-sm transition-colors ${
                    value === opsi[valueKey]
                      ? "bg-soft-pink-50/80 font-bold text-soft-pink-700"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  }`}
                >
                  {opsi[labelKey]}
                  {value === opsi[valueKey] && (
                    <Check size={16} className="text-soft-pink-600" />
                  )}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

const AutocompleteAreaBiteship = ({ value, onChange }: { value: any, onChange: (area: any) => void }) => {
  const [buka, setBuka] = useState(false);
  const [kataKunci, setKataKunci] = useState(value?.name || "");
  const [hasilPencarian, setHasilPencarian] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const klikLuar = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setBuka(false);
    };
    document.addEventListener("mousedown", klikLuar);
    return () => document.removeEventListener("mousedown", klikLuar);
  }, []);

  useEffect(() => {
    if (value) {
      setKataKunci(value.name);
    }
  }, [value]);

  useEffect(() => {
    if (!kataKunci || kataKunci.length < 3) {
      setHasilPencarian([]);
      return;
    }
    if (value && kataKunci === value.name) return; // don't search if it's just the selected value

    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/wilayah/biteship?input=${encodeURIComponent(kataKunci)}`);
        const data = await res.json();
        if (data.areas) {
          setHasilPencarian(data.areas);
        }
      } catch (err) {
        console.error("Gagal cari area", err);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [kataKunci, value]);

  return (
    <div ref={ref} className="relative w-full">
      <div className="flex items-center border border-zinc-200 rounded-xl p-3 bg-white focus-within:border-soft-pink-500 transition">
        <Search size={16} className="text-zinc-400 shrink-0 mr-2" />
        <input
          type="text"
          placeholder="Cari kecamatan / kodepos (min 3 huruf)..."
          value={kataKunci}
          onChange={(e) => {
            setKataKunci(e.target.value);
            setBuka(true);
          }}
          onFocus={() => setBuka(true)}
          className="w-full bg-transparent text-sm focus:outline-none text-zinc-900"
        />
        {loading && <Loader2 size={16} className="animate-spin text-soft-pink-500 ml-2 shrink-0" />}
      </div>

      {buka && hasilPencarian.length > 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-pink-100 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <ul className="max-h-60 overflow-y-auto p-1 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-zinc-200 [&::-webkit-scrollbar-thumb]:rounded-full">
            {hasilPencarian.map((area: any) => (
              <li
                key={area.id}
                onClick={() => {
                  onChange(area);
                  setKataKunci(area.name);
                  setBuka(false);
                }}
                className={`flex cursor-pointer flex-col rounded-lg p-2.5 transition-colors text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900`}
              >
                <span className="text-sm font-semibold">{area.name}</span>
                <span className="text-xs text-zinc-400">{area.administrative_division_level_1_name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default function HalamanCheckout() {
  const router = useRouter();
  const { itemKeranjang, subtotal, ubahJumlah, hapusItem, kosongkanKeranjang } =
    useKeranjang();

  const [namaPenerima, setNamaPenerima] = useState("");
  const [emailPenerima, setEmailPenerima] = useState("");
  const [teleponPenerima, setTeleponPenerima] = useState("");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [areaDipilih, setAreaDipilih] = useState<any>(null);
  const [ekspedisiDipilih, setEkspedisiDipilih] = useState("jne");
  const [pilihanOngkir, setPilihanOngkir] = useState<PilihanOngkir | null>(
    null,
  );
  const [metodePembayaran, setMetodePembayaran] = useState("MANUAL_BCA");

  const [pesanOngkir, setPesanOngkir] = useState("");
  const [sedangMemuatWilayah, setSedangMemuatWilayah] = useState(false);
  const [sedangMenghitung, setSedangMenghitung] = useState(false);
  const [sedangMembayar, setSedangMembayar] = useState(false);
  const [pesanPembayaran, setPesanPembayaran] = useState("");

  const [modalSukses, setModalSukses] = useState({
    show: false,
    invoice: "",
    total: 0,
  });

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [showAllMethods, setShowAllMethods] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('kkf_saved_address');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.namaPenerima) setNamaPenerima(data.namaPenerima);
        if (data.teleponPenerima) setTeleponPenerima(data.teleponPenerima);
        if (data.emailPenerima) setEmailPenerima(data.emailPenerima);
        if (data.areaDipilih) setAreaDipilih(data.areaDipilih);
        if (data.ekspedisiDipilih) setEkspedisiDipilih(data.ekspedisiDipilih);
        if (data.alamatLengkap) setAlamatLengkap(data.alamatLengkap);
        setIsEditingAddress(false);
      } catch (e) {
        setIsEditingAddress(true);
      }
    } else {
      setIsEditingAddress(true);
    }
  }, []);

  useEffect(() => {
    if (itemKeranjang.length === 0 && !modalSukses.show && !isRedirecting) router.push("/");
  }, [itemKeranjang.length, router, modalSukses.show, isRedirecting]);

  const namaProvinsi = areaDipilih?.administrative_division_level_1_name ?? "";
  const namaKota = areaDipilih?.administrative_division_level_2_name ?? "";

  const subtotalBersih = itemKeranjang.reduce(
    (acc: number, item: any) => acc + Number(item.harga) * Number(item.jumlah),
    0,
  );
  const subtotalKotor = itemKeranjang.reduce((acc: number, item: any) => {
    const hargaAsli =
      Number(item.hargaCoret) > Number(item.harga)
        ? Number(item.hargaCoret)
        : Number(item.harga);
    return acc + hargaAsli * Number(item.jumlah);
  }, 0);

  const totalDiskon = subtotalKotor - subtotalBersih;
  const BIAYA_LAYANAN = 1000;
  const totalAkhir = subtotalBersih + (pilihanOngkir?.biaya ?? 0) + BIAYA_LAYANAN;

  const hitungOngkir = useCallback(async () => {
    if (!areaDipilih || !ekspedisiDipilih || itemKeranjang.length === 0) return;
    setSedangMenghitung(true);
    setPesanOngkir("");
    setPilihanOngkir(null);

    try {
      const respons = await fetch("/api/ongkir", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          areaIdTujuan: areaDipilih.id,
          ekspedisi: ekspedisiDipilih,
          items: itemKeranjang.map((item: any) => ({
            name: item.nama || "Produk KKF Label",
            value: Number(item.harga) || 100000,
            quantity: Number(item.jumlah) || 1,
            weight: 250
          }))
        }),
      });
      const dataOngkir = (await respons.json()) as {
        daftarBiaya?: PilihanOngkir[];
        pesan?: string;
      };

      if (!respons.ok || !dataOngkir.daftarBiaya?.length)
        throw new Error(
          dataOngkir.pesan ?? "Ongkir belum tersedia untuk pilihan ini.",
        );
      setPilihanOngkir(dataOngkir.daftarBiaya[0]);
    } catch (galat) {
      setPesanOngkir(
        galat instanceof Error ? galat.message : "Gagal menghitung ongkir.",
      );
    } finally {
      setSedangMenghitung(false);
    }
  }, [areaDipilih, ekspedisiDipilih, itemKeranjang.length]);

  useEffect(() => {
    hitungOngkir();
  }, [hitungOngkir]);

  // 🔥 FUNGSI BAYAR SUPER CANGGIH 🔥
  async function buatPesanan() {
    setPesanPembayaran("");
    if (!namaPenerima || !emailPenerima || !teleponPenerima || !alamatLengkap)
      return setPesanPembayaran("Lengkapi data penerima terlebih dahulu.");
    if (!areaDipilih || !pilihanOngkir)
      return setPesanPembayaran(
        "Pilih alamat dan tunggu ongkir selesai dihitung.",
      );

    setSedangMembayar(true);
    try {
      const formDataToSave = {
        namaPenerima,
        emailPenerima,
        teleponPenerima,
        areaDipilih,
        ekspedisiDipilih,
        alamatLengkap
      };
      localStorage.setItem('kkf_saved_address', JSON.stringify(formDataToSave));

      const bodyPesanan = {
        nama: namaPenerima,
        email: emailPenerima,
        telepon: teleponPenerima,
        alamatLengkap: alamatLengkap,
        provinsi: namaProvinsi,
        kota: namaKota,
        ekspedisi: `${daftarEkspedisi.find((item) => item.value === ekspedisiDipilih)?.label} - ${pilihanOngkir.layanan}`,
        subtotal: subtotalBersih,
        ongkir: pilihanOngkir.biaya,
        total: totalAkhir,
        items: itemKeranjang,
        metodePembayaran,
        fcmToken: localStorage.getItem("fcm_token") || undefined,
      };

      if (metodePembayaran === "MIDTRANS") {
        // 1. Minta tiket/token dulu ke server API kita
        const resToken = await fetch("/api/payment", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(bodyPesanan),
        });

        const dataToken = await resToken.json();

        if (!resToken.ok || !dataToken.token) {
          throw new Error(dataToken.pesan || "Gagal membuka jalur pembayaran.");
        }

        setSedangMembayar(false); // Matikan loading biar popup bisa nongol

        // 2. Munculin Popup Midtrans
        // @ts-ignore
        window.snap.pay(dataToken.token, {
          onSuccess: async function (result: any) {
            // Pesanan sudah tersimpan di database lewat /api/payment sebagai PENDING
            kosongkanKeranjang();
            setModalSukses({
              show: true,
              invoice: dataToken.kodePesanan,
              total: totalAkhir,
            });
          },
          onPending: function (result: any) {
            setPesanPembayaran(
              "Mohon selesaikan pembayaran Anda terlebih dahulu.",
            );
          },
          onError: function (result: any) {
            setPesanPembayaran("Proses pembayaran gagal atau ditolak bank.");
          },
          onClose: function () {
            setPesanPembayaran(
              "Anda menutup jendela pembayaran sebelum menyelesaikannya.",
            );
          },
        });
      } else {
        // Alur Transfer Manual
        const resManual = await fetch("/api/payment", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(bodyPesanan),
        });

        const dataManual = await resManual.json();

        if (!resManual.ok || !dataManual.kodePesanan) {
          throw new Error(dataManual.pesan || "Gagal memproses pesanan manual.");
        }

        setSedangMembayar(false);
        setIsRedirecting(true);
        kosongkanKeranjang();
        
        // Arahkan ke halaman pending payment khusus manual
        router.push(`/pembayaran/${dataManual.kodePesanan}`);
      }
    } catch (galat) {
      setPesanPembayaran(
        galat instanceof Error ? galat.message : "Gagal memproses pembayaran.",
      );
      setSedangMembayar(false);
    }
  }

  const kirimKeWA = () => {
    const nomorAdmin = "6285117490449";
    const teksWA = `Halo Admin KKF Label! 👋%0A%0ASaya baru saja membuat pesanan dengan detail berikut:%0A%0A*No. Invoice:* ${modalSukses.invoice}%0A*Total:* ${formatRupiah(modalSukses.total)}%0A%0AMohon bantuannya untuk diproses ya min! Terima kasih. ✨`;
    window.open(`https://wa.me/${nomorAdmin}?text=${teksWA}`, "_blank");
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-pink-50/30 font-sans text-zinc-900 pb-32">
      {/* 🔥 INI YANG BIKIN POPUP MIDTRANS MUNCUL DI LAYAR 🔥 */}
      <Script
        src="https://app.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="lazyOnload"
      />

      {modalSukses.show && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-zinc-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-10 text-center">
            <div className="mx-auto w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-5 border-8 border-emerald-50">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <h2 className="text-2xl font-black text-zinc-900 mb-2 tracking-tight">
              Pesanan Berhasil! 🎉
            </h2>
            <p className="text-sm text-zinc-500 mb-6">
              Terima kasih telah berbelanja di KKF Label. Pesanan kamu segera
              kami proses.
            </p>

            <div className="bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl p-5 mb-8">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">
                Nomor Invoice
              </p>
              <p className="text-xl font-black text-soft-pink-600 tracking-wider">
                {modalSukses.invoice}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={kirimKeWA}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} /> Konfirmasi via WhatsApp
              </button>
              <button
                onClick={() => router.push("/lacak-pesanan")}
                className="w-full bg-soft-pink-50 hover:bg-soft-pink-100 text-soft-pink-600 font-bold py-3.5 rounded-xl transition border border-soft-pink-200 flex items-center justify-center gap-2"
              >
                <Package size={20} /> Lacak Pesanan Saya
              </button>
            </div>
          </div>
        </div>
      )}

      {!modalSukses.show && (
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 md:pt-8">
          <div className="mb-6">
            <p className="text-sm font-semibold text-soft-pink-600">Checkout</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-bold text-zinc-900">
              Lengkapi pesananmu
            </h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
            <section className="space-y-5">
              <div className="kartu-lembut bg-white p-4 md:p-5 rounded-2xl shadow-sm border border-pink-100">
                <div className="mb-5 flex items-center gap-2">
                  <MapPin size={20} className="text-soft-pink-500" />
                  <h2 className="font-bold text-zinc-900 text-lg">
                    Data pengiriman
                  </h2>
                </div>

                {!isEditingAddress ? (
                  <div className="bg-zinc-50 border border-pink-100 rounded-xl p-3 flex gap-3 relative mt-2 shadow-sm">
                    <MapPin size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="pr-12">
                      <p className="font-semibold text-zinc-900 text-sm">{namaPenerima} | {teleponPenerima}</p>
                      <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                        {alamatLengkap}<br/>
                        {namaKota}, {namaProvinsi}
                      </p>
                    </div>
                    <button 
                      onClick={() => setIsEditingAddress(true)}
                      className="absolute top-4 right-4 text-xs font-bold text-soft-pink-600 hover:text-soft-pink-700 transition"
                    >
                      Ubah
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">
                          Nama penerima
                        </label>
                        <input
                          value={namaPenerima}
                          onChange={(e) => setNamaPenerima(e.target.value)}
                          className="w-full border border-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm transition"
                          placeholder="Nama lengkap"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-zinc-500 mb-1">
                          Nomor HP
                        </label>
                        <input
                          type="tel"
                          value={teleponPenerima}
                          onChange={(e) => setTeleponPenerima(e.target.value)}
                          className="w-full border border-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm transition"
                          placeholder="08xxxxxxxx"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={emailPenerima}
                        onChange={(e) => setEmailPenerima(e.target.value)}
                        className="w-full border border-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm transition"
                        placeholder="email@contoh.com"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs text-zinc-500 mb-1">
                        Cari Area (Kecamatan / Kodepos)
                      </label>
                      <AutocompleteAreaBiteship
                        value={areaDipilih}
                        onChange={setAreaDipilih}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">
                        Ekspedisi
                      </label>
                      <DropdownPencarian
                        options={daftarEkspedisi.map((e) => ({
                          id: e.value,
                          name: e.label,
                        }))}
                        value={ekspedisiDipilih}
                        onChange={setEkspedisiDipilih}
                        placeholder="Pilih Ekspedisi..."
                        disabled={!areaDipilih}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-zinc-500 mb-1">
                        Alamat lengkap
                      </label>
                      <textarea
                        value={alamatLengkap}
                        onChange={(e) => setAlamatLengkap(e.target.value)}
                        rows={2}
                        className="w-full border border-zinc-200 px-3 py-2 rounded-xl focus:outline-none focus:border-soft-pink-500 text-sm transition resize-none"
                        placeholder="Jalan, No Rumah, RT/RW, Patokan..."
                      />
                    </div>
                  </div>
                )}

                {sedangMemuatWilayah && (
                  <p className="mt-4 flex items-center gap-2 text-sm font-medium text-soft-pink-600">
                    <Loader2 size={16} className="animate-spin" /> Memuat data
                    wilayah...
                  </p>
                )}
              </div>

              <div className="kartu-lembut bg-white p-5 md:p-7 rounded-2xl shadow-sm border border-pink-100">
                <div className="mb-5 flex items-center gap-2 border-b border-pink-50 pb-4">
                  <Truck size={20} className="text-soft-pink-500" />
                  <h2 className="font-bold text-zinc-900 text-lg">
                    Produk di keranjang
                  </h2>
                </div>

                <div className="space-y-5">
                  {itemKeranjang.map((item: any) => (
                    <div
                      key={item.idVarian}
                      className="flex flex-col sm:flex-row gap-4 rounded-xl border border-pink-50 p-4 bg-zinc-50/50"
                    >
                      <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg shadow-sm border border-pink-50 bg-white">
                        <Image
                          src={item.foto || "/logo-kkf.jpeg"}
                          alt={item.nama || "Produk"}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-2">
                            <p className="line-clamp-2 text-sm font-bold text-zinc-900">
                              {item.nama}
                            </p>
                            <button
                              onClick={() => hapusItem(item.idVarian)}
                              className="grid h-8 w-8 place-items-center rounded-full text-zinc-400 hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="mt-1 text-xs text-zinc-500 font-medium bg-white w-fit px-2 py-0.5 rounded border border-zinc-200 flex items-center gap-1">
                            <span>{item.ukuran} &middot;</span> <ColorBadge text={item.warna || ''} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex flex-col">
                            {item.hargaCoret &&
                              Number(item.hargaCoret) > Number(item.harga) && (
                                <span className="text-[10px] text-zinc-400 line-through">
                                  {formatRupiah(Number(item.hargaCoret))}
                                </span>
                              )}
                            <p className="text-sm font-bold text-soft-pink-600">
                              {formatRupiah(item.harga)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3 rounded-full border border-pink-100 bg-white px-3 py-1.5 shadow-sm">
                            <button
                              onClick={() =>
                                ubahJumlah(item.idVarian, item.jumlah - 1)
                              }
                              className="text-zinc-400 hover:text-soft-pink-600 transition-colors outline-none"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-6 text-center text-xs font-bold text-zinc-900">
                              {item.jumlah}
                            </span>
                            <button
                              onClick={() =>
                                ubahJumlah(item.idVarian, item.jumlah + 1)
                              }
                              className="text-zinc-400 hover:text-soft-pink-600 transition-colors outline-none"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-2xl border border-pink-100 bg-white p-5 md:p-7 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-bold text-zinc-900 mb-5 border-b border-pink-50 pb-4">
                Ringkasan biaya
              </h2>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">
                    Subtotal Produk
                  </span>
                  <span className="font-bold text-zinc-900">
                    {formatRupiah(subtotalKotor)}
                  </span>
                </div>
                {totalDiskon > 0 && (
                  <div className="flex justify-between items-center text-soft-pink-600">
                    <span className="font-medium">Potongan Diskon</span>
                    <span className="font-bold">
                      -{formatRupiah(totalDiskon)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">
                    Ongkos Kirim
                  </span>
                  <span className="font-bold text-zinc-900">
                    {sedangMenghitung
                      ? "Menghitung..."
                      : formatRupiah(pilihanOngkir?.biaya ?? 0)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-medium">
                    Biaya Layanan
                  </span>
                  <span className="font-bold text-zinc-900">
                    {formatRupiah(BIAYA_LAYANAN)}
                  </span>
                </div>

                {pilihanOngkir && (
                  <div className="rounded-xl bg-soft-pink-50/50 p-3 text-xs leading-5 text-soft-pink-700 font-medium border border-soft-pink-100">
                    <span className="font-bold uppercase">
                      {pilihanOngkir.ekspedisi}
                    </span>{" "}
                    - {pilihanOngkir.layanan} <br />
                    Estimasi tiba:{" "}
                    {!pilihanOngkir.estimasi ||
                    pilihanOngkir.estimasi === "-" ||
                    pilihanOngkir.estimasi.trim() === ""
                      ? "2-4 Hari"
                      : `${pilihanOngkir.estimasi.replace(/ HARI/gi, "")} Hari`}
                  </div>
                )}

                {pesanOngkir && (
                  <p className="rounded-xl bg-red-50 p-3 text-xs leading-5 text-red-600 font-medium border border-red-100">
                    {pesanOngkir}
                  </p>
                )}

                <div className="border-t border-pink-100 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-zinc-900 text-sm">Metode Pembayaran</h3>
                    <button 
                      onClick={() => setShowAllMethods(!showAllMethods)}
                      className="text-xs font-bold text-soft-pink-600 hover:text-soft-pink-700 transition"
                    >
                      {showAllMethods ? "Tutup" : "Ubah"}
                    </button>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    {[
                      { id: "MIDTRANS", label: "Otomatis (Virtual Account, QRIS, e-Wallet)", icon: <div className="bg-zinc-800 text-white font-bold text-[10px] w-12 h-7 flex items-center justify-center rounded shrink-0">PAY</div> },
                      { id: "MANUAL_BCA", label: "Transfer Manual BCA", icon: <div className="bg-[#0066AE] text-white font-black text-[12px] w-12 h-7 flex items-center justify-center rounded shrink-0 tracking-wide italic">BCA</div> },
                      { id: "MANUAL_BRI", label: "Transfer Manual BRI", icon: <div className="bg-[#00529C] text-white font-black text-[12px] w-12 h-7 flex items-center justify-center rounded shrink-0 tracking-wide">BRI</div> },
                      { id: "MANUAL_SHOPEEPAY", label: "Transfer Manual ShopeePay", icon: <div className="bg-[#EE4D2D] text-white font-bold text-[8px] w-12 h-7 flex items-center justify-center rounded shrink-0 leading-none text-center">Shopee<br/>Pay</div> },
                      { id: "MANUAL_GOPAY", label: "Transfer Manual GoPay", icon: <div className="bg-[#00AED6] text-white font-bold text-[10px] w-12 h-7 flex items-center justify-center rounded shrink-0">gopay</div> },
                    ]
                      .filter(m => showAllMethods || m.id === metodePembayaran)
                      .map(method => {
                        const isMidtrans = method.id === "MIDTRANS";
                        return (
                          <label key={method.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${isMidtrans ? 'bg-zinc-100 cursor-not-allowed opacity-60 border-zinc-200' : (metodePembayaran === method.id ? 'border-soft-pink-500 bg-soft-pink-50/50 cursor-pointer' : 'border-zinc-200 hover:border-soft-pink-300 cursor-pointer')}`}>
                            {showAllMethods && (
                              <input 
                                type="radio" 
                                name="metodePembayaran" 
                                value={method.id} 
                                checked={metodePembayaran === method.id}
                                disabled={isMidtrans}
                                onChange={(e) => {
                                  if (isMidtrans) return;
                                  setMetodePembayaran(e.target.value);
                                  setShowAllMethods(false);
                                }}
                                className="text-soft-pink-600 focus:ring-soft-pink-500 w-4 h-4 disabled:opacity-50"
                              />
                            )}
                            {method.icon}
                            <div className="flex flex-col">
                              <span className="text-sm font-medium text-zinc-700">{method.label}</span>
                              {isMidtrans && (
                                <span className="text-[10px] text-zinc-500 font-medium italic mt-0.5">Fitur ini sedang dalam tahap pengembangan</span>
                              )}
                            </div>
                          </label>
                        )
                      })}
                  </div>
                </div>
              </div>

              {pesanPembayaran && (
                <p className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-600 font-bold border border-red-100 flex items-start gap-2">
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  {pesanPembayaran}
                </p>
              )}
            </aside>
          </div>
        </div>
      )}

      {/* STICKY BOTTOM BAR BIKINAN SHOPEE */}
      {!modalSukses.show && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-zinc-200 p-4 z-50 flex justify-between items-center shadow-[0_-4px_10px_-1px_rgba(0,0,0,0.05)] md:px-8">
          <div>
            <span className="block text-xs font-bold text-zinc-500 mb-0.5">Total Tagihan</span>
            <span className="text-xl font-black text-soft-pink-600">{formatRupiah(totalAkhir)}</span>
          </div>
          <button
            onClick={buatPesanan}
            disabled={sedangMembayar || itemKeranjang.length === 0}
            className="bg-soft-pink-600 hover:bg-soft-pink-700 text-white font-bold py-3 px-6 md:px-10 rounded-xl transition shadow-md flex items-center justify-center gap-2 disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none min-w-[140px]"
          >
            {sedangMembayar ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <CreditCard size={18} />
            )}
            {sedangMembayar ? "Memproses..." : "Bayar Sekarang"}
          </button>
        </div>
      )}
    </div>
  );
}
