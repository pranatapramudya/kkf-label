import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Targetkan semua rute admin
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  // Ekstrak userId langsung biar bebas TS Error
  const { userId } = await auth();

  // Jika user mencoba masuk area admin TAPI belum login
  if (isAdminRoute(req) && !userId) {
    // Jangan redirect jika dia sedang berada tepat di halaman login admin (/admin)
    if (req.nextUrl.pathname !== '/admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
