import { useState } from "react";
import useSWR from "swr";
import { Loader2, Star, MessageSquareReply, X } from "lucide-react";

export default function UlasanTable() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data: responseData, isLoading: loading, mutate: fetchUlasan } = useSWR("/api/admin/ulasan", fetcher, { refreshInterval: 10000, keepPreviousData: true });
  const data = responseData?.data || [];

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const currentData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // State untuk Modal Balasan
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [replyText, setReplyText] = useState("");
  const [submitting, setSubmitting] = useState(false);



  const handleBalas = async () => {
    if (!replyText.trim() || !selectedReview) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/ulasan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedReview.id, adminReply: replyText }),
      });
      if (res.ok) {
        fetchUlasan();
        setSelectedReview(null);
        setReplyText("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-zinc-600 gap-2">
        <Loader2 className="animate-spin text-soft-pink-500" size={24} />
        <p className="text-sm">Menarik data Ulasan Pelanggan...</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl border border-pink-100 bg-white shadow-sm overflow-hidden mb-8">
        <div className="p-5 md:p-6 border-b border-pink-100 flex justify-between items-end">
          <div>
            <h3 className="font-bold text-zinc-900">Daftar Ulasan Pelanggan</h3>
            <p className="text-xs text-zinc-600">Feedback langsung dari pembeli terverifikasi.</p>
          </div>
        </div>
        <div className="w-full pb-4 px-4 md:px-0">
          <table className="block w-full md:table text-left text-sm md:whitespace-nowrap">
            <thead className="hidden md:table-header-group">
              <tr className="border-b border-pink-100 text-zinc-600">
                <th className="pb-3 font-semibold px-4 pt-4">Pelanggan</th>
                <th className="pb-3 font-semibold px-2 pt-4">Produk</th>
                <th className="pb-3 font-semibold px-2 pt-4">Rating</th>
                <th className="pb-3 font-semibold px-2 pt-4 min-w-[200px]">Komentar</th>
                <th className="pb-3 font-semibold px-2 pt-4">Tanggal</th>
                <th className="pb-3 font-semibold px-4 pt-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="block w-full md:table-row-group">
              {currentData.length === 0 ? (
                <tr className="block w-full md:table-row">
                  <td colSpan={6} className="block md:table-cell text-center py-8 text-zinc-600 font-medium">
                    Belum ada ulasan masuk.
                  </td>
                </tr>
              ) : (
                currentData.map((u) => (
                  <tr key={u.id} className="block w-full mb-4 border border-pink-100 rounded-xl p-4 shadow-sm md:table-row md:border-b md:border-pink-50 md:rounded-none md:p-0 md:shadow-none hover:bg-pink-50/30 transition-colors md:mb-0 last:border-0">
                    <td className="flex justify-between items-center md:table-cell py-2 border-b border-pink-50 md:py-4 md:border-0 px-2 md:px-4">
                      <span className="md:hidden font-bold text-zinc-600">Pelanggan:</span>
                      <p className="font-bold text-zinc-900">{u.namaReviewer}</p>
                    </td>
                    <td className="flex justify-between items-center md:table-cell py-2 border-b border-pink-50 md:py-4 md:border-0 px-2 text-right md:text-left">
                      <span className="md:hidden font-bold text-zinc-600">Produk:</span>
                      <span className="text-zinc-600 font-medium whitespace-normal md:whitespace-nowrap truncate md:overflow-visible w-48 md:w-auto text-right md:text-left">{u.namaProduk}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell py-2 border-b border-pink-50 md:py-4 md:border-0 px-2">
                      <span className="md:hidden font-bold text-zinc-600">Rating:</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={i < u.rating ? "fill-current" : "text-zinc-300"} />
                        ))}
                      </div>
                    </td>
                    <td className="flex flex-col md:table-cell py-2 border-b border-pink-50 md:py-4 md:border-0 px-2 text-zinc-700 whitespace-normal min-w-[200px]">
                      <span className="md:hidden font-bold text-zinc-600 mb-1">Komentar:</span>
                      <p>{u.comment}</p>
                      {u.adminReply && (
                        <div className="mt-2 bg-pink-50 p-2 rounded text-xs text-pink-700 border border-pink-100">
                          <strong>Balasan Admin:</strong> {u.adminReply}
                        </div>
                      )}
                    </td>
                    <td className="flex justify-between items-center md:table-cell py-2 border-b border-pink-50 md:py-4 md:border-0 px-2 text-xs text-zinc-600">
                      <span className="md:hidden font-bold text-zinc-600">Tanggal:</span>
                      <span>{new Date(u.dibuatPada).toLocaleDateString("id-ID")}</span>
                    </td>
                    <td className="flex justify-between items-center md:table-cell py-3 md:py-4 md:border-0 px-2 md:px-4 text-right">
                      <span className="md:hidden font-bold text-zinc-600">Aksi:</span>
                      <button
                        onClick={() => {
                          setSelectedReview(u);
                          setReplyText(u.adminReply || "");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-soft-pink-50 text-soft-pink-600 hover:bg-soft-pink-100 rounded-lg text-xs font-bold transition-colors border border-soft-pink-200"
                      >
                        <MessageSquareReply size={14} /> Balas
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-4 border-t border-pink-50 flex items-center justify-between bg-zinc-50/50">
            <span className="text-sm text-zinc-600 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm border rounded-md bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedReview && (
        <div className="fixed inset-0 z-[99999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl relative animate-in zoom-in-95">
            <button
              onClick={() => setSelectedReview(null)}
              className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-600 transition"
            >
              <X size={20} />
            </button>
            <h3 className="font-bold text-lg text-zinc-900 mb-4">Balas Ulasan Pelanggan</h3>
            <div className="mb-4 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <p className="text-xs text-zinc-600 mb-1">Komentar dari <span className="font-bold text-zinc-900">{selectedReview.namaReviewer}</span></p>
              <p className="text-sm text-zinc-700">{selectedReview.comment}</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-zinc-700 mb-2">Pesan Balasan</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Tuliskan pesan terima kasih atau tanggapan Anda..."
                  className="w-full h-32 p-3 border border-zinc-200 rounded-xl focus:border-soft-pink-500 focus:ring-1 focus:ring-soft-pink-500 outline-none text-sm resize-none"
                />
              </div>
              <button
                onClick={handleBalas}
                disabled={submitting || !replyText.trim()}
                className="w-full py-3 bg-soft-pink-600 hover:bg-soft-pink-700 text-white rounded-xl font-bold disabled:opacity-50 transition-colors flex justify-center items-center gap-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : "Kirim Balasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
