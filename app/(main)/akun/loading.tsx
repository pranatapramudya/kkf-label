export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50/50 pb-24 px-4 pt-6">
      <div className="max-w-3xl mx-auto animate-pulse">
        {/* Header Akun */}
        <div className="flex items-center gap-4 mb-8">
          <div className="h-16 w-16 bg-zinc-200 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 bg-zinc-200 rounded"></div>
            <div className="h-3 w-1/4 bg-zinc-200 rounded-full"></div>
          </div>
        </div>

        {/* Tab Status */}
        <div className="bg-white rounded-2xl shadow-sm border border-zinc-100 p-4 mb-5 space-y-4">
          <div className="h-4 w-1/4 bg-zinc-200 rounded mb-4"></div>
          <div className="flex justify-between px-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 bg-zinc-200 rounded-full"></div>
                <div className="h-2 w-10 bg-zinc-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Skeleton Pesanan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-zinc-100 p-4 h-48">
              <div className="flex justify-between mb-4">
                <div className="h-3 w-1/3 bg-zinc-200 rounded"></div>
                <div className="h-4 w-1/5 bg-zinc-200 rounded"></div>
              </div>
              <div className="flex gap-3 mb-4">
                <div className="h-20 w-20 bg-zinc-200 rounded-xl shrink-0"></div>
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-3 w-full bg-zinc-200 rounded"></div>
                  <div className="h-3 w-2/3 bg-zinc-200 rounded"></div>
                  <div className="h-4 w-1/3 bg-zinc-200 rounded mt-2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}