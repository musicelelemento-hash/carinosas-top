import ModelStudioDashboard from "@/components/ModelStudioDashboard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Panel Privado de la Modelo | Cariñosas.top Studio",
  description: "Centro de control exclusivo para acompañantes de alta gama. Gestiona tu disponibilidad en vivo, métricas de WhatsApp y giras internacionales.",
};

export default function ModelPanelPage() {
  return (
    <main className="min-h-screen bg-brand-black flex flex-col justify-between">
      <Navbar />
      <ModelStudioDashboard />
      <Footer />
    </main>
  );
}
