import Navbar from "@/components/Navbar";
import RegistrationAssistant from "@/components/RegistrationAssistant";

export const dynamic = "force-dynamic";

export default function RegistrationPage() {
  return (
    <main className="min-h-screen bg-brand-black pt-32 pb-20">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-serif text-brand-gold mb-6">
          Únete a la Élite
        </h1>
        <p className="text-brand-white/60 text-lg max-w-2xl mx-auto">
          Cariñosas.top es el directorio más exclusivo de Ecuador. Nuestro asistente inteligente te ayudará a crear un perfil de lujo en segundos.
        </p>
      </div>

      <RegistrationAssistant />
    </main>
  );
}
