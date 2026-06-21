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
import { Loader2 } from "lucide-react";
import { formatRupiah } from "@/lib/format";

export default function ProfitabilityChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm mt-6">
      <div className="mb-6">
        <h3 className="font-bold text-zinc-900">Profitability (Margin Produk)</h3>
        <p className="text-xs text-zinc-500">Margin = Harga Jual - HPP (Modal)</p>
      </div>
      <div className="h-[300px] w-full text-xs">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-zinc-400 italic">
            Belum ada data penjualan selesai.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fce7f3" />
              <XAxis
                dataKey="nama"
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => (val.length > 10 ? val.substring(0, 10) + "..." : val)}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `Rp${val / 1000}k`}
              />
              <Tooltip
                formatter={(val: any, name: string) => [
                  formatRupiah(Number(val)),
                  name.charAt(0).toUpperCase() + name.slice(1),
                ]}
                contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
              />
              <Bar dataKey="margin" fill="#10b981" radius={[4, 4, 0, 0]} name="Margin Bersih" />
              <Bar dataKey="hppTotal" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Total Modal (HPP)" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
