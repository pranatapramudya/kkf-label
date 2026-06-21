"use client";

import { Wallet, ChevronRight } from "lucide-react";

interface WithdrawalButtonProps {
  estimasiKomisi: number;
  namaAffiliate: string;
  noRekening: string | null;
  namaBank: string | null;
}

export default function WithdrawalButton({
  estimasiKomisi,
  namaAffiliate,
  noRekening,
  namaBank,
}: WithdrawalButtonProps) {
  const handleTarik = () => {
    const saldo = estimasiKomisi.toLocaleString("id-ID");
    const bank = namaBank || "belum diisi";
    const rekening = noRekening || "belum diisi";

    const waText = encodeURIComponent(
      `Halo Admin KKF 👋\n\nSaya ingin mengajukan penarikan komisi affiliate.\n\n📋 *Detail Penarikan:*\n- Nama: ${namaAffiliate}\n- Saldo Komisi: Rp ${saldo}\n- Bank: ${bank}\n- No. Rekening: ${rekening}\n\nMohon diproses ya, terima kasih! 🙏`
    );

    window.open(`https://wa.me/6281234567890?text=${waText}`, "_blank");
  };

  const isDisabled = estimasiKomisi < 50000;
  const isProfileIncomplete = !noRekening || !namaBank;

  return (
    <div className="relative z-10 space-y-2">
      {isProfileIncomplete && estimasiKomisi >= 50000 && (
        <p className="text-[10px] text-amber-600 font-bold bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          ⚠️ Lengkapi rekening di halaman Profil terlebih dahulu.
        </p>
      )}
      <button
        onClick={handleTarik}
        disabled={isDisabled}
        className="w-full mt-2 bg-white text-indigo-600 hover:bg-indigo-50 border border-indigo-100 py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Wallet size={16} /> Tarik Saldo
        <ChevronRight
          size={16}
          className="text-indigo-400 group-hover:translate-x-1 transition-transform"
        />
      </button>
      {isDisabled && (
        <p className="text-[10px] text-slate-400 text-center font-medium">
          Minimal penarikan Rp 50.000
        </p>
      )}
    </div>
  );
}
