import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SecretVaultView from "@/components/SecretVaultView";

export const metadata: Metadata = {
  title: "Bóveda Secreta 4K · Club Diamante VIP | Cariñosas.top Ecuador",
  description: "Acceso confidencial a contenido multimedia 4K exclusivo, sesiones en vídeo 360° y reservas de suites ejecutivas con modelos verificadas en Ecuador.",
};

export default function BovedaSecretaPage() {
  return (
    <main className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <SecretVaultView />
      <Footer />
    </main>
  );
}
