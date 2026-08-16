import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdPublishingPortal from "@/components/AdPublishingPortal";

export const metadata: Metadata = {
  title: "Publicar Anuncio VIP | Cariñosas.top Ecuador",
  description: "Únete al círculo más exclusivo de modelos y acompañantes VIP en Ecuador. Destaca tu perfil en Machala, Guayaquil, Quito y Cuenca con verificación 4K y contacto directo.",
  keywords: ["publicar anuncio escorts ecuador", "anuncios vip machala", "acompañantes guayaquil", "escorts quito vip", "publicar perfil cariñosas top"]
};

export default function PublicarAnuncioPage() {
  return (
    <main className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <AdPublishingPortal />
      <Footer />
    </main>
  );
}
