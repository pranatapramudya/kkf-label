import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { TrendingUp, ShoppingBag, Package } from "lucide-react";
import { formatRupiah } from "@/lib/format";
import LinkGenerator from "./LinkGenerator";
import WithdrawalButton from "./WithdrawalButton";

const prisma = new PrismaClient();

export default async function AffiliateDashboard() {
  const user = await currentUser();

  if (!user) {
    redirect("/affiliate/daftar");
  }

  // Validasi Role
  const role = user.unsafeMetadata?.role || user.publicMetadata?.role;
  if (role !== "affiliate") {
    redirect("/");
  }

  const affiliateId = user.id;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://kkf-label.com";

  // Ambil profil affiliate untuk data rekening dan nama
  const affiliateProfile = await prisma.affiliate.findUnique({
    where: { id: affiliateId },
  });

  // Ambil Data Order untuk Affiliate Ini
  const stats = await prisma.order.aggregate({
    _count: {
      id: true,
    },
    _sum: {
      total: true,
    },
    where: {
      affiliateId: affiliateId,
      statusPesanan: {
        in: ["DIBAYAR", "DIPROSES", "DIKIRIM", "SAMPAI", "SELESAI"],
      },
    },
  });

  // History Pesanan Referral
  const referralHistory = await prisma.order.findMany({
    where: {
      affiliateId: affiliateId,
      statusPesanan: {
        in: ["DIBAYAR", "DIPROSES", "DIKIRIM", "SAMPAI", "SELESAI"],
      },
    },
    include: {
      item: {
        select: {
          namaProduk: true,
          jumlah: true
        }
      }
    },
    orderBy: {
      dibuatPada: 'desc'
    },
    take: 20
  });

  const totalPesanan = stats._count.id;
  const totalPendapatan = stats._sum.total || 0;
  const estimasiKomisi = totalPendapatan * 0.1;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-indigo-600 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply opacity-50 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-black tracking-tight">Mitra KKF</h1>
            <div className="bg-indigo-500/50 backdrop-blur px-4 py-1.5 rounded-full text-xs font-medium border border-indigo-400/50">
              {user.firstName} {user.lastName}
            </div>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard Affiliate</h2>
          <p className="text-indigo-200">Pantau performa referal Anda dan cairkan komisi secara langsung.</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 space-y-6">
        
        {/* Link Generator Component */}
        <LinkGenerator affiliateId={affiliateId} baseUrl={baseUrl} />

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <ShoppingBag size={20} />
              </div>
              <p className="text-sm text-slate-500 font-bold">Total Referensi</p>
            </div>
            <p className="text-3xl font-black text-slate-900 mt-2">{totalPesanan} <span className="text-sm font-medium text-slate-500">Sales</span></p>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp size={20} />
              </div>
              <p className="text-sm text-slate-500 font-bold">Total Penjualan</p>
            </div>
            <p className="text-2xl font-black text-slate-900 mt-2">{formatRupiah(totalPendapatan)}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-6 relative overflow-hidden flex flex-col justify-between">
            <div className="absolute right-0 bottom-0 w-24 h-24 bg-indigo-100 rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2"></div>
            <div className="relative z-10">
              <p className="text-xs text-indigo-600 font-black uppercase tracking-wider mb-1">Saldo Komisi (10%)</p>
              <p className="text-3xl font-black text-indigo-900">{formatRupiah(estimasiKomisi)}</p>
            </div>
            <div className="relative z-10">
              <WithdrawalButton
                estimasiKomisi={estimasiKomisi}
                namaAffiliate={affiliateProfile?.namaLengkap || `${user.firstName} ${user.lastName}`.trim()}
                noRekening={affiliateProfile?.noRekening ?? null}
                namaBank={affiliateProfile?.namaBank ?? null}
              />
            </div>
          </div>
        </div>

        {/* Referral History Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 overflow-hidden">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Package size={18} className="text-indigo-500" /> Riwayat Referensi Sukses
          </h3>
          
          {referralHistory.length === 0 ? (
            <div className="text-center py-10">
              <Package size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-500">Belum ada pesanan masuk dari link Anda.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="py-3 px-2 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Komisi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {referralHistory.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-2 text-xs text-slate-600 whitespace-nowrap">
                        {new Date(order.dibuatPada).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-2 text-sm text-slate-900 font-medium">
                        {order.item[0]?.namaProduk || "Produk KKF"}
                        {order.item.length > 1 && <span className="text-xs text-slate-500 font-normal ml-1">+{order.item.length - 1} item</span>}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${
                          order.statusPesanan === 'SELESAI' || order.statusPesanan === 'SAMPAI' 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.statusPesanan}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-sm font-black text-indigo-600 text-right">
                        +{formatRupiah(order.total * 0.1)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
