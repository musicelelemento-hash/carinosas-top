/**
 * ==============================================================================
 * CARIÑOSAS.TOP — GLOBAL MULTI-COUNTRY DATASET (OBSIDIAN ELITE)
 * ==============================================================================
 * Ecuador (24 Provincias y todos sus cantones), Colombia, Perú, Panamá, México, España, USA
 */

export interface Canton {
  id: string;
  name: string;
  isPopular?: boolean;
}

export interface Province {
  id: string;
  name: string;
  region?: 'Costa' | 'Sierra' | 'Oriente' | 'Insular' | 'General' | 'Zona Andina' | 'Zona Caribe' | 'Zona Pacífico' | 'Comunidad Centro' | 'Comunidad Mediterráneo' | 'Florida' | string;
  cantons: Canton[];
}

export interface MapCityPreset {
  center: [number, number];
  zoom: number;
  label: string;
  countryId: string;
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
  defaultCity: string;
  mapPresets: Record<string, { center: [number, number]; zoom: number; label: string }>;
}

export const REGION_COLORS: Record<string, string> = {
  Sierra: "#D4A843",
  Costa: "#3B82F6",
  Oriente: "#22C55E",
  Insular: "#06B6D4",
  General: "#D4A843",
  "Zona Andina": "#D4A843",
  "Zona Caribe": "#3B82F6",
  "Zona Pacífico": "#3B82F6",
  "Comunidad Centro": "#D4A843",
  "Comunidad Mediterráneo": "#3B82F6",
  Florida: "#8B5CF6"
};

