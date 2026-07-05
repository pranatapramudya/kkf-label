export default function AdminSkeleton() {
  return (
    <div className="w-full space-y-6 animate-pulse p-4">
      <div className="h-10 bg-pink-50 rounded-xl w-1/3 mb-6"></div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-zinc-50 border border-zinc-100 rounded-2xl"></div>
        ))}
      </div>
      
      <div className="h-96 bg-zinc-50 border border-zinc-100 rounded-2xl w-full mt-6"></div>
    </div>
  );
}
