'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Runtime Error:', error);
  }, [error]);

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-rose-100 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
        </div>
        <h2 className="text-xl font-black text-zinc-900 mb-2">Oops! Ada Kesalahan 👨‍🍳</h2>
        <p className="text-sm text-zinc-500 mb-6">
          Koki gagal memasak halaman ini. Mungkin server sedang sibuk atau koneksi terputus.
        </p>
        <button
          onClick={() => reset()}
          className="bg-pink-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-pink-700 shadow-sm transition"
        >
          Coba Muat Ulang
        </button>
      </div>
    </div>
  );
}