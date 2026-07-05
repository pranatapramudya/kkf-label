export default function LoadingKatalog() {
  return (
    <div className="kontainer-halaman py-6 pb-32 md:py-10 md:pb-32 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Skeleton */}
      <div className="mb-6 md:mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-8 md:h-10 w-48 md:w-64 bg-zinc-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 md:h-5 w-64 md:w-80 bg-zinc-200 rounded-md animate-pulse"></div>
        </div>
        <div className="flex gap-2 w-full md:w-auto overflow-x-hidden">
          <div className="h-9 md:h-10 w-20 md:w-24 bg-zinc-200 rounded-full animate-pulse shrink-0"></div>
          <div className="h-9 md:h-10 w-24 md:w-32 bg-zinc-200 rounded-full animate-pulse shrink-0"></div>
          <div className="h-9 md:h-10 w-24 md:w-32 bg-zinc-200 rounded-full animate-pulse shrink-0"></div>
        </div>
      </div>

      {/* Category Chips Skeleton */}
      <div className="flex gap-2 overflow-x-hidden pb-3 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-9 w-20 md:w-24 bg-zinc-200 rounded-full animate-pulse shrink-0"></div>
        ))}
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-2 gap-3 md:gap-4 md:grid-cols-4 lg:grid-cols-5">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <div key={i} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm animate-pulse">
            <div className="w-full aspect-square bg-zinc-200"></div>
            <div className="p-3 md:p-4">
              <div className="h-4 w-3/4 bg-zinc-200 rounded mb-2"></div>
              <div className="h-5 w-1/2 bg-zinc-200 rounded mb-3"></div>
              <div className="flex gap-2 mt-2">
                 <div className="h-3 w-1/4 bg-zinc-200 rounded"></div>
                 <div className="h-3 w-1/3 bg-zinc-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
