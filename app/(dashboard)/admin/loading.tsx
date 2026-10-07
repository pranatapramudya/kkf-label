import AdminSkeleton from "@/components/admin/AdminSkeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-zinc-50 flex w-full">
      <div className="hidden md:block w-64 border-r bg-white min-h-screen">
        <div className="p-6 h-full flex flex-col gap-6 animate-pulse">
           <div className="h-8 w-32 bg-zinc-200 rounded"></div>
           <div className="space-y-4 mt-8">
             <div className="h-10 bg-zinc-100 rounded"></div>
             <div className="h-10 bg-zinc-100 rounded"></div>
             <div className="h-10 bg-zinc-100 rounded"></div>
             <div className="h-10 bg-zinc-100 rounded"></div>
           </div>
        </div>
      </div>
      <div className="flex-1 w-full bg-white">
        <AdminSkeleton />
      </div>
    </div>
  );
}
