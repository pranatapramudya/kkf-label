import { clerkMiddleware, createRouteMatcher, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Rute yang butuh perlindungan login
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

// Whitelist email admin
const ADMIN_EMAILS = [
  "kkflabel@gmail.com",
  "pranatapramudya39@gmail.com",
  "pranajaya52@gmail.com",
  "uwen.rejekismd@gmail.com",
];

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Jika mencoba mengakses area admin
  if (isAdminRoute(req)) {
    // 1. Cek apakah sudah login
    if (!userId) {
      // Arahkan ke rute sign-in yang sebenarnya jika belum login
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
      // 2. Ambil data user dari Clerk untuk mengecek email yang terdaftar
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      const email = user.emailAddresses[0]?.emailAddress;

      // 3. Validasi apakah email user ada di dalam whitelist admin
      if (!email || !ADMIN_EMAILS.includes(email)) {
        // Jika bukan admin, arahkan ke beranda (atau bisa ke halaman pelanggan lainnya)
        return NextResponse.redirect(new URL("/", req.url));
      }
    } catch (error) {
      console.error("Gagal mengambil data user dari Clerk:", error);
      // Demi keamanan, jika gagal mengecek, jangan berikan akses
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
