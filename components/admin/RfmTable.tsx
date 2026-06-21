import { useState, useEffect } from "react";
import { Loader2, Users, Star, Clock, AlertTriangle } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import { maskName, maskEmail } from "@/lib/masking";

export default function RfmTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/rfm")
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
      <div className="flex flex-col items-center justify-center py-10 text-zinc-500 gap-2">
        <Loader2 className="animate-spin text-soft-pink-500" size={24} />
        <p className="text-sm">Menganalisis RFM Pelanggan...</p>
      </div>
    );
  }

  const getSegmentStyle = (segment: string) => {
    switch (segment) {
      case "VIP":
        return "bg-amber-100 text-amber-700";
      case "Sleeping":
        return "bg-red-100 text-red-700";
      case "New":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case "VIP":
        return <Star size={12} className="inline mr-1" />;
      case "Sleeping":
        return <Clock size={12} className="inline mr-1" />;
      case "New":
        return <Users size={12} className="inline mr-1" />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm mt-6">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h3 className="font-bold text-zinc-900">Analisis Pelanggan (RFM)</h3>
          <p className="text-xs text-zinc-500">Segmentasi berdasarkan Recency, Frequency, Monetary.</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-pink-100 text-zinc-500">
              <th className="pb-3 font-semibold px-2">Pelanggan</th>
              <th className="pb-3 font-semibold px-2 text-center">Recency (Hari)</th>
              <th className="pb-3 font-semibold px-2 text-center">Frequency</th>
              <th className="pb-3 font-semibold px-2">Monetary</th>
              <th className="pb-3 font-semibold px-2">Segmen</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-400 italic">
                  Belum ada data pelanggan.
                </td>
              </tr>
            ) : (
              data.map((user, idx) => (
                <tr key={idx} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-4 px-2">
                    <p className="font-bold text-zinc-900">{user.nama}</p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </td>
                  <td className="py-4 px-2 text-center font-medium text-zinc-700">{user.recency} Hari</td>
                  <td className="py-4 px-2 text-center font-medium text-zinc-700">{user.frequency}x</td>
                  <td className="py-4 px-2 font-bold text-soft-pink-600">{formatRupiah(user.monetary)}</td>
                  <td className="py-4 px-2">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase ${getSegmentStyle(user.segment)}`}>
                      {getSegmentIcon(user.segment)}
                      {user.segment}
                    </span>
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
