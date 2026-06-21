import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { UserProfile } from "@clerk/nextjs";

const prisma = new PrismaClient();

export default async function AffiliateProfil() {
  const user = await currentUser();

  if (!user) {
    redirect("/affiliate/daftar");
  }

  const role = user.unsafeMetadata?.role || user.publicMetadata?.role;
  if (role !== "affiliate") {
    redirect("/");
  }

  // Tarik data profil dari Prisma (untuk info bank)
  const affiliateProfile = await prisma.affiliate.findUnique({
    where: { id: user.id },
  });

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-indigo-600 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full mix-blend-multiply opacity-50 blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Profil Mitra</h2>
          <p className="text-indigo-200">
            Kelola akun Clerk dan data rekening pencairan komisi Anda.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 -mt-16 relative z-20 space-y-6">
        {/* Clerk UserProfile Component */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <UserProfile
            routing="path"
            path="/affiliate/profil"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "shadow-none border-0 rounded-none",
                navbar: "hidden",
                navbarMobileMenuRow: "hidden",
                pageScrollBox: "p-6",
              },
            }}
          />
        </div>

        {/* Info Rekening Pencairan */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Info Rekening Pencairan
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Data ini digunakan saat Anda mengajukan penarikan komisi ke Admin.
          </p>

          {affiliateProfile?.noRekening ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">
                  Nama Lengkap
                </span>
                <span className="text-sm font-bold text-slate-900">
                  {affiliateProfile.namaLengkap}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-slate-100">
                <span className="text-sm text-slate-500 font-medium">Bank</span>
                <span className="text-sm font-bold text-slate-900">
                  {affiliateProfile.namaBank || "-"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-sm text-slate-500 font-medium">
                  No. Rekening
                </span>
                <span className="text-sm font-bold text-slate-900 font-mono tracking-wide">
                  {affiliateProfile.noRekening}
                </span>
              </div>
              <a
                href="/affiliate/profil/edit-bank"
                className="inline-block mt-2 text-sm text-indigo-600 font-bold hover:underline"
              >
                Edit Rekening →
              </a>
            </div>
          ) : (
            <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-sm text-slate-500 mb-3">
                Belum ada rekening yang terdaftar.
              </p>
              <a
                href="/affiliate/profil/edit-bank"
                className="inline-block bg-indigo-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition"
              >
                + Tambah Rekening
              </a>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
