"use client";

import { useState } from "react";
import { Copy, Link2, CheckCircle } from "lucide-react";

export default function LinkGenerator({ affiliateId, baseUrl }: { affiliateId: string, baseUrl: string }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    if (!url) return `${baseUrl}/?ref=${affiliateId}`;
    try {
      // Basic validation
      const parsed = new URL(url);
      parsed.searchParams.set("ref", affiliateId);
      return parsed.toString();
    } catch {
      // Fallback if not a full URL
      return `${baseUrl}${url.startsWith('/') ? url : '/' + url}?ref=${affiliateId}`;
    }
  };

  const generatedUrl = url ? generateLink() : `${baseUrl}/?ref=${affiliateId}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
        <Link2 size={18} className="text-indigo-500" /> Link Generator
      </h3>
      <p className="text-sm text-slate-500 mb-5">
        Buat link affiliate khusus untuk produk tertentu. Paste URL halaman produk di bawah ini.
      </p>

      <div className="space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">URL Target (Opsional)</label>
          <input 
            type="text" 
            placeholder="Contoh: https://domainanda.com/produk/baju-pink"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors bg-slate-50 focus:bg-white"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 mb-1.5 block">Link Referral Anda</label>
          <div className="flex items-center gap-2">
            <code className="bg-indigo-50/50 border border-indigo-100 text-indigo-700 text-sm py-2.5 px-4 rounded-xl flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium">
              {generatedUrl}
            </code>
            <button 
              onClick={copyToClipboard}
              className={`${copied ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-indigo-600 text-white hover:bg-indigo-700'} p-2.5 rounded-xl transition-colors flex-shrink-0 flex items-center justify-center w-11 h-11 shadow-sm`}
              title="Copy to clipboard"
            >
              {copied ? <CheckCircle size={18} /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
