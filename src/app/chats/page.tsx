"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { MOCK_CHATS } from "@/lib/mockChats";

export default function ChatsPage() {
  const unreadTotal = MOCK_CHATS.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="min-h-screen bg-[#08080B] text-white pb-24">
      <div className="flex items-center gap-3 px-5 py-4">
        <Link href="/" className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif font-bold text-xl text-white leading-none">Chats</h1>
          {unreadTotal > 0 && (
            <span className="font-mono text-[11px] text-white/45">{unreadTotal} sin leer</span>
          )}
        </div>
      </div>

      <div className="flex flex-col">
        {MOCK_CHATS.map((c) => (
          <Link
            key={c.id}
            href={`/chats/${c.id}`}
            className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07]"
          >
            <div className="relative w-[54px] h-[54px] rounded-xl overflow-hidden shrink-0 bg-[#101014]">
              <Image src={c.avatar} alt={c.name} fill className="object-cover" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[15px] font-bold text-white truncate">{c.name}, {c.age}</span>
              </div>
              <span className="text-[12px] text-white/55 truncate">
                {c.sector} · {c.online ? "en línea" : "desconectada"}
              </span>
              <span className="text-[12px] text-white/45 truncate">{c.lastMessage}</span>
            </div>
            {c.unread > 0 && (
              <span className="w-5 h-5 rounded-full bg-brand-gold text-[#08080B] font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                {c.unread}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
