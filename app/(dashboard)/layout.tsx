"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, User, History, LogOut } from "lucide-react";
import { useClerk } from "@clerk/nextjs";

const navItems = [
  { label: "Dashboard", href: "/affiliate/dashboard", icon: LayoutDashboard },
  { label: "Profil", href: "/affiliate/profil", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { signOut } = useClerk();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Brand */}
          <Link
            href="/affiliate/dashboard"
            className="flex items-center gap-2 font-black text-indigo-600 text-lg tracking-tight"
          >
            <span className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <LayoutDashboard size={14} className="text-white" />
            </span>
            Mitra KKF
          </Link>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-indigo-50 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Dropdown Nav */}
        {menuOpen && (
          <nav className="border-t border-slate-100 bg-white animate-in slide-in-from-top-2 duration-200">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-5 py-3.5 text-sm font-semibold transition-colors border-b border-slate-50 last:border-0 ${
                    isActive
                      ? "text-indigo-600 bg-indigo-50/60"
                      : "text-slate-700 hover:bg-slate-50 hover:text-indigo-600"
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? "text-indigo-500" : "text-slate-400"}
                  />
                  {item.label}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  )}
                </Link>
              );
            })}

            {/* Sign Out */}
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="w-full flex items-center gap-3 px-5 py-3.5 text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={18} />
              Keluar
            </button>
          </nav>
        )}
      </header>

      {/* Desktop Sidebar (optional, hidden on mobile) */}
      <div className="hidden md:flex fixed left-0 top-0 h-full w-56 bg-white border-r border-slate-100 flex-col py-8 px-4 z-40">
        <Link
          href="/affiliate/dashboard"
          className="flex items-center gap-2 font-black text-indigo-600 text-lg tracking-tight mb-8 px-2"
        >
          <span className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <LayoutDashboard size={16} className="text-white" />
          </span>
          Mitra KKF
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600"
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={() => signOut({ redirectUrl: "/" })}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>

      {/* Main Content */}
      <div className="md:ml-56">{children}</div>
    </div>
  );
}
