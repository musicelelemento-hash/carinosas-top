import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: 'Cariñosas.top | Encuentros VIP en Ecuador',
  description: 'El directorio de mayor exclusividad en Quito, Guayaquil y Cuenca. Fotos 100% verificadas',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Cariñosas.top',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable} ${playfair.variable} ${alexBrush.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
