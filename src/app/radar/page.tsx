import React from "react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import GeoRadarFullscreen from "@/components/GeoRadarFullscreen";

export const metadata: Metadata = {
  title: "Geo-Radar 4K GPS | Cariñosas.top Ecuador",
  description: "Ubica acompañantes y modelos VIP en tiempo real con geolocalización inmediata en Machala, Guayaquil, Quito y todo Ecuador.",
};

export default function RadarPage() {
  return (
    <main className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <GeoRadarFullscreen />
      <Footer />
    </main>
  );
}
