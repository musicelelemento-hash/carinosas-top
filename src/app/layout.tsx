import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display, Alex_Brush } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const alexBrush = Alex_Brush({
  variable: "--font-alex-brush",
  weight: "400",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#08080C",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Cariñosas.top | Directorio VIP & Acompañantes Élite en Ecuador",
  description: "El estándar de oro en discreción y exclusividad. Perfiles 4K verificados, notas de voz auténticas y reservas directas en Quito, Guayaquil, Cuenca y Manta.",
  keywords: [
    "Cariñosas Ecuador", 
    "Acompañantes VIP Quito", 
    "Modelos Guayaquil", 
    "Escorts Samborondón", 
    "Cumbayá VIP", 
    "Modelos 4K Ecuador", 
    "Directorio de Lujo"
  ],
  authors: [{ name: "Cariñosas.top Elite" }],
  creator: "Cariñosas.top",
  publisher: "Cariñosas.top",
  manifest: "/manifest.json",
  metadataBase: new URL("https://carinosas.top"),
  alternates: {
    canonical: "https://carinosas.top",
  },
  openGraph: {
    title: "Cariñosas.top | Experiencias de Alto Nivel en Ecuador",
    description: "Perfiles 4K verificados con total discreción y encriptación de grado militar en Quito, Guayaquil y Cuenca.",
    url: "https://carinosas.top",
    siteName: "Cariñosas.top",
    images: [
      {
        url: "/og-luxury.png",
        width: 1200,
        height: 630,
        alt: "Cariñosas.top Obsidian Elite",
      },
    ],
    locale: "es_EC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cariñosas.top | Acompañantes VIP en Ecuador",
    description: "Directorio selecto 4K en Quito, Guayaquil y Cuenca. Máxima privacidad.",
    images: ["/og-luxury.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cariñosas VIP",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

import MobileBottomNav from "@/components/MobileBottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://carinosas.top/#website",
        "url": "https://carinosas.top",
        "name": "Cariñosas.top",
        "description": "Directorio Élite de Modelos y Acompañantes VIP en Ecuador",
        "inLanguage": "es-EC",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://carinosas.top/?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "@id": "https://carinosas.top/#organization",
        "name": "Cariñosas.top Elite",
        "url": "https://carinosas.top",
        "logo": "https://carinosas.top/og-luxury.png"
      }
    ]
  };

  return (
    <html lang="es-EC" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${alexBrush.variable} antialiased bg-[#08080C] text-white selection:bg-brand-gold selection:text-brand-black pb-20 md:pb-0`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
