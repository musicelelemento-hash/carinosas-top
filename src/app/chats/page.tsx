"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Conversation {
  model_id: string;
  model_name: string;
  model_age?: number;
  avatar?: string;
  sector?: string;
  city?: string;
}

export default function ChatsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionKey, setSessionKey] = useState("");

  useEffect(() => {
    let sk = "";
    try {
      sk = localStorage.getItem("carinosas_session") || "";
    } catch {}
    setSessionKey(sk);
    if (!sk) { setLoading(false); return; }

    (async () => {
      const { data } = await supabase
        .from("chat_threads")
        .select("model_id, model:models(name, age, images, sector, city)")
        .eq("session_key", sk)
        .order("updated_at", { ascending: false })
        .limit(30);
      if (data) {
        const mapped = (data as Array<Record<string, unknown>>).map((t) => {
          const m = Array.isArray(t.model) ? t.model[0] : t.model;
          return {
            model_id: t.model_id as string,
            model_name: (m as Record<string, unknown>)?.name as string || "Perfil",
            model_age: (m as Record<string, unknown>)?.age as number | undefined,
            avatar: ((m as Record<string, unknown>)?.images as string[] | undefined)?.[0],
            sector: (m as Record<string, unknown>)?.sector as string | undefined,
            city: (m as Record<string, unknown>)?.city as string | undefined,
          };
        }).filter((c) => c.model_id);
        setConversations(mapped);
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[#08080B] text-white pb-24 md:pb-0">
      <div className="flex items-center gap-3 px-5 py-4">
        <Link href="/" className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif font-bold text-xl text-white leading-none">Chats</h1>
          <span className="font-mono text-[11px] text-white/45">
            {conversations.length} conversación{conversations.length === 1 ? "" : "es"}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="text-center text-white/40 text-sm py-10">Cargando...</p>
      ) : conversations.length === 0 ? (
        <div className="text-center py-16 px-6">
          <MessageCircle size={40} className="mx-auto text-white/20" />
          <p className="font-serif text-lg font-bold text-white mt-3">Aún no tienes conversaciones</p>
          <p className="text-white/50 text-sm mt-1 max-w-xs mx-auto">
            Explora los perfiles y escribe para agendar un encuentro privado.
          </p>
          <Link href="/" className="inline-block mt-6 px-6 py-3 rounded-2xl bg-brand-gold text-brand-black font-bold text-sm">
            Descubrir perfiles
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          {conversations.map((c) => (
            <Link
              key={c.model_id}
              href={`/chats/${c.model_id}`}
              className="flex items-center gap-3 px-5 py-3 border-b border-white/[0.07]"
            >
              <div className="relative w-[54px] h-[54px] rounded-xl overflow-hidden shrink-0 bg-[#101014]">
                <Image
                  src={c.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400"}
                  alt={c.model_name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-[15px] font-bold text-white truncate">
                    {c.model_name}{c.model_age ? `, ${c.model_age}` : ""}
                  </span>
                </div>
                <span className="text-[12px] text-white/55 truncate">
                  {c.sector ? `${c.sector} · ` : ""}{c.city || "Perfil"}
                </span>
                <span className="text-[12px] text-white/45 truncate">Toca para continuar la conversación</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
