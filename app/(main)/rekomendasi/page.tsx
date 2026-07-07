"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Sparkles, User, Loader2, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat, type UIMessage } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import ReactMarkdown from 'react-markdown';
import Image from 'next/image';
const initialMessageFallback: UIMessage[] = [
  {
    id: "init-1",
    role: "assistant",
    parts: [{
      type: 'text',
      text: "Halo! Saya AI Virtual Stylist KKF Label. Mau bepergian kemana hari ini? Biar kami siapkan rekomendasi outfit yang paling cocok untuk kamu!"
    }]
  }
];

export default function RekomendasiOutfitPage() {
  const router = useRouter();
  const [input, setInput] = useState("");

  const { messages, status, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/chat'
    }),
    messages: initialMessageFallback,
    onError: (err) => {
      console.error("AI Chat API Error:", err);
    }
  });

  const isLoading = status === 'submitted' || status === 'streaming';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", parts: [{ type: "text", text: input }] });
    setInput("");
  };

  const displayMessages = messages.length > 0 ? messages : initialMessageFallback;
  const userMessageCount = messages.filter((m) => m.role === 'user').length;
  const isRateLimited = userMessageCount >= 3;

  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfMessagesRef.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [displayMessages, isLoading]);

  return (
    <div className="flex flex-col h-[100dvh] bg-white overflow-hidden">
      {/* Header */}
      <div className="shrink-0 flex items-center gap-3 p-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-white shadow-sm">
        <button
          onClick={() => router.back()}
          className="p-2 bg-white rounded-full text-zinc-500 hover:bg-pink-100 hover:text-pink-600 transition-colors shadow-sm border border-zinc-100"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 shadow-sm border border-pink-200 shrink-0">
            <Image src="/icons/icon-technical-support.png" alt="AI Stylist" width={24} height={24} className="object-contain" />
          </div>
          <div>
            <h1 className="text-base font-bold text-zinc-800">AI Stylist KKF</h1>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <p className="text-[11px] text-zinc-500 font-medium">Online • Siap membantu</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-zinc-50/50">
        <div className="max-w-3xl mx-auto w-full space-y-5">
          {displayMessages.map((msg) => (
            <div key={msg.id} className={`flex gap-3 max-w-[90%] md:max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}>
              <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm ${msg.role === "user" ? "bg-zinc-800 text-white" : "bg-gradient-to-br from-pink-400 to-pink-500 text-white border border-pink-300"}`}>
                {msg.role === "user" ? <User className="w-4 h-4" /> : <Image src="/icons/icon-technical-support.png" alt="AI Stylist" width={20} height={20} className="object-contain" />}
              </div>
              <div className={`p-3.5 rounded-2xl text-sm shadow-sm ${msg.role === "user"
                ? "bg-zinc-800 text-white rounded-tr-sm"
                : "bg-white text-zinc-700 border border-pink-100 rounded-tl-sm leading-relaxed"
                }`}>
                <ReactMarkdown
                  components={{
                    img: ({ node, ...props }) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img {...props} className="max-w-full rounded-md mt-2 mb-2 shadow-sm border border-pink-100" />
                    ),
                    a: ({ node, ...props }) => (
                      <a {...props} className="text-pink-600 hover:text-pink-700 font-medium underline underline-offset-2" target="_blank" rel="noopener noreferrer" />
                    ),
                    p: ({ node, ...props }) => (
                      <p {...props} className="mb-2 last:mb-0" />
                    )
                  }}
                >
                  {((msg as any).content || msg.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('')) as string}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-1 shadow-sm bg-gradient-to-br from-pink-400 to-pink-500 text-white border border-pink-300">
                <Image src="/icons/icon-technical-support.png" alt="AI Stylist" width={20} height={20} className="object-contain" />
              </div>
              <div className="px-4 py-3.5 rounded-2xl bg-white border border-pink-100 text-zinc-500 rounded-tl-sm flex items-center gap-2 shadow-sm">
                <Loader2 className="w-4 h-4 animate-spin text-pink-400" />
                <span className="text-xs font-medium animate-pulse">Mengetik...</span>
              </div>
            </div>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="shrink-0 p-4 bg-white border-t w-full">
        {/* Quick Reply Chips */}
        {userMessageCount === 0 && !isRateLimited && (
          <div 
            className="flex gap-2 overflow-x-auto pb-3 mb-1 snap-x max-w-3xl mx-auto w-full"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {["Outfit santai buat ngopi", "Rekomendasi baju ngantor", "Baju elegan buat kondangan"].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => {
                  if (isLoading) return;
                  sendMessage({ role: "user", parts: [{ type: "text", text: chip }] });
                }}
                className="shrink-0 snap-start bg-white text-pink-600 border border-pink-200 text-xs font-medium px-4 py-2 rounded-full hover:bg-pink-50 transition-colors shadow-sm whitespace-nowrap"
              >
                💡 {chip}
              </button>
            ))}
          </div>
        )}
        <form onSubmit={(e) => {
          handleSubmit(e);
        }} className="relative flex items-center max-w-3xl mx-auto w-full">
          <input
            type="text"
            value={input || ''}
            onChange={handleInputChange}
            placeholder={isRateLimited ? "Batas konsultasi harian habis. Silakan klik produk di atas untuk berbelanja!" : "Tanya soal outfit..."}
            disabled={isLoading || isRateLimited}
            className={`w-full border border-zinc-200 text-sm rounded-full py-3.5 pl-5 pr-14 focus:outline-none transition-all ${
              isRateLimited 
                ? 'bg-zinc-200 text-zinc-500 cursor-not-allowed border-zinc-300' 
                : 'bg-zinc-100/50 text-zinc-800 focus:ring-2 focus:ring-pink-300 focus:bg-white disabled:opacity-50'
            }`}
          />
          <button
            type="submit"
            disabled={isLoading || isRateLimited}
            className="absolute right-1.5 p-2.5 bg-pink-500 text-white rounded-full hover:bg-pink-600 disabled:bg-zinc-300 disabled:text-zinc-500 transition-all shadow-md disabled:shadow-none"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </form>
        {error && (
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-red-500 text-white text-xs px-4 py-2 rounded-full shadow-lg">
            Error Backend: Gagal terhubung ke AI. Cek console browser/terminal.
          </div>
        )}
      </div>
    </div>
  );
}