export const COUNTRIES: Country[] = [
  // ── 1. ECUADOR (PRINCIPAL — 24 PROVINCIAS COMPLETAS) ─────────────────────────
  {
    id: "ecuador",
    name: "Ecuador",
    flag: "🇪🇨",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800",
    tagline: "Quito, Guayaquil, Cuenca, Samborondón, Manta, Ambato, Machala",
    accentColor: "#D4A843",
    available: true,
    dialCode: "+593",
    currency: "USD",
    currencySymbol: "$",
    defaultCity: "Quito",
    mapPresets: {
      "Quito": { center: [-0.1807, -78.4678], zoom: 13, label: "Quito" },
      "Guayaquil": { center: [-2.1894, -79.8891], zoom: 13, label: "Guayaquil" },
      "Samborondón": { center: [-2.1378, -79.8667], zoom: 14, label: "Samborondón VIP" },
      "Cuenca": { center: [-2.9001, -79.0059], zoom: 13, label: "Cuenca" },
      "Manta": { center: [-0.9621, -80.7127], zoom: 13, label: "Manta" },
      "Machala": { center: [-3.2581, -79.9161], zoom: 13, label: "Machala" },
      "Santo Domingo": { center: [-0.2520, -79.1714], zoom: 13, label: "Sto. Domingo" },
      "Ambato": { center: [-1.2417, -78.6197], zoom: 13, label: "Ambato" },
      "Salinas": { center: [-2.2178, -80.9587], zoom: 13, label: "Salinas" },
      "Loja": { center: [-3.9931, -79.2042], zoom: 13, label: "Loja" },
      "Portoviejo": { center: [-1.0544, -80.4545], zoom: 13, label: "Portoviejo" },
      "Ibarra": { center: [0.3517, -78.1223], zoom: 13, label: "Ibarra" },
      "Riobamba": { center: [-1.6636, -78.6546], zoom: 13, label: "Riobamba" }
    },
    provinces: [
      {
        id: "pichincha",
        name: "Pichincha",
        region: "Sierra",
        cantons: [
          { id: "quito", name: "Quito (La Carolina / Cumbayá)", isPopular: true },
          { id: "ruminahui", name: "Rumiñahui (Valle de los Chillos)", isPopular: true },
          { id: "cayambe", name: "Cayambe", isPopular: false },
          { id: "mejia", name: "Mejía (Machachi)", isPopular: false },
          { id: "san-miguel-de-los-bancos", name: "San Miguel de los Bancos", isPopular: false },
          { id: "pedro-moncayo", name: "Pedro Moncayo (Tabacundo)", isPopular: false },
          { id: "pedro-vicente-maldonado", name: "Pedro Vicente Maldonado", isPopular: false },
          { id: "puerto-quito", name: "Puerto Quito", isPopular: false }
        ]
      },
      {
        id: "guayas",
        name: "Guayas",
        region: "Costa",
        cantons: [
          { id: "guayaquil", name: "Guayaquil (Puerto Santa Ana / Urdesa)", isPopular: true },
          { id: "samborondon", name: "Samborondón VIP", isPopular: true },
          { id: "daule", name: "Daule (La Aurora / Ciudad Celeste)", isPopular: true },
          { id: "duran", name: "Durán", isPopular: true },
          { id: "milagro", name: "Milagro", isPopular: true },
          { id: "playas", name: "Playas (General Villamil)", isPopular: true },
          { id: "naranjal", name: "Naranjal", isPopular: false },
          { id: "el-empalme", name: "El Empalme", isPopular: false },
          { id: "el-triunfo", name: "El Triunfo", isPopular: false },
          { id: "balzar", name: "Balzar", isPopular: false },
          { id: "pedro-carbo", name: "Pedro Carbo", isPopular: false },
          { id: "san-jacinto-de-yaguachi", name: "Yaguachi", isPopular: false },
          { id: "salitre", name: "Salitre", isPopular: false },
          { id: "santa-lucia", name: "Santa Lucía", isPopular: false },
          { id: "naranjito", name: "Naranjito", isPopular: false },
          { id: "balao", name: "Balao", isPopular: false },
          { id: "colimes", name: "Colimes", isPopular: false },
          { id: "palestina", name: "Palestina", isPopular: false },
          { id: "nobol", name: "Nobol", isPopular: false },
          { id: "lomas-de-sargentillo", name: "Lomas de Sargentillo", isPopular: false },
          { id: "isidro-ayora", name: "Isidro Ayora", isPopular: false },
          { id: "coronel-marcelino-mariduena", name: "Marcelino Maridueña", isPopular: false },
          { id: "simon-bolivar", name: "Simón Bolívar", isPopular: false },
          { id: "general-antonio-elizalde", name: "Bucay (Gral. Elizalde)", isPopular: false },
          { id: "alfredo-baquerizo-moreno", name: "Jujan", isPopular: false }
        ]
      },
      {
        id: "azuay",
        name: "Azuay",
        region: "Sierra",
        cantons: [
          { id: "cuenca", name: "Cuenca (El Vergel / Centro)", isPopular: true },
          { id: "gualaceo", name: "Gualaceo", isPopular: true },
          { id: "paute", name: "Paute", isPopular: false },
          { id: "santa-isabel", name: "Santa Isabel", isPopular: false },
          { id: "giron", name: "Girón", isPopular: false },
          { id: "chordeleg", name: "Chordeleg", isPopular: false },
          { id: "camilo-ponce-enriquez", name: "Ponce Enríquez", isPopular: false },
          { id: "sigsig", name: "Sígsig", isPopular: false },
          { id: "san-fernando", name: "San Fernando", isPopular: false },
          { id: "nabon", name: "Nabón", isPopular: false },
          { id: "pucara", name: "Pucará", isPopular: false },
          { id: "ona", name: "Oña", isPopular: false },
          { id: "guachapala", name: "Guachapala", isPopular: false },
          { id: "el-pan", name: "El Pan", isPopular: false },
          { id: "sevilla-de-oro", name: "Sevilla de Oro", isPopular: false }
        ]
      },
      {
        id: "manabi",
        name: "Manabí",
        region: "Costa",
        cantons: [
          { id: "manta", name: "Manta (Plaza del Sol / Barbasquillo)", isPopular: true },
          { id: "portoviejo", name: "Portoviejo", isPopular: true },
          { id: "chone", name: "Chone", isPopular: true },
          { id: "montecristi", name: "Montecristi", isPopular: true },
          { id: "pedernales", name: "Pedernales", isPopular: true },
          { id: "sucre", name: "Bahía de Caráquez (Sucre)", isPopular: false },
          { id: "el-carmen", name: "El Carmen", isPopular: false },
          { id: "jipijapa", name: "Jipijapa", isPopular: false },
          { id: "puerto-lopez", name: "Puerto López", isPopular: false },
          { id: "jaramijo", name: "Jaramijó", isPopular: false },
          { id: "san-vicente", name: "San Vicente", isPopular: false },
          { id: "rocafuerte", name: "Rocafuerte", isPopular: false },
          { id: "tosagua", name: "Tosagua", isPopular: false },
          { id: "santa-ana", name: "Santa Ana", isPopular: false },
          { id: "jama", name: "Jama", isPopular: false },
          { id: "pajan", name: "Paján", isPopular: false },
          { id: "flavio-alfaro", name: "Flavio Alfaro", isPopular: false },
          { id: "junin", name: "Junín", isPopular: false },
          { id: "24-de-mayo", name: "24 de Mayo", isPopular: false },
          { id: "olmedo-manabi", name: "Olmedo", isPopular: false },
          { id: "pichincha-manabi", name: "Pichincha", isPopular: false }
        ]
      },
      {
        id: "santa-elena",
        name: "Santa Elena",
        region: "Costa",
        cantons: [
          { id: "salinas", name: "Salinas (Chipipe / San Lorenzo VIP)", isPopular: true },
          { id: "santa-elena", name: "Santa Elena (Montañita / Olón)", isPopular: true },
          { id: "la-libertad", name: "La Libertad", isPopular: true }
        ]
      },
      {
        id: "el-oro",
        name: "El Oro",
        region: "Costa",
        cantons: [
          { id: "machala", name: "Machala (Puerto Bolívar)", isPopular: true },
          { id: "pasaje", name: "Pasaje", isPopular: true },
          { id: "huaquillas", name: "Huaquillas (Frontera VIP)", isPopular: true },
          { id: "santa-rosa", name: "Santa Rosa", isPopular: true },
          { id: "zaruma", name: "Zaruma", isPopular: true },
          { id: "arenillas", name: "Arenillas", isPopular: false },
          { id: "pinas", name: "Piñas", isPopular: false },
          { id: "el-guabo", name: "El Guabo", isPopular: false },
          { id: "portovelo", name: "Portovelo", isPopular: false },
          { id: "balsas", name: "Balsas", isPopular: false },
          { id: "marcabeli", name: "Marcabelí", isPopular: false },
          { id: "chilla", name: "Chilla", isPopular: false },
          { id: "atahualpa", name: "Atahualpa", isPopular: false },
          { id: "las-lajas", name: "Las Lajas", isPopular: false }
        ]
      },
      {
        id: "tungurahua",
        name: "Tungurahua",
        region: "Sierra",
        cantons: [
          { id: "ambato", name: "Ambato (Ficoa / Miraflores)", isPopular: true },
          { id: "banos", name: "Baños de Agua Santa VIP", isPopular: true },
          { id: "pelileo", name: "Pelileo", isPopular: false },
          { id: "pillaro", name: "Píllaro", isPopular: false },
          { id: "cevallos", name: "Cevallos", isPopular: false },
          { id: "patate", name: "Patate", isPopular: false },
          { id: "tisaleo", name: "Tisaleo", isPopular: false },
          { id: "quero", name: "Quero", isPopular: false },
          { id: "mocha", name: "Mocha", isPopular: false }
        ]
      },
      {
        id: "santo-domingo",
        name: "Santo Domingo de los Tsáchilas",
        region: "Sierra",
        cantons: [
          { id: "santo-domingo", name: "Santo Domingo", isPopular: true },
          { id: "la-concordia", name: "La Concordia", isPopular: false }
        ]
      },
      {
        id: "los-rios",
        name: "Los Ríos",
        region: "Costa",
        cantons: [
          { id: "quevedo", name: "Quevedo (San Camilo)", isPopular: true },
          { id: "babahoyo", name: "Babahoyo", isPopular: true },
          { id: "vinces", name: "Vinces (París Chiquito)", isPopular: false },
          { id: "ventanas", name: "Ventanas", isPopular: false },
          { id: "buena-fe", name: "Buena Fe", isPopular: false },
          { id: "valencia", name: "Valencia", isPopular: false },
          { id: "montalvo", name: "Montalvo", isPopular: false },
          { id: "puebloviejo", name: "Puebloviejo", isPopular: false },
          { id: "mocache", name: "Mocache", isPopular: false },
          { id: "urdaneta", name: "Urdaneta (Catarama)", isPopular: false },
          { id: "palenque", name: "Palenque", isPopular: false },
          { id: "baba", name: "Baba", isPopular: false },
          { id: "quinsaloma", name: "Quinsaloma", isPopular: false }
        ]
      },
      {
        id: "imbabura",
        name: "Imbabura",
        region: "Sierra",
        cantons: [
          { id: "ibarra", name: "Ibarra", isPopular: true },
          { id: "otavalo", name: "Otavalo", isPopular: true },
          { id: "cotacachi", name: "Cotacachi", isPopular: false },
          { id: "antonio-ante", name: "Antonio Ante (Atuntaqui)", isPopular: false },
          { id: "pimampiro", name: "Pimampiro", isPopular: false },
          { id: "urcuqui", name: "Urcuquí (Yachay)", isPopular: false }
        ]
      },
      {
        id: "loja",
        name: "Loja",
        region: "Sierra",
        cantons: [
          { id: "loja", name: "Loja (El Valle / Centro)", isPopular: true },
          { id: "catamayo", name: "Catamayo", isPopular: true },
          { id: "calvas", name: "Calvas (Cariamanga)", isPopular: false },
          { id: "macara", name: "Macará", isPopular: false },
          { id: "saraguro", name: "Saraguro", isPopular: false },
          { id: "paltas", name: "Paltas (Catacocha)", isPopular: false },
          { id: "puyango", name: "Puyango (Alamor)", isPopular: false },
          { id: "celica", name: "Celica", isPopular: false },
          { id: "zapotillo", name: "Zapotillo", isPopular: false },
          { id: "espindola", name: "Espíndola (Amaluza)", isPopular: false },
          { id: "gonzanama", name: "Gonzanamá", isPopular: false },
          { id: "chaguarpamba", name: "Chaguarpamba", isPopular: false },
          { id: "sozoranga", name: "Sozoranga", isPopular: false },
          { id: "pindal", name: "Pindal", isPopular: false },
          { id: "quilanga", name: "Quilanga", isPopular: false },
          { id: "olmedo-loja", name: "Olmedo", isPopular: false }
        ]
      },
      {
        id: "chimborazo",
        name: "Chimborazo",
        region: "Sierra",
        cantons: [
          { id: "riobamba", name: "Riobamba", isPopular: true },
          { id: "alausi", name: "Alausí", isPopular: false },
          { id: "guano", name: "Guano", isPopular: false },
          { id: "colta", name: "Colta", isPopular: false },
          { id: "cumanda", name: "Cumandá", isPopular: false },
          { id: "pallatanga", name: "Pallatanga", isPopular: false },
          { id: "chambo", name: "Chambo", isPopular: false },
          { id: "chunchi", name: "Chunchi", isPopular: false },
          { id: "guamote", name: "Guamote", isPopular: false },
          { id: "penipe", name: "Penipe", isPopular: false }
        ]
      },
      {
        id: "cotopaxi",
        name: "Cotopaxi",
        region: "Sierra",
        cantons: [
          { id: "latacunga", name: "Latacunga", isPopular: true },
          { id: "la-mana", name: "La Maná", isPopular: true },
          { id: "salcedo", name: "Salcedo", isPopular: false },
          { id: "pujili", name: "Pujilí", isPopular: false },
          { id: "saquisili", name: "Saquisilí", isPopular: false },
          { id: "pangua", name: "Pangua (El Corazón)", isPopular: false },
          { id: "sigchos", name: "Sigchos", isPopular: false }
        ]
      },
      {
        id: "esmeraldas",
        name: "Esmeraldas",
        region: "Costa",
        cantons: [
          { id: "esmeraldas", name: "Esmeraldas (Las Palmas)", isPopular: true },
          { id: "atacames", name: "Atacames (Tonsupa / Sua)", isPopular: true },
          { id: "quininde", name: "Quinindé (Rosa Zárate)", isPopular: false },
          { id: "san-lorenzo", name: "San Lorenzo", isPopular: false },
          { id: "muisne", name: "Muisne", isPopular: false },
          { id: "rioverde", name: "Rioverde", isPopular: false },
          { id: "eloy-alfaro", name: "Eloy Alfaro (Limones)", isPopular: false }
        ]
      },
      {
        id: "canar",
        name: "Cañar",
        region: "Sierra",
        cantons: [
          { id: "azogues", name: "Azogues", isPopular: true },
          { id: "la-troncal", name: "La Troncal", isPopular: true },
          { id: "canar", name: "Cañar", isPopular: false },
          { id: "biblian", name: "Biblián", isPopular: false },
          { id: "el-tambo", name: "El Tambo", isPopular: false },
          { id: "deleg", name: "Déleg", isPopular: false },
          { id: "suscal", name: "Suscal", isPopular: false }
        ]
      },
      {
        id: "carchi",
        name: "Carchi",
        region: "Sierra",
        cantons: [
          { id: "tulcan", name: "Tulcán (Frontera Rumichaca)", isPopular: true },
          { id: "montufar", name: "Montúfar (San Gabriel)", isPopular: false },
          { id: "san-pedro-de-huaca", name: "Huaca", isPopular: false },
          { id: "espejo", name: "Espejo (El Ángel)", isPopular: false },
          { id: "mira", name: "Mira", isPopular: false },
          { id: "bolivar-carchi", name: "Bolívar", isPopular: false }
        ]
      },
      {
        id: "bolivar",
        name: "Bolívar",
        region: "Sierra",
        cantons: [
          { id: "guaranda", name: "Guaranda", isPopular: true },
          { id: "san-miguel-bolivar", name: "San Miguel", isPopular: false },
          { id: "caluma", name: "Caluma", isPopular: false },
          { id: "chimbo", name: "Chimbo", isPopular: false },
          { id: "echeandia", name: "Echeandía", isPopular: false },
          { id: "chillanes", name: "Chillanes", isPopular: false },
          { id: "las-naves", name: "Las Naves", isPopular: false }
        ]
      },
      {
        id: "sucumbios",
        name: "Sucumbíos",
        region: "Oriente",
        cantons: [
          { id: "lago-agrio", name: "Lago Agrio (Nueva Loja)", isPopular: true },
          { id: "shushufindi", name: "Shushufindi", isPopular: false },
          { id: "cuyabeno", name: "Cuyabeno", isPopular: false },
          { id: "gonzalo-pizarro", name: "Gonzalo Pizarro (Lumbaquí)", isPopular: false },
          { id: "putumayo", name: "Putumayo (Puerto El Carmen)", isPopular: false },
          { id: "cascales", name: "Cascales", isPopular: false },
          { id: "sucumbios-canton", name: "Sucumbíos (La Bonita)", isPopular: false }
        ]
      },
      {
        id: "orellana",
        name: "Orellana",
        region: "Oriente",
        cantons: [
          { id: "francisco-de-orellana", name: "El Coca (Fco. de Orellana)", isPopular: true },
          { id: "la-joya-de-los-sachas", name: "La Joya de los Sachas", isPopular: false },
          { id: "loreto", name: "Loreto", isPopular: false },
          { id: "aguarico", name: "Aguarico (Nuevo Rocafuerte)", isPopular: false }
        ]
      },
      {
        id: "pastaza",
        name: "Pastaza",
        region: "Oriente",
        cantons: [
          { id: "puyo", name: "Puyo (Pastaza)", isPopular: true },
          { id: "mera", name: "Mera (Shell)", isPopular: false },
          { id: "santa-clara", name: "Santa Clara", isPopular: false },
          { id: "arajuno", name: "Arajuno", isPopular: false }
        ]
      },
      {
        id: "napo",
        name: "Napo",
        region: "Oriente",
        cantons: [
          { id: "tena", name: "Tena", isPopular: true },
          { id: "archidona", name: "Archidona", isPopular: false },
          { id: "el-chaco", name: "El Chaco", isPopular: false },
          { id: "quijos", name: "Quijos (Baeza)", isPopular: false },
          { id: "carlos-julio-arosemena-tola", name: "Arosemena Tola", isPopular: false }
        ]
      },
      {
        id: "morona-santiago",
        name: "Morona Santiago",
        region: "Oriente",
        cantons: [
          { id: "macas", name: "Macas (Morona)", isPopular: true },
          { id: "sucua", name: "Sucúa", isPopular: false },
          { id: "gualaquiza", name: "Gualaquiza", isPopular: false },
          { id: "limon-indanza", name: "Limón Indanza", isPopular: false },
          { id: "palora", name: "Palora", isPopular: false },
          { id: "santiago-de-mendez", name: "Santiago de Méndez", isPopular: false },
          { id: "huamboya", name: "Huamboya", isPopular: false },
          { id: "san-juan-bosco", name: "San Juan Bosco", isPopular: false },
          { id: "taisha", name: "Taisha", isPopular: false },
          { id: "logrono", name: "Logroño", isPopular: false },
          { id: "pablo-sexto", name: "Pablo Sexto", isPopular: false },
          { id: "tiwintza", name: "Tiwintza", isPopular: false }
        ]
      },
      {
        id: "zamora-chinchipe",
        name: "Zamora Chinchipe",
        region: "Oriente",
        cantons: [
          { id: "zamora", name: "Zamora", isPopular: true },
          { id: "yantzaza", name: "Yantzaza", isPopular: false },
          { id: "el-pangui", name: "El Pangui", isPopular: false },
          { id: "centinela-del-condor", name: "Centinela del Cóndor", isPopular: false },
          { id: "chinchipe", name: "Chinchipe (Zumba)", isPopular: false },
          { id: "nangaritza", name: "Nangaritza", isPopular: false },
          { id: "palanda", name: "Palanda", isPopular: false },
          { id: "paquisha", name: "Paquisha", isPopular: false },
          { id: "yacuambi", name: "Yacuambi", isPopular: false }
        ]
      },
      {
        id: "galapagos",
        name: "Galápagos",
        region: "Insular",
        cantons: [
          { id: "santa-cruz", name: "Santa Cruz (Puerto Ayora VIP)", isPopular: true },
          { id: "san-cristobal", name: "San Cristóbal (Puerto Baquerizo)", isPopular: true },
          { id: "isabela", name: "Isabela (Puerto Villamil)", isPopular: false }
        ]
      }
    ]
  },

  // ── 2. COLOMBIA ─────────────────────────────────────────────────────────────
  {
    id: "colombia",
    name: "Colombia",
    flag: "🇨🇴",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=800",
    tagline: "Medellín, Bogotá, Cartagena, Cali, Barranquilla",
    accentColor: "#F59E0B",
    available: true,
    dialCode: "+57",
    currency: "COP / USD",
    currencySymbol: "$",
    defaultCity: "Medellín",
    mapPresets: {
      "Medellín": { center: [6.2442, -75.5812], zoom: 13, label: "Medellín" },
      "Bogotá": { center: [4.7110, -74.0721], zoom: 13, label: "Bogotá D.C." },
      "Cartagena": { center: [10.3910, -75.4794], zoom: 13, label: "Cartagena" },
      "Cali": { center: [3.4516, -76.5320], zoom: 13, label: "Cali" },
      "Barranquilla": { center: [10.9685, -74.7813], zoom: 13, label: "Barranquilla" }
    },
    provinces: [
      {
        id: "antioquia",
        name: "Antioquia",
        region: "Zona Andina",
        cantons: [
          { id: "medellin-poblado", name: "Medellín (El Poblado / Provenza VIP)", isPopular: true },
          { id: "medellin-laureles", name: "Medellín (Laureles / Conquistadores)", isPopular: true },
          { id: "llanogrande", name: "Rionegro / Llanogrande VIP", isPopular: true },
          { id: "envigado", name: "Envigado", isPopular: true },
          { id: "sabaneta", name: "Sabaneta", isPopular: false }
        ]
      },
      {
        id: "bogota-dc",
        name: "Bogotá D.C.",
        region: "Zona Andina",
        cantons: [
          { id: "bogota-chico", name: "Bogotá (Chicó / Zona T VIP)", isPopular: true },
          { id: "bogota-rosales", name: "Bogotá (Rosales / Parque 93)", isPopular: true },
          { id: "bogota-santa-ana", name: "Bogotá (Santa Ana / Usaquén VIP)", isPopular: true },
          { id: "bogota-salitre", name: "Bogotá (Ciudad Salitre)", isPopular: false }
        ]
      },
      {
        id: "bolivar",
        name: "Bolívar",
        region: "Zona Caribe",
        cantons: [
          { id: "cartagena-bocagrande", name: "Cartagena (Bocagrande VIP)", isPopular: true },
          { id: "cartagena-amurallada", name: "Cartagena (Ciudad Amurallada / Getsemaní)", isPopular: true },
          { id: "cartagena-laguito", name: "Cartagena (El Laguito / Castillogrande)", isPopular: true }
        ]
      },
      {
        id: "valle",
        name: "Valle del Cauca",
        region: "Zona Pacífico",
        cantons: [
          { id: "cali-granada", name: "Cali (Granada / Santa Mónica)", isPopular: true },
          { id: "cali-jardin", name: "Cali (Ciudad Jardín VIP)", isPopular: true }
        ]
      },
      {
        id: "atlantico",
        name: "Atlántico",
        region: "Zona Caribe",
        cantons: [
          { id: "barranquilla-norte", name: "Barranquilla (Alto Prado / Riomar)", isPopular: true }
        ]
      }
    ]
  },

  // ── 3. PERÚ ─────────────────────────────────────────────────────────────────
  {
    id: "peru",
    name: "Perú",
    flag: "🇵🇪",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=800",
    tagline: "Lima (Miraflores, San Isidro, Barranco), Cusco, Arequipa",
    accentColor: "#EF4444",
    available: true,
    dialCode: "+51",
    currency: "PEN / USD",
    currencySymbol: "S/.",
    defaultCity: "Lima",
    mapPresets: {
      "Lima (Miraflores)": { center: [-12.1217, -77.0297], zoom: 13, label: "Miraflores" },
      "San Isidro": { center: [-12.0975, -77.0364], zoom: 14, label: "San Isidro Golf" },
      "Cusco": { center: [-13.5319, -71.9675], zoom: 13, label: "Cusco" },
      "Arequipa": { center: [-16.4090, -71.5375], zoom: 13, label: "Arequipa" }
    },
    provinces: [
      {
        id: "lima",
        name: "Lima Metropolitana",
        region: "Costa",
        cantons: [
          { id: "lima-miraflores", name: "Miraflores VIP", isPopular: true },
          { id: "lima-san-isidro", name: "San Isidro Golf", isPopular: true },
          { id: "lima-barranco", name: "Barranco Bohemia VIP", isPopular: true },
          { id: "lima-surco", name: "Santiago de Surco (Chacarilla)", isPopular: true },
          { id: "lima-san-borja", name: "San Borja", isPopular: false }
        ]
      },
      {
        id: "cusco",
        name: "Cusco",
        region: "Sierra",
        cantons: [
          { id: "cusco-centro", name: "Cusco Centro Histórico VIP", isPopular: true }
        ]
      },
      {
        id: "arequipa",
        name: "Arequipa",
        region: "Sierra",
        cantons: [
          { id: "arequipa-cayma", name: "Arequipa (Cayma / Yanahuara)", isPopular: true }
        ]
      }
    ]
  },

  // ── 4. PANAMÁ ───────────────────────────────────────────────────────────────
  {
    id: "panama",
    name: "Panamá",
    flag: "🇵🇦",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=800",
    tagline: "Ciudad de Panamá, Punta Pacífica, Costa del Este, Obarrio",
    accentColor: "#3B82F6",
    available: true,
    dialCode: "+507",
    currency: "USD",
    currencySymbol: "$",
    defaultCity: "Ciudad de Panamá",
    mapPresets: {
      "Ciudad de Panamá": { center: [8.9824, -79.5199], zoom: 13, label: "Cd. de Panamá" },
      "Punta Pacífica": { center: [8.9765, -79.5085], zoom: 14, label: "Punta Pacífica" },
      "Costa del Este": { center: [9.0145, -79.4674], zoom: 14, label: "Costa del Este" }
    },
    provinces: [
      {
        id: "panama-prov",
        name: "Panamá",
        region: "Costa",
        cantons: [
          { id: "panama-punta-pacifica", name: "Punta Pacífica VIP", isPopular: true },
          { id: "panama-costa-este", name: "Costa del Este VIP", isPopular: true },
          { id: "panama-obarrio", name: "Obarrio / Calle 50", isPopular: true },
          { id: "panama-casco", name: "Casco Antiguo", isPopular: true },
          { id: "panama-san-francisco", name: "San Francisco / Coco del Mar", isPopular: true }
        ]
      }
    ]
  },

  // ── 5. MÉXICO ───────────────────────────────────────────────────────────────
  {
    id: "mexico",
    name: "México",
    flag: "🇲🇽",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=800",
    tagline: "CDMX (Polanco), Cancún, Monterrey (San Pedro), Guadalajara",
    accentColor: "#10B981",
    available: true,
    dialCode: "+52",
    currency: "MXN / USD",
    currencySymbol: "$",
    defaultCity: "Ciudad de México",
    mapPresets: {
      "CDMX (Polanco)": { center: [19.4326, -99.1932], zoom: 13, label: "Polanco VIP" },
      "Cancún": { center: [21.1391, -86.7578], zoom: 13, label: "Cancún Hotelera" },
      "Monterrey": { center: [25.6572, -100.3667], zoom: 13, label: "San Pedro Garza" },
      "Guadalajara": { center: [20.6597, -103.3496], zoom: 13, label: "Guadalajara" }
    },
    provinces: [
      {
        id: "cdmx-state",
        name: "Ciudad de México",
        region: "General",
        cantons: [
          { id: "cdmx-polanco", name: "Polanco VIP", isPopular: true },
          { id: "cdmx-santa-fe", name: "Santa Fe", isPopular: true },
          { id: "cdmx-condesa", name: "Condesa / Roma Norte", isPopular: true },
          { id: "cdmx-lomas", name: "Lomas de Chapultepec", isPopular: true }
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
          { id: "monterrey-valle", name: "Valle Oriente", isPopular: false }
        ]
      },
      {
        id: "jalisco",
        name: "Jalisco",
        region: "General",
        cantons: [
          { id: "gdl-puerta-hierro", name: "Guadalajara (Puerta de Hierro VIP)", isPopular: true },
          { id: "pto-vallarta", name: "Puerto Vallarta VIP", isPopular: true }
        ]
      }
    ]
  },

  // ── 6. ESPAÑA ───────────────────────────────────────────────────────────────
  {
    id: "espana",
    name: "España",
    flag: "🇪🇸",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800",
    tagline: "Madrid (Salamanca), Barcelona (Eixample), Marbella (Puerto Banús)",
    accentColor: "#EC4899",
    available: true,
    dialCode: "+34",
    currency: "EUR",
    currencySymbol: "€",
    defaultCity: "Madrid",
    mapPresets: {
      "Madrid": { center: [40.4284, -3.6845], zoom: 13, label: "Barrio Salamanca" },
      "Barcelona": { center: [41.3887, 2.1589], zoom: 13, label: "Eixample VIP" },
      "Marbella": { center: [36.4869, -4.9528], zoom: 13, label: "Puerto Banús" },
      "Ibiza": { center: [38.9067, 1.4206], zoom: 13, label: "Ibiza VIP" }
    },
    provinces: [
      {
        id: "madrid-com",
        name: "Comunidad de Madrid",
        region: "Comunidad Centro",
        cantons: [
          { id: "madrid-salamanca", name: "Barrio de Salamanca VIP", isPopular: true },
          { id: "madrid-chamberi", name: "Chamberí / Castellana", isPopular: true },
          { id: "madrid-moraleja", name: "La Moraleja VIP", isPopular: true },
          { id: "madrid-recoletos", name: "Recoletos / Jerónimos", isPopular: false }
        ]
      },
      {
        id: "catalunya",
        name: "Catalunya",
        region: "Comunidad Mediterráneo",
        cantons: [
          { id: "bcn-eixample", name: "Barcelona (Eixample VIP)", isPopular: true },
          { id: "bcn-sarria", name: "Sarrià - Sant Gervasi", isPopular: true },
          { id: "bcn-gracia", name: "Passeig de Gràcia", isPopular: true }
        ]
      },
      {
        id: "andalucia",
        name: "Andalucía",
        region: "Costa",
        cantons: [
          { id: "marbella-banus", name: "Marbella (Puerto Banús VIP)", isPopular: true },
          { id: "malaga-centro", name: "Málaga (Litoral / Centro)", isPopular: false }
        ]
      }
    ]
  },

  // ── 7. USA (MIAMI VIP) ──────────────────────────────────────────────────────
  {
    id: "usa",
    name: "USA (Miami VIP)",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=800",
    tagline: "Miami (Brickell Financial, South Beach, Bal Harbour)",
    accentColor: "#8B5CF6",
    available: true,
    dialCode: "+1",
    currency: "USD",
    currencySymbol: "$",
    defaultCity: "Miami",
    mapPresets: {
      "Miami (Brickell)": { center: [25.7617, -80.1918], zoom: 13, label: "Brickell Financial" },
      "South Beach": { center: [25.7825, -80.1341], zoom: 14, label: "South Beach" },
      "Bal Harbour": { center: [25.8926, -80.1264], zoom: 14, label: "Bal Harbour" }
    },
    provinces: [
      {
        id: "florida",
        name: "Florida",
        region: "Florida",
        cantons: [
          { id: "miami-brickell", name: "Miami (Brickell Financial VIP)", isPopular: true },
          { id: "miami-sobe", name: "Miami Beach (South Beach)", isPopular: true },
          { id: "miami-bal-harbour", name: "Bal Harbour / Sunny Isles VIP", isPopular: true },
          { id: "miami-coral-gables", name: "Coral Gables", isPopular: false }
        ]
      }
    ]
  }
];

export function getCountryById(id?: string | null): Country {
  if (!id) return COUNTRIES[0];
  const normalized = id.toLowerCase().trim();
  return (
    COUNTRIES.find((c) => c.id.toLowerCase() === normalized || c.name.toLowerCase() === normalized) ||
    COUNTRIES[0]
  );
}

export function getAllCountries(): Country[] {
  return COUNTRIES;
}

export function getProvincesByCountry(countryId: string): Province[] {
  const country = getCountryById(countryId);
  return country ? country.provinces : [];
}

export function getCantonsByProvince(countryId: string, provinceId: string): Canton[] {
  const country = getCountryById(countryId);
  const prov = country.provinces.find((p) => p.id === provinceId || p.name.toLowerCase() === provinceId.toLowerCase());
  return prov ? prov.cantons : [];
}
