import { useState, useEffect } from "react";
import { Loader2, Link } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export default function AffiliateTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/affiliate")
      .then((res) => res.json())
      .then((resData) => {
        setData(resData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
        <Loader2 className="animate-spin text-soft-pink-500" size={24} />
        <p className="text-sm">Menarik data Affiliate Leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm mt-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="font-bold text-zinc-900">Affiliate Leaderboard</h3>
          <p className="text-xs text-zinc-600">Performa penjualan berdasarkan link referral (?ref=)</p>
        </div>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-pink-100 text-zinc-600">
              <th className="pb-3 font-semibold px-2">Nama Mitra</th>
              <th className="pb-3 font-semibold px-2 hidden md:table-cell">WhatsApp</th>
              <th className="pb-3 font-semibold px-2 text-center">Total Pesanan Sukses</th>
              <th className="pb-3 font-semibold px-2 text-right">Total Pendapatan Dihasilkan</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-zinc-600 italic">
                  Belum ada data affiliate yang terdaftar.
                </td>
              </tr>
            ) : (
              data.map((af, idx) => (
                <tr key={idx} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-4 px-2 font-bold text-zinc-900 flex items-center gap-2">
                    <Link size={14} className="text-zinc-600" />
                    {af.nama || af.affiliateId}
                  </td>
                  <td className="py-4 px-2 font-medium text-zinc-600 hidden md:table-cell">
                    {af.whatsapp || "-"}
                  </td>
                  <td className="py-4 px-2 text-center font-medium text-emerald-600">
                    {af.totalPesanan} Orders
                  </td>
                  <td className="py-4 px-2 text-right font-bold text-soft-pink-600">
                    {formatRupiah(af.totalPendapatan)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
