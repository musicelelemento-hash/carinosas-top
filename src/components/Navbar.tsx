import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-brand-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-serif text-brand-gold tracking-tighter">
              CARIÑOSAS.TOP
            </Link>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="/publicar" 
              className="bg-brand-gold hover:bg-brand-gold/90 text-brand-black px-6 py-2.5 rounded-full font-bold text-sm transition-all transform hover:scale-105 shadow-gold active:scale-95"
            >
              Publicar Anuncio
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
