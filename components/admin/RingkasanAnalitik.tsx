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
import { TrendingUp, ShoppingCart as CartIcon, MousePointerClick } from "lucide-react";

export default function RingkasanAnalitik({
  statistikRingkas,
  dataAnalitik,
  modeGrafikTop,
  setModeGrafikTop,
  dataGrafikTopAktif
}: {
  statistikRingkas: any[];
  dataAnalitik: any;
  modeGrafikTop: string;
  setModeGrafikTop: (val: string) => void;
  dataGrafikTopAktif: any[];
}) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {statistikRingkas.map((st) => (
          <article
            key={st.judul}
            className="rounded-2xl border border-pink-100 bg-white p-5 shadow-sm relative overflow-hidden group"
          >
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div>
                <p className="text-sm font-bold text-zinc-600">
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

      <section className="grid gap-6 lg:grid-cols-3 mt-6">
        <div className="lg:col-span-2 rounded-2xl border border-pink-100 bg-white p-5 md:p-6 shadow-sm">
          <div className="mb-6">
            <h3 className="font-bold text-zinc-900">
              Tren Pendapatan Real-Time
            </h3>
            <p className="text-xs text-zinc-600">
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
              <p className="text-[10px] text-zinc-600">
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
                className={`p-1.5 rounded-md transition-all ${modeGrafikTop === "terjual" ? "bg-white shadow-sm text-soft-pink-600" : "text-zinc-600 hover:text-zinc-600"}`}
              >
                <CartIcon size={14} />
              </button>
              <button
                onClick={() => setModeGrafikTop("dilihat")}
                className={`p-1.5 rounded-md transition-all ${modeGrafikTop === "dilihat" ? "bg-white shadow-sm text-soft-pink-600" : "text-zinc-600 hover:text-zinc-600"}`}
              >
                <MousePointerClick size={14} />
              </button>
            </div>
          </div>
          <div className="flex-1 w-full text-xs min-h-[200px]">
            {dataGrafikTopAktif.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center text-zinc-600 italic">
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
  );
}
