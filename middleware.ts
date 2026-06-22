import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rute yang butuh perlindungan login
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Jika mencoba mengakses area admin TAPI belum login
  if (isAdminRoute(req) && !userId) {
    // Arahkan ke rute sign-in yang sebenarnya
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
