"use client";

import { useState } from "react";
import { User, Phone, Landmark, CreditCard, Save, Loader2, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilForm({ initialData, affiliateId }: { initialData: any, affiliateId: string }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    namaLengkap: initialData?.namaLengkap || "",
    whatsapp: initialData?.whatsapp || "",
    namaBank: initialData?.namaBank || "",
    noRekening: initialData?.noRekening || "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch("/api/affiliate/profil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          affiliateId,
          ...formData
        })
      });

      if (!res.ok) throw new Error("Gagal menyimpan profil");
      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in">
          <CheckCircle size={20} /> Profil berhasil disimpan!
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5"><User size={14}/> Nama Lengkap Sesuai KTP</label>
          <input 
            type="text" name="namaLengkap" required
            value={formData.namaLengkap} onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5"><Phone size={14}/> Nomor WhatsApp Aktif</label>
          <input 
            type="text" name="whatsapp" required
            value={formData.whatsapp} onChange={handleChange}
            placeholder="0812xxxxxx"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5"><Landmark size={14}/> Nama Bank</label>
          <input 
            type="text" name="namaBank" required
            value={formData.namaBank} onChange={handleChange}
            placeholder="BCA / Mandiri / BNI / BRI"
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5"><CreditCard size={14}/> Nomor Rekening</label>
          <input 
            type="text" name="noRekening" required
            value={formData.noRekening} onChange={handleChange}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors"
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button 
          type="submit" disabled={loading}
          className="bg-indigo-600 text-white font-bold px-8 py-3 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 disabled:opacity-70 shadow-sm"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Simpan Perubahan</>}
        </button>
      </div>
    </form>
  );
}
