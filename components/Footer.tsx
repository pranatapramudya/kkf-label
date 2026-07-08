"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Mail, MapPin, Sparkles, ShoppingBag } from "lucide-react";

const tautanBantuan = [
  { label: "Lacak Pesanan", href: "/lacak-pesanan" },
];

export function Footer() {
  const pathname = usePathname();

  // KUNCIAN: Sembunyikan Footer di halaman Admin, Checkout, Lacak Pesanan, DAN DETAIL PRODUK
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/produk/") ||
    pathname.startsWith("/akun") || // 👈 Ini yang bikin footer hilang di halaman detail!
    pathname.startsWith("/rekomendasi") ||
    pathname === "/checkout" ||
    pathname === "/lacak-pesanan"
  ) {
    return null;
  }

  return (
    <footer
      id="kontak"
      className="mt-16 border-t border-pink-100 bg-soft-pink-50/70"
    >
      <div className="kontainer-halaman grid gap-10 py-12 sm:grid-cols-1 md:grid-cols-3">
        <div className="hidden md:block">
          {/* Kolom kosong untuk menjaga layout grid 3 kolom jika diperlukan, atau bisa dihapus dan diubah jadi grid-cols-2 */}
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Bantuan</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            {tautanBantuan.map((tautan) => (
              <li key={tautan.label}>
                <Link
                  href={tautan.href}
                  className="transition hover:text-soft-pink-600"
                >
                  {tautan.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-zinc-900">Kontak & Toko</h3>
          <ul className="mt-4 space-y-3 text-sm text-zinc-600">
            <li className="flex items-center gap-2">
              <Instagram size={16} className="text-soft-pink-500" />
              <a
                href="https://www.instagram.com/kkf_label"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-soft-pink-600 font-medium"
              >
                Instagram: kkf_label
              </a>
            </li>
            <li className="flex items-center gap-2">
              <ShoppingBag size={16} className="text-soft-pink-500" />
              <a
                href="https://shopee.co.id/kkf_label"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-soft-pink-600 font-medium"
              >
                Shopee: kkf_label
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="text-soft-pink-500" />
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kkflabel@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-soft-pink-600 font-medium"
              >
                kkflabel@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={16} className="text-soft-pink-500" />
              Sumedang, Indonesia
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-pink-100 py-5 text-center text-xs text-zinc-500">
        © <Link href="/admin" className="text-zinc-500 outline-none">2026</Link> kkf_label. Semua hak dilindungi.
      </div>
    </footer>
  );
}
