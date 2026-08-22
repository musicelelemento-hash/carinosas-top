import type { Metadata, Viewport } from "next";
import { Montserrat, Playfair_Display, Alex_Brush, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
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
  title: {
    default: "Cariñosas.top | Directorio VIP & Acompañantes Élite en Ecuador e Internacional",
    template: "%s | Cariñosas.top Elite"
  },
  description: "El estándar de oro en discreción, sofisticación y exclusividad. Perfiles 4K verificados biométricamente, notas de voz auténticas y reservas directas en Quito, Guayaquil, Cuenca, Medellín, Lima, Panamá y Miami.",
  keywords: [
    "Cariñosas Ecuador", 
    "Acompañantes VIP Quito", 
    "Modelos Guayaquil", 
    "Escorts Samborondón", 
    "Cumbayá VIP", 
    "Modelos 4K Ecuador", 
    "Directorio de Lujo",
    "Modelos Medellín VIP",
    "Acompañantes Lima Miraflores",
    "Escorts Ciudad de Panamá",
    "Modelos Polanco CDMX",
    "Acompañantes Miami VIP"
  ],
  authors: [{ name: "Cariñosas.top Obsidian Elite" }],
  creator: "Cariñosas.top",
  publisher: "Cariñosas.top",
  manifest: "/manifest.json",
  metadataBase: new URL("https://carinosas.top"),
  alternates: {
    canonical: "https://carinosas.top",
    languages: {
      "es-EC": "https://carinosas.top",
      "es-CO": "https://carinosas.top?country=colombia",
      "es-PE": "https://carinosas.top?country=peru",
      "es-PA": "https://carinosas.top?country=panama",
      "es-MX": "https://carinosas.top?country=mexico",
      "es-ES": "https://carinosas.top?country=espana",
      "es-US": "https://carinosas.top?country=usa",
      "x-default": "https://carinosas.top",
    },
  },
  other: {
    "geo.region": "EC",
    "geo.placename": "Quito, Guayaquil, Cuenca, Samborondón",
    "geo.position": "-0.180653;-78.467834",
    "ICBM": "-0.180653, -78.467834",
    "rating": "adult",
    "content-language": "es",
  },
  openGraph: {
    title: "Cariñosas.top | Experiencias de Alto Nivel & Modelos VIP 4K",
    description: "Perfiles 4K verificados biométricamente con total privacidad, discreción absoluta y canal directo en Quito, Guayaquil, Cuenca y destinos internacionales.",
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
    title: "Cariñosas.top | Directorio Selecto VIP 4K",
    description: "Modelos 4K verificadas con notas de voz y total privacidad en Ecuador e Internacional.",
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
        "description": "Directorio Élite de Modelos y Acompañantes VIP en Ecuador e Internacional",
        "inLanguage": "es",
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
        "logo": "https://carinosas.top/og-luxury.png",
        "sameAs": [
          "https://t.me/carinosas_top",
          "https://twitter.com/carinosas_top"
        ]
      },
      {
        "@type": "ItemList",
        "@id": "https://carinosas.top/#directory",
        "name": "Directorio de Ciudades Élite",
        "itemListElement": [
          { "@type": "SiteNavigationElement", "position": 1, "name": "Quito VIP", "url": "https://carinosas.top/?city=Quito" },
          { "@type": "SiteNavigationElement", "position": 2, "name": "Guayaquil VIP", "url": "https://carinosas.top/?city=Guayaquil" },
          { "@type": "SiteNavigationElement", "position": 3, "name": "Cuenca VIP", "url": "https://carinosas.top/?city=Cuenca" },
          { "@type": "SiteNavigationElement", "position": 4, "name": "Samborondón VIP", "url": "https://carinosas.top/?city=Samborondón" },
          { "@type": "SiteNavigationElement", "position": 5, "name": "Medellín VIP", "url": "https://carinosas.top/?country=colombia&city=Medellín" },
          { "@type": "SiteNavigationElement", "position": 6, "name": "Lima VIP", "url": "https://carinosas.top/?country=peru&city=Lima" },
          { "@type": "SiteNavigationElement", "position": 7, "name": "Ciudad de Panamá VIP", "url": "https://carinosas.top/?country=panama&city=Panamá" }
        ]
      }
    ]
  };

  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${montserrat.variable} ${playfair.variable} ${alexBrush.variable} ${jetbrainsMono.variable} antialiased bg-[#08080C] text-white selection:bg-brand-gold selection:text-brand-black pb-20 md:pb-0`}
      >
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
