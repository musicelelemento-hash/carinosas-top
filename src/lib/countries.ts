/**
 * ==============================================================================
 * CARIÑOSAS.TOP — GLOBAL MULTI-COUNTRY DATASET (OBSIDIAN ELITE)
 * ==============================================================================
 * Ecuador, Colombia, Perú, Panamá, México, España, USA (Miami)
 */

export interface Canton {
  id: string;
  name: string;
  isPopular?: boolean;
}

export interface Province {
  id: string;
  name: string;
  region?: string;
  cantons: Canton[];
}

export interface Country {
  id: string;
  name: string;
  flag: string;
  image: string;
  tagline: string;
  accentColor: string;
  available: boolean;
  provinces: Province[];
  dialCode: string;
  currency: string;
  currencySymbol: string;
}

export const REGION_COLORS: Record<string, string> = {
  Sierra: "#D4A843",
  Costa: "#3B82F6",
  Oriente: "#22C55E",
  General: "#D4A843",
  "Zona Andina": "#D4A843",
  "Zona Caribe": "#3B82F6",
  "Zona Pacífico": "#3B82F6",
  "Comunidad Centro": "#D4A843",
  "Comunidad Mediterráneo": "#3B82F6",
  Florida: "#D4A843"
};

export const COUNTRIES: Country[] = [
  {
    id: "ecuador",
    name: "Ecuador",
    flag: "🇪🇨",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    tagline: "Quito, Guayaquil, Cuenca, Samborondón",
    accentColor: "#D4A843",
    available: true,
    dialCode: "+593",
    currency: "USD",
    currencySymbol: "$",
    provinces: [
      {
        id: "pichincha",
        name: "Pichincha",
        region: "Sierra",
        cantons: [
          { id: "quito", name: "Quito (La Carolina / Cumbayá)", isPopular: true },
          { id: "ruminahui", name: "Rumiñahui (Valle de los Chillos)", isPopular: true },
          { id: "mejia", name: "Mejía (Machachi)" }
        ]
      },
      {
        id: "guayas",
        name: "Guayas",
        region: "Costa",
        cantons: [
          { id: "guayaquil", name: "Guayaquil (Puerto Santa Ana)", isPopular: true },
          { id: "samborondon", name: "Samborondón VIP", isPopular: true },
          { id: "daule", name: "Daule (La Aurora)", isPopular: true },
          { id: "duran", name: "Durán" }
        ]
      },
      {
        id: "azuay",
        name: "Azuay",
        region: "Sierra",
        cantons: [
          { id: "cuenca", name: "Cuenca (El Vergel / Centro)", isPopular: true },
          { id: "gualaceo", name: "Gualaceo" }
        ]
      },
      {
        id: "manabi",
        name: "Manabí",
        region: "Costa",
        cantons: [
          { id: "manta", name: "Manta (Plaza del Sol)", isPopular: true },
          { id: "portoviejo", name: "Portoviejo" }
        ]
      },
      {
        id: "santa-elena",
        name: "Santa Elena",
        region: "Costa",
        cantons: [
          { id: "salinas", name: "Salinas (Chipipe VIP)", isPopular: true },
          { id: "la-libertad", name: "La Libertad" }
        ]
      }
    ]
  },
  {
    id: "colombia",
    name: "Colombia",
    flag: "🇨🇴",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    tagline: "Medellín, Bogotá, Cartagena, Cali",
    accentColor: "#F59E0B",
    available: true,
    dialCode: "+57",
    currency: "COP / USD",
    currencySymbol: "$",
    provinces: [
      {
        id: "antioquia",
        name: "Antioquia",
        region: "Zona Andina",
        cantons: [
          { id: "medellin-poblado", name: "Medellín (El Poblado / Provenza)", isPopular: true },
          { id: "medellin-laureles", name: "Medellín (Laureles)", isPopular: true },
          { id: "llanogrande", name: "Rionegro / Llanogrande VIP", isPopular: true }
        ]
      },
      {
        id: "bogota-dc",
        name: "Bogotá D.C.",
        region: "Zona Andina",
        cantons: [
          { id: "bogota-chico", name: "Bogotá (Chicó / Zona T)", isPopular: true },
          { id: "bogota-rosales", name: "Bogotá (Rosales / Parque 93)", isPopular: true },
          { id: "bogota-santa-ana", name: "Bogotá (Santa Ana / Usaquén)" }
        ]
      },
      {
        id: "bolivar",
        name: "Bolívar",
        region: "Zona Caribe",
        cantons: [
          { id: "cartagena-bocagrande", name: "Cartagena (Bocagrande VIP)", isPopular: true },
          { id: "cartagena-amurallada", name: "Cartagena (Ciudad Amurallada)", isPopular: true }
        ]
      },
      {
        id: "valle",
        name: "Valle del Cauca",
        region: "Zona Pacífico",
        cantons: [
          { id: "cali-granada", name: "Cali (Granada / Ciudad Jardín)", isPopular: true }
        ]
      }
    ]
  },
  {
    id: "peru",
    name: "Perú",
    flag: "🇵🇪",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    tagline: "Lima (Miraflores, San Isidro), Cusco",
    accentColor: "#EF4444",
    available: true,
    dialCode: "+51",
    currency: "PEN / USD",
    currencySymbol: "S/.",
    provinces: [
      {
        id: "lima",
        name: "Lima Metropolitana",
        region: "Costa",
        cantons: [
          { id: "lima-miraflores", name: "Miraflores VIP", isPopular: true },
          { id: "lima-san-isidro", name: "San Isidro Golf", isPopular: true },
          { id: "lima-barranco", name: "Barranco Bohemia VIP", isPopular: true },
          { id: "lima-surco", name: "Santiago de Surco (Chacarilla)" }
        ]
      },
      {
        id: "cusco",
        name: "Cusco",
        region: "Sierra",
        cantons: [
          { id: "cusco-centro", name: "Cusco Centro Histórico VIP", isPopular: true }
        ]
      }
    ]
  },
  {
    id: "panama",
    name: "Panamá",
    flag: "🇵🇦",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    tagline: "Ciudad de Panamá, Punta Pacífica",
    accentColor: "#3B82F6",
    available: true,
    dialCode: "+507",
    currency: "USD",
    currencySymbol: "$",
    provinces: [
      {
        id: "panama-prov",
        name: "Panamá",
        region: "Costa",
        cantons: [
          { id: "panama-punta-pacifica", name: "Punta Pacífica VIP", isPopular: true },
          { id: "panama-costa-este", name: "Costa del Este", isPopular: true },
          { id: "panama-obarrio", name: "Obarrio / Calle 50", isPopular: true },
          { id: "panama-casco", name: "Casco Antiguo" }
        ]
      }
    ]
  },
  {
    id: "mexico",
    name: "México",
    flag: "🇲🇽",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    tagline: "CDMX (Polanco), Cancún, Monterrey",
    accentColor: "#10B981",
    available: true,
    dialCode: "+52",
    currency: "MXN / USD",
    currencySymbol: "$",
    provinces: [
      {
        id: "cdmx-state",
        name: "Ciudad de México",
        region: "General",
        cantons: [
          { id: "cdmx-polanco", name: "Polanco VIP", isPopular: true },
          { id: "cdmx-santa-fe", name: "Santa Fe", isPopular: true },
          { id: "cdmx-condesa", name: "Condesa / Roma Norte", isPopular: true },
          { id: "cdmx-lomas", name: "Lomas de Chapultepec" }
        ]
      },
      {
        id: "quintana-roo",
        name: "Quintana Roo",
        region: "Costa",
        cantons: [
          { id: "cancun-hotelera", name: "Cancún (Zona Hotelera VIP)", isPopular: true },
          { id: "playa-carmen", name: "Playa del Carmen / Tulum", isPopular: true }
        ]
      },
      {
        id: "nuevo-leon",
        name: "Nuevo León",
        region: "General",
        cantons: [
          { id: "monterrey-san-pedro", name: "San Pedro Garza García VIP", isPopular: true },
          { id: "monterrey-valle", name: "Valle Oriente" }
        ]
      }
    ]
  },
  {
    id: "espana",
    name: "España",
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    tagline: "Madrid (Salamanca), Barcelona, Marbella",
    accentColor: "#EC4899",
    available: true,
    dialCode: "+34",
    currency: "EUR",
    currencySymbol: "€",
    provinces: [
      {
        id: "madrid-com",
        name: "Comunidad de Madrid",
        region: "Comunidad Centro",
        cantons: [
          { id: "madrid-salamanca", name: "Barrio de Salamanca VIP", isPopular: true },
          { id: "madrid-chamberi", name: "Chamberí / Castellana", isPopular: true },
          { id: "madrid-moraleja", name: "La Moraleja VIP" }
        ]
      },
      {
        id: "catalunya",
        name: "Catalunya",
        region: "Comunidad Mediterráneo",
        cantons: [
          { id: "bcn-eixample", name: "Barcelona (Eixample VIP)", isPopular: true },
          { id: "bcn-sarria", name: "Sarrià - Sant Gervasi", isPopular: true },
          { id: "bcn-gracia", name: "Passeig de Gràcia" }
        ]
      },
      {
        id: "andalucia",
        name: "Andalucía",
        region: "Costa",
        cantons: [
          { id: "marbella-banus", name: "Marbella (Puerto Banús VIP)", isPopular: true }
        ]
      }
    ]
  },
  {
    id: "usa",
    name: "USA (Miami VIP)",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
    tagline: "Miami (Brickell, South Beach)",
    accentColor: "#8B5CF6",
    available: true,
    dialCode: "+1",
    currency: "USD",
    currencySymbol: "$",
    provinces: [
      {
        id: "florida",
        name: "Florida",
        region: "Florida",
        cantons: [
          { id: "miami-brickell", name: "Miami (Brickell Financial VIP)", isPopular: true },
          { id: "miami-sobe", name: "Miami Beach (South Beach)", isPopular: true },
          { id: "miami-bal-harbour", name: "Bal Harbour / Sunny Isles", isPopular: true }
        ]
      }
    ]
  }
];

export function getCountryById(id: string): Country {
  return COUNTRIES.find((c) => c.id === id) || COUNTRIES[0];
}

export function getAllCountries(): Country[] {
  return COUNTRIES;
}

export function getProvincesByCountry(countryId: string): Province[] {
  const country = getCountryById(countryId);
  return country ? country.provinces : [];
}
