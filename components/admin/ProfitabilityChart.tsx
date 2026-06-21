import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export default function ProfitabilityChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;

  useEffect(() => {
    fetch("/api/admin/profitability")
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
        <p className="text-sm">Menarik data Profitability...</p>
      </div>
    );
  }

  const sortedData = [...data].sort((a, b) => b.margin - a.margin);
  const chartData = sortedData.slice(page * itemsPerPage, (page + 1) * itemsPerPage);

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm mt-6">
      <div className="mb-3">
        <h3 className="font-bold text-zinc-900 text-sm">Profitability (Margin Produk)</h3>
        <p className="text-[10px] text-zinc-500">Margin Tertinggi (Harga Jual - HPP)</p>
      </div>
      <div className="w-full">
        <div className="h-[180px]">
          {chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-[10px] text-zinc-400 italic">
              Belum ada data penjualan selesai.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 0, bottom: 0 }}
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#fce7f3" />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  tickFormatter={(val) => 
                    val >= 1000000 
                      ? `Rp${(val / 1000000).toFixed(1).replace('.0', '')}m` 
                      : `Rp${val / 1000}k`
                  }
                />
                <YAxis
                  dataKey="nama"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  fontSize={10}
                  width={90}
                  tickFormatter={(val) => (val.length > 12 ? val.substring(0, 12) + "..." : val)}
                />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    formatRupiah(Number(val)),
                    name.charAt(0).toUpperCase() + name.slice(1),
                  ]}
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", fontSize: "10px", padding: "8px" }}
                />
                <Bar dataKey="margin" fill="#10b981" radius={[0, 4, 4, 0]} name="Margin Bersih" barSize={10} />
                <Bar dataKey="hppTotal" fill="#f43f5e" radius={[0, 4, 4, 0]} name="Total Modal (HPP)" barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
      {sortedData.length > 0 && (
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-zinc-50">
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 0}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-[10px] text-zinc-500 font-medium">
            Halaman {page + 1} dari {Math.ceil(sortedData.length / itemsPerPage)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={(page + 1) * itemsPerPage >= sortedData.length}
            className="p-1.5 rounded-lg text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
