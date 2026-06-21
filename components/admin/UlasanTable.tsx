import { useState, useEffect } from "react";
import { Loader2, Star } from "lucide-react";
import { maskName } from "@/lib/masking";

export default function UlasanTable() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ulasan")
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
        <p className="text-sm">Menarik data Ulasan Pelanggan...</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden mb-8">
      <div className="p-5 md:p-6 border-b border-pink-100 flex justify-between items-end">
        <div>
          <h3 className="font-bold text-zinc-900">Daftar Ulasan Pelanggan</h3>
          <p className="text-xs text-zinc-500">Feedback langsung dari pembeli terverifikasi.</p>
        </div>
      </div>
      <div className="overflow-x-auto pb-4">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead>
            <tr className="border-b border-pink-100 text-zinc-500">
              <th className="pb-3 font-semibold px-4 pt-4">Pelanggan</th>
              <th className="pb-3 font-semibold px-2 pt-4">Produk</th>
              <th className="pb-3 font-semibold px-2 pt-4">Rating</th>
              <th className="pb-3 font-semibold px-2 pt-4 min-w-[200px]">Komentar</th>
              <th className="pb-3 font-semibold px-2 pt-4">Tanggal</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-zinc-400 font-medium">
                  Belum ada ulasan masuk.
                </td>
              </tr>
            ) : (
              data.map((u) => (
                <tr key={u.id} className="border-b border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="py-4 px-4">
                    <p className="font-bold text-zinc-900">{u.namaReviewer}</p>
                  </td>
                  <td className="py-4 px-2 text-zinc-600 font-medium">
                    {u.namaProduk}
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} className={i < u.rating ? "fill-current" : "text-zinc-300"} />
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-2 text-zinc-700 whitespace-normal min-w-[200px]">
                    {u.comment}
                  </td>
                  <td className="py-4 px-2 text-xs text-zinc-500">
                    {new Date(u.dibuatPada).toLocaleDateString("id-ID")}
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
