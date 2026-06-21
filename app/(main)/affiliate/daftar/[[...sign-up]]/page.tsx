import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Handshake, AlertTriangle, ArrowLeft } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import ClientScrollLock from "./ClientScrollLock"; // We will create this

const prisma = new PrismaClient();

export default async function AffiliateDaftarServer({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { userId } = await auth();

  if (userId) {
    redirect("/affiliate/dashboard");
  }

  const params = await searchParams;
  const kontak = params.email;

  // 1. GATEKEEPER VALIDATION (SERVER-SIDE)
  let isEligible = false;

  if (kontak) {
    const validOrder = await prisma.order.findFirst({
      where: {
        OR: [{ emailPenerima: kontak }, { teleponPenerima: kontak }],
        statusPesanan: { in: ["SELESAI", "SAMPAI"] },
      },
    });
    if (validOrder) {
      isEligible = true;
    }
  }

  return (
    <div className="fixed inset-0 z-[99999] w-full h-full overflow-y-auto bg-white bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex flex-col lg:flex-row font-sans">
      <ClientScrollLock />
      <div className="fixed top-[-10%] left-[-20%] w-[150vw] h-[150vw] lg:w-[40vw] lg:h-[40vw] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-60 pointer-events-none"></div>
      <div
        className="fixed bottom-[-10%] right-[-20%] w-[150vw] h-[150vw] lg:w-[40vw] lg:h-[40vw] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 pointer-events-none"
        style={{ animationDelay: "2s" }}
      ></div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 pt-12 pb-6 lg:p-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 backdrop-blur-md border border-indigo-200 text-[10px] font-bold text-indigo-600 tracking-widest uppercase mb-6 shadow-sm w-fit">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
          Mitra KKF Label
        </div>
        <h1 className="text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight mb-3 lg:mb-4 uppercase drop-shadow-sm">
          GABUNG <span className="text-indigo-500">AFFILIATE</span>
        </h1>
        <p className="text-zinc-600 text-sm lg:text-base max-w-md leading-relaxed mb-6 lg:mb-10 font-medium">
          Dapatkan komisi menarik untuk setiap penjualan yang berasal dari link referral Anda. Daftarkan diri Anda sekarang.
        </p>
        <div className="flex items-center gap-6 text-[10px] lg:text-xs font-bold text-zinc-500 uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <Handshake size={16} className="text-indigo-500" /> Untung Bersama
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-start lg:justify-center items-center px-6 pb-16 lg:p-16 relative z-10">
        {!isEligible ? (
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-red-100 max-w-sm text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-xl font-black text-zinc-900 mb-2">Akses Ditolak</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              Fitur Affiliate eksklusif hanya untuk pelanggan setia KKF Label yang telah memiliki riwayat pesanan selesai.
            </p>
            <Link href="/" className="inline-flex items-center gap-2 bg-zinc-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition shadow-md">
              <ArrowLeft size={16} /> Kembali ke Toko
            </Link>
          </div>
        ) : (
          <div className="w-full max-w-[400px] flex justify-center animate-in fade-in slide-in-from-bottom-5 duration-700">
            <SignUp 
              unsafeMetadata={{ role: "affiliate" }} 
              signInUrl="/affiliate/sign-in"
              forceRedirectUrl="/affiliate/dashboard"
              routing="path"
              path="/affiliate/daftar"
            />
          </div>
        )}
      </div>
    </div>
  );
}
