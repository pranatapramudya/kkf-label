"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  ShoppingBag,
  AlertCircle,
  Home,
  Truck,
  User, // 🔥 Ikon User untuk menu "Saya"
} from "lucide-react";
import { useKeranjang } from "@/context/CartContext";

export function Navbar() {
  const { jumlahItem } = useKeranjang();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);

  const [activeNav, setActiveNav] = useState("/");

  useEffect(() => {
    setActiveNav(window.location.hash || pathname);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/rekomendasi")) return null;

  const cegahCheckoutKosong = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (jumlahItem === 0) {
      e.preventDefault();
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  // 🔥 FIX: Menu Kontak diganti jadi Saya ala Shopee
  const navItems = [
    { name: "Beranda", href: "/", icon: Home },
    { name: "Lacak", href: "/lacak-pesanan", icon: Truck },
    { name: "Keranjang", href: "/checkout", icon: ShoppingBag, isCart: true },
    { name: "Saya", href: "/akun", icon: User }, // 👈 Ini dia menu barunya!
  ];

  return (
    <>
      <div
        className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${showToast ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}
      >
        <div className="bg-zinc-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-medium border border-zinc-700 w-max max-w-[90vw]">
          <AlertCircle size={18} className="text-soft-pink-500 flex-shrink-0" />
          <span>Keranjang masih kosong, sis! Pilih produk dulu yuk. 🛍️</span>
        </div>
      </div>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/70 bg-white/70 backdrop-blur-md h-16 flex items-center">
        <nav className="kontainer-halaman flex h-full w-full items-center justify-between relative z-50">
          <div className="flex-1 flex justify-start items-center">
            <Link
              href="/"
              prefetch={true}
              className="flex items-center group gap-3"
              onClick={() => setActiveNav("/")}
            >
              <Image
                src="/logo-kkf.png"
                alt="Logo KKF Label"
                width={40}
                height={40}
                className="object-contain h-10 w-10 flex-shrink-0"
                priority
              />
              <span className="text-xl font-black tracking-tighter text-zinc-900 group-hover:text-soft-pink-600 transition-colors uppercase">
                KKF LABEL
              </span>
            </Link>
          </div>

          {/* Menu Desktop */}
          <div className="hidden md:flex flex-1 justify-center items-center gap-7 text-sm font-medium text-zinc-700">
            <Link className="transition hover:text-soft-pink-600" href="/" prefetch={true}>
              Katalog
            </Link>
            <Link
              className="transition hover:text-soft-pink-600"
              href="/lacak-pesanan"
            >
              Lacak Pesanan
            </Link>
            <Link className="transition hover:text-soft-pink-600" href="/akun">
              Saya
            </Link>
          </div>

          <div className="flex-1 flex justify-end items-center gap-2">
            <Link
              href="/checkout"
              className="relative flex items-center justify-center min-h-[44px] min-w-[44px] bg-white border border-pink-200 rounded-full text-soft-pink-500 hover:bg-soft-pink-50 transition-all shadow-sm"
              onClick={cegahCheckoutKosong}
              aria-label="Lihat Keranjang Belanja"
            >
              <ShoppingBag size={20} />
              {jumlahItem > 0 && (
                <span className="absolute -top-1 -right-1 bg-zinc-900 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                  {jumlahItem}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {!pathname.startsWith("/produk/") &&
        !pathname.startsWith("/checkout") && (
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-[90] bg-white border-t border-pink-100 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)] h-16">
            <div className="flex items-center justify-around h-full px-2">
              {navItems.map((item) => {
                const isActive = item.href === "/" ? pathname === "/" : activeNav === item.href;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (item.isCart && jumlahItem === 0) {
                        cegahCheckoutKosong(e);
                        return;
                      }
                      setActiveNav(item.href);
                    }}
                    className="relative flex flex-col items-center justify-center gap-1 w-16 h-full min-h-[44px]"
                    aria-label={`Navigasi ke ${item.name}`}
                  >
                    <div
                      className={`transition-all duration-300 ease-in-out flex items-center justify-center ${
                        isActive
                          ? "absolute -top-5 h-14 w-14 bg-soft-pink-600 text-white rounded-full shadow-lg border-4 border-white"
                          : "relative h-8 w-8 text-zinc-400 hover:text-soft-pink-500"
                      }`}
                    >
                      <item.icon size={isActive ? 24 : 22} />
                      {item.isCart && jumlahItem > 0 && (
                        <span
                          className={`absolute bg-zinc-900 text-white font-bold flex items-center justify-center rounded-full transition-all ${
                            isActive
                              ? "top-0 right-0 h-5 w-5 text-[10px] border-2 border-white"
                              : "-top-1 -right-1 h-4 w-4 text-[9px]"
                          }`}
                        >
                          {jumlahItem}
                        </span>
                      )}
                    </div>
                    <span
                      className={`transition-all duration-300 font-bold mt-1 ${
                        isActive
                          ? "absolute bottom-1 text-[10px] text-soft-pink-600"
                          : "relative text-[9px] text-zinc-500"
                      }`}
                    >
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
    </>
  );
}
