import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeChatView from "@/components/ConciergeChatView";

export const metadata: Metadata = {
  title: "Concierge VIP Élite | Cariñosas.top Ecuador",
  description: "Chat confidencial y encriptado 24/7 para coordinar acompañamiento selecto en Machala, Guayaquil, Quito y todo Ecuador con máxima discreción.",
};

export default function ConciergePage() {
  return (
    <main className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <ConciergeChatView />
      <Footer />
    </main>
  );
}
