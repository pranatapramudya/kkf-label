import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Kunci pintu khusus rute /admin dan /affiliate/*
const isProtectedRoute = createRouteMatcher([
  "/admin(.*)",
  "/api/admin(.*)",
  "/affiliate/dashboard(.*)",
  "/affiliate/profil(.*)",
]);

// 🔥 FIX: Tambahkan 'async' di sini
export default clerkMiddleware(async (auth, req) => {
  let res = NextResponse.next();

  if (isProtectedRoute(req)) {
    const authObj = await auth();
    const { userId } = authObj;

    // Kalau KTP kosong, tendang paksa ke sign-in atau return 401
    if (!userId) {
      if (req.nextUrl.pathname.startsWith("/api/")) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }
      
      if (req.nextUrl.pathname.startsWith("/admin")) {
        // Biarkan lolos jika sedang berada tepat di /admin (Halaman Login Admin)
        if (req.nextUrl.pathname === "/admin") {
          return NextResponse.next();
        }
        // Jika mencoba mengakses sub-rute admin (misal /admin/pesanan), tendang balik ke /admin
        return NextResponse.redirect(new URL("/admin", req.url));
      } else {
        return NextResponse.redirect(new URL("/sign-in", req.url));
      }
    }
  }

  // Affiliate Tracking
  const url = req.nextUrl;
  const ref = url.searchParams.get("ref");
  if (ref) {
    res.cookies.set({
      name: "affiliate_ref",
      value: ref,
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 hari
    });
  }

  return res;
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
