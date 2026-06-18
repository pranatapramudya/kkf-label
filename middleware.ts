import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Kunci pintu khusus rute /admin dan semua halaman di dalamnya
const isProtectedRoute = createRouteMatcher(["/admin(.*)"]);

// 🔥 FIX: Tambahkan 'async' di sini
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // 🔥 FIX: Wajib pakai 'await' karena di versi terbaru auth() adalah Promise
    const { userId } = await auth();

    // Kalau KTP kosong, tendang paksa ke sign-in
    if (!userId) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
