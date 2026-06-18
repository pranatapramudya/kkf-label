import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination() {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <button className="grid h-10 w-10 place-items-center rounded-full border border-pink-100 bg-white text-zinc-700 transition hover:bg-soft-pink-50" aria-label="Halaman sebelumnya">
        <ChevronLeft size={18} />
      </button>
      {[1, 2, 3].map((nomor) => (
        <button
          key={nomor}
          className={`grid h-10 w-10 place-items-center rounded-full text-sm font-semibold ${
            nomor === 1
              ? "bg-soft-pink-500 text-white"
              : "border border-pink-100 bg-white text-zinc-700 hover:bg-soft-pink-50"
          }`}
        >
          {nomor}
        </button>
      ))}
      <button className="grid h-10 w-10 place-items-center rounded-full border border-pink-100 bg-white text-zinc-700 transition hover:bg-soft-pink-50" aria-label="Halaman berikutnya">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
