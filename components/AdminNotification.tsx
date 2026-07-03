"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";

type Notification = {
  id: string;
  title: string;
  message: string;
  orderId: string | null;
  isRead: boolean;
  createdAt: string;
};

function formatWaktu(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Baru saja";
  if (diff < hour) return `${Math.floor(diff / minute)} menit yang lalu`;
  if (diff < day) return `${Math.floor(diff / hour)} jam yang lalu`;
  if (diff < 2 * day) return "Kemarin";

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const prevUnreadCount = useRef(0);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000); // 15 detik
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (unreadCount > prevUnreadCount.current) {
      try {
        const audio = new Audio('/notif.mp3');
        audio.play().catch(e => console.warn("Audio play failed:", e));
      } catch (error) {
        console.warn("Audio not ready:", error);
      }
    }
    prevUnreadCount.current = unreadCount;
  }, [unreadCount]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
      
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic update
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));

      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
      fetchNotifications();
    }
  };

  const handleBukaDetail = async (e: React.MouseEvent, notif: Notification) => {
    e.preventDefault();
    if (!notif.isRead) {
      await markAsRead(notif.id);
    }
    setIsOpen(false);
    // Halaman list pesanan ada di /admin?tab=pesanan sesuai struktur yang digunakan sebelumnya
    router.push(`/admin?tab=pesanan&search=${notif.orderId}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-zinc-100 hover:bg-zinc-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.16)] transition-all duration-300 ease-in-out"
      >
        <Bell className="w-5 h-5 text-zinc-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full animate-pulse shadow-sm border border-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-zinc-100 overflow-hidden flex flex-col animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 bg-zinc-50/80 backdrop-blur-sm">
            <h3 className="font-bold text-zinc-800 text-sm">Notifikasi</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-soft-pink-600 font-bold hover:text-soft-pink-700 hover:underline transition-all"
              >
                Tandai semua dibaca
              </button>
            )}
          </div>
          
          <div className="max-h-[24rem] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 flex flex-col items-center justify-center h-48">
                <div className="w-12 h-12 bg-zinc-50 rounded-full flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-zinc-300" />
                </div>
                <p className="text-sm font-medium">Tidak ada notifikasi baru</p>
                <p className="text-xs mt-1 text-zinc-400">Pemberitahuan akan muncul di sini</p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-50">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 transition-colors duration-200 hover:bg-zinc-50 ${notif.isRead ? "bg-white" : "bg-blue-50/30"}`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {!notif.isRead ? (
                          <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-zinc-900' : 'text-zinc-700'}`}>
                          {notif.title}
                        </h4>
                        <p className={`text-xs mt-1 leading-relaxed ${!notif.isRead ? 'text-zinc-700 font-medium' : 'text-zinc-500'}`}>
                          {notif.message}
                        </p>
                        
                        <div className="flex items-center justify-between mt-3">
                          <span className="text-[10px] font-medium text-zinc-400">
                            {formatWaktu(notif.createdAt)}
                          </span>
                          
                          <div className="flex items-center gap-2">
                            {notif.orderId && (
                              <button
                                onClick={(e) => handleBukaDetail(e, notif)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-soft-pink-600 hover:text-soft-pink-700 bg-soft-pink-50 hover:bg-soft-pink-100 px-2.5 py-1.5 rounded-md transition-colors"
                              >
                                <ExternalLink size={12} /> Buka Detail
                              </button>
                            )}
                            {!notif.isRead && (
                              <button
                                onClick={() => markAsRead(notif.id)}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1.5 rounded-md transition-colors"
                                title="Tandai sudah dibaca"
                              >
                                <Check size={12} /> Dibaca
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
