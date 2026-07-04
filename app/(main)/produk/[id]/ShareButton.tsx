"use client";

import { useState } from "react";
import { Share2, CheckCircle, Copy } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface ShareButtonProps {
  produkId: string;
}

export default function ShareButton({ produkId }: ShareButtonProps) {
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
    // URL bersih tanpa query parameters (?ref=) agar canonical dan Open Graph optimal saat dibagikan ke sosmed/WA
    const url = `${baseUrl}/produk/${produkId}`;

    navigator.clipboard
      .writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      })
      .catch(() => {
        // Fallback for browsers that don't support clipboard API
        const textarea = document.createElement("textarea");
        textarea.value = url;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
  };

  return (
    <button
      onClick={handleShare}
      title="Salin link produk"
      className={`
        flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200
        ${
          copied
            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
            : "bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 border border-transparent hover:border-indigo-100"
        }
      `}
    >
      {copied ? (
        <>
          <CheckCircle size={16} className="shrink-0" />
          Link Disalin!
        </>
      ) : (
        <>
          <Share2 size={16} className="shrink-0" />
          Bagikan
        </>
      )}
    </button>
  );
}
