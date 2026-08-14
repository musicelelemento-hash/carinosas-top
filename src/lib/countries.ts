// ============================================================
// LATIN AMERICA COUNTRIES — Location Gateway Data
// ============================================================

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
  code: string;
  tagline: string;
  image: string;      // Unsplash background image URL
  available: boolean; // true = Ecuador (live), false = próximamente
  accentColor: string;
  provinces: Province[];
}

// ─────────────────────────────────────────────────────────────
// Helper: build Ecuador provinces from the existing cities.ts
// (We inline the most important ones here for the gateway)
// ─────────────────────────────────────────────────────────────
const ECUADOR_PROVINCES: Province[] = [
  {
    id: 'pichincha', name: 'Pichincha', region: 'Sierra',
    cantons: [
      { id: 'quito', name: 'Quito', isPopular: true },
      { id: 'cayambe', name: 'Cayambe' },
      { id: 'mejia', name: 'Mejía' },
      { id: 'pedro-moncayo', name: 'Pedro Moncayo' },
      { id: 'rumiñahui', name: 'Rumiñahui', isPopular: true },
      { id: 'san-miguel-bancos', name: 'San Miguel de los Bancos' },
      { id: 'pedro-vicente', name: 'Pedro Vicente Maldonado' },
      { id: 'puerto-quito', name: 'Puerto Quito' },
    ],
  },
  {
    id: 'guayas', name: 'Guayas', region: 'Costa',
    cantons: [
      { id: 'guayaquil', name: 'Guayaquil', isPopular: true },
      { id: 'samborondon', name: 'Samborondón', isPopular: true },
      { id: 'duran', name: 'Durán', isPopular: true },
      { id: 'milagro', name: 'Milagro', isPopular: true },
      { id: 'daule', name: 'Daule' },
      { id: 'playas', name: 'Playas', isPopular: true },
      { id: 'balzar', name: 'Balzar' },
      { id: 'naranjal', name: 'Naranjal' },
      { id: 'el-triunfo', name: 'El Triunfo' },
      { id: 'palestina', name: 'Palestina' },
    ],
  },
  {
    id: 'manabi', name: 'Manabí', region: 'Costa',
    cantons: [
      { id: 'manta', name: 'Manta', isPopular: true },
      { id: 'portoviejo', name: 'Portoviejo', isPopular: true },
      { id: 'chone', name: 'Chone', isPopular: true },
      { id: 'pedernales', name: 'Pedernales' },
      { id: 'montecristi', name: 'Montecristi' },
      { id: 'jipijapa', name: 'Jipijapa' },
      { id: 'el-carmen', name: 'El Carmen' },
      { id: 'sucre', name: 'Sucre' },
      { id: 'san-vicente', name: 'San Vicente' },
    ],
  },
  {
    id: 'azuay', name: 'Azuay', region: 'Sierra',
    cantons: [
      { id: 'cuenca', name: 'Cuenca', isPopular: true },
      { id: 'gualaceo', name: 'Gualaceo' },
      { id: 'paute', name: 'Paute' },
      { id: 'sigsig', name: 'Sígsig' },
      { id: 'giron', name: 'Girón' },
      { id: 'santa-isabel', name: 'Santa Isabel' },
      { id: 'chordeleg', name: 'Chordéleg' },
      { id: 'camilo-ponce', name: 'Camilo Ponce Enríquez' },
    ],
  },
  {
    id: 'tungurahua', name: 'Tungurahua', region: 'Sierra',
    cantons: [
      { id: 'ambato', name: 'Ambato', isPopular: true },
      { id: 'banos', name: 'Baños de Agua Santa', isPopular: true },
      { id: 'pelileo', name: 'Pelileo' },
      { id: 'pillaro', name: 'Píllaro' },
      { id: 'cevallos', name: 'Cevallos' },
      { id: 'mocha', name: 'Mocha' },
      { id: 'patate', name: 'Patate' },
      { id: 'quero', name: 'Quero' },
      { id: 'tisaleo', name: 'Tisaleo' },
    ],
  },
  {
    id: 'el-oro', name: 'El Oro', region: 'Costa',
    cantons: [
      { id: 'machala', name: 'Machala', isPopular: true },
      { id: 'huaquillas', name: 'Huaquillas', isPopular: true },
      { id: 'pasaje', name: 'Pasaje', isPopular: true },
      { id: 'zaruma', name: 'Zaruma' },
      { id: 'santa-rosa', name: 'Santa Rosa' },
      { id: 'arenillas', name: 'Arenillas' },
      { id: 'el-guabo', name: 'El Guabo' },
      { id: 'portovelo', name: 'Portovelo' },
    ],
  },
  {
    id: 'imbabura', name: 'Imbabura', region: 'Sierra',
    cantons: [
      { id: 'ibarra', name: 'Ibarra', isPopular: true },
      { id: 'otavalo', name: 'Otavalo', isPopular: true },
      { id: 'cotacachi', name: 'Cotacachi' },
      { id: 'antonio-ante', name: 'Antonio Ante' },
      { id: 'pimampiro', name: 'Pimampiro' },
      { id: 'urcuqui', name: 'San Miguel de Urcuquí' },
    ],
  },
  {
    id: 'loja', name: 'Loja', region: 'Sierra',
    cantons: [
      { id: 'loja', name: 'Loja', isPopular: true },
      { id: 'catamayo', name: 'Catamayo' },
      { id: 'calvas', name: 'Calvas' },
      { id: 'macara', name: 'Macará' },
      { id: 'saraguro', name: 'Saraguro' },
      { id: 'celica', name: 'Celica' },
      { id: 'gonzanama', name: 'Gonzanamá' },
      { id: 'paltas', name: 'Paltas' },
    ],
  },
  {
    id: 'los-rios', name: 'Los Ríos', region: 'Costa',
    cantons: [
      { id: 'babahoyo', name: 'Babahoyo', isPopular: true },
      { id: 'quevedo', name: 'Quevedo', isPopular: true },
      { id: 'ventanas', name: 'Ventanas' },
      { id: 'vinces', name: 'Vinces' },
      { id: 'baba', name: 'Baba' },
      { id: 'buena-fe', name: 'Buena Fe' },
      { id: 'mocache', name: 'Mocache' },
    ],
  },
  {
    id: 'santa-elena', name: 'Santa Elena', region: 'Costa',
    cantons: [
      { id: 'santa-elena', name: 'Santa Elena', isPopular: true },
      { id: 'la-libertad', name: 'La Libertad', isPopular: true },
      { id: 'salinas', name: 'Salinas', isPopular: true },
    ],
  },
  {
    id: 'santo-domingo', name: 'Santo Domingo de los Tsáchilas', region: 'Sierra',
    cantons: [
      { id: 'santo-domingo', name: 'Santo Domingo', isPopular: true },
      { id: 'la-concordia', name: 'La Concordia' },
    ],
  },
  {
    id: 'esmeraldas', name: 'Esmeraldas', region: 'Costa',
    cantons: [
      { id: 'esmeraldas', name: 'Esmeraldas', isPopular: true },
      { id: 'atacames', name: 'Atacames', isPopular: true },
      { id: 'quininde', name: 'Quinindé' },
      { id: 'san-lorenzo', name: 'San Lorenzo' },
      { id: 'eloy-alfaro', name: 'Eloy Alfaro' },
      { id: 'muisne', name: 'Muisne' },
    ],
  },
  {
    id: 'chimborazo', name: 'Chimborazo', region: 'Sierra',
    cantons: [
      { id: 'riobamba', name: 'Riobamba', isPopular: true },
      { id: 'alausi', name: 'Alausí' },
      { id: 'guano', name: 'Guano' },
      { id: 'colta', name: 'Colta' },
      { id: 'chambo', name: 'Chambo' },
      { id: 'chunchi', name: 'Chunchi' },
      { id: 'pallatanga', name: 'Pallatanga' },
    ],
  },
  {
    id: 'cotopaxi', name: 'Cotopaxi', region: 'Sierra',
    cantons: [
      { id: 'latacunga', name: 'Latacunga', isPopular: true },
      { id: 'la-mana', name: 'La Maná' },
      { id: 'salcedo', name: 'Salcedo' },
      { id: 'saquisili', name: 'Saquisilí' },
      { id: 'pujili', name: 'Pujilí' },
      { id: 'pangua', name: 'Pangua' },
      { id: 'sigchos', name: 'Sigchos' },
    ],
  },
  {
    id: 'bolivar', name: 'Bolívar', region: 'Sierra',
    cantons: [
      { id: 'guaranda', name: 'Guaranda', isPopular: true },
      { id: 'chimbo', name: 'Chimbo' },
      { id: 'san-miguel-bolivar', name: 'San Miguel' },
      { id: 'caluma', name: 'Caluma' },
      { id: 'echeandia', name: 'Echeandía' },
      { id: 'las-naves', name: 'Las Naves' },
    ],
  },
  {
    id: 'canar', name: 'Cañar', region: 'Sierra',
    cantons: [
      { id: 'azogues', name: 'Azogues', isPopular: true },
      { id: 'la-troncal', name: 'La Troncal', isPopular: true },
      { id: 'canar', name: 'Cañar' },
      { id: 'bibilian', name: 'Biblián' },
      { id: 'el-tambo', name: 'El Tambo' },
      { id: 'deleg', name: 'Déleg' },
    ],
  },
  {
    id: 'carchi', name: 'Carchi', region: 'Sierra',
    cantons: [
      { id: 'tulcan', name: 'Tulcán', isPopular: true },
      { id: 'espejo', name: 'Espejo' },
      { id: 'montufar', name: 'Montúfar' },
      { id: 'mira', name: 'Mira' },
    ],
  },
  {
    id: 'napo', name: 'Napo', region: 'Oriente',
    cantons: [
      { id: 'tena', name: 'Tena', isPopular: true },
      { id: 'archidona', name: 'Archidona' },
      { id: 'el-chaco', name: 'El Chaco' },
      { id: 'quijos', name: 'Quijos' },
    ],
  },
  {
    id: 'pastaza', name: 'Pastaza', region: 'Oriente',
    cantons: [
      { id: 'puyo', name: 'Puyo', isPopular: true },
      { id: 'mera', name: 'Mera' },
      { id: 'santa-clara', name: 'Santa Clara' },
      { id: 'arajuno', name: 'Arajuno' },
    ],
  },
  {
    id: 'morona-santiago', name: 'Morona Santiago', region: 'Oriente',
    cantons: [
      { id: 'macas', name: 'Macas', isPopular: true },
      { id: 'gualaquiza', name: 'Gualaquiza' },
      { id: 'sucua', name: 'Sucúa' },
      { id: 'palora', name: 'Palora' },
      { id: 'taisha', name: 'Taisha' },
    ],
  },
  {
    id: 'zamora-chinchipe', name: 'Zamora Chinchipe', region: 'Oriente',
    cantons: [
      { id: 'zamora', name: 'Zamora', isPopular: true },
      { id: 'yantzaza', name: 'Yantzaza' },
      { id: 'el-pangui', name: 'El Pangui' },
      { id: 'nangaritza', name: 'Nangaritza' },
    ],
  },
  {
    id: 'sucumbios', name: 'Sucumbíos', region: 'Oriente',
    cantons: [
      { id: 'lago-agrio', name: 'Lago Agrio', isPopular: true },
      { id: 'shushufindi', name: 'Shushufindi' },
      { id: 'gonzalo-pizarro', name: 'Gonzalo Pizarro' },
      { id: 'cascales', name: 'Cascales' },
      { id: 'cuyabeno', name: 'Cuyabeno' },
    ],
  },
  {
    id: 'orellana', name: 'Orellana', region: 'Oriente',
    cantons: [
      { id: 'francisco-orellana', name: 'Francisco de Orellana', isPopular: true },
      { id: 'la-joya-sachas', name: 'La Joya de los Sachas' },
      { id: 'loreto', name: 'Loreto' },
      { id: 'aguarico', name: 'Aguarico' },
    ],
  },
  {
    id: 'galapagos', name: 'Galápagos', region: 'Insular',
    cantons: [
      { id: 'san-cristobal', name: 'San Cristóbal', isPopular: true },
      { id: 'santa-cruz', name: 'Santa Cruz', isPopular: true },
      { id: 'isabela', name: 'Isabela' },
    ],
  },
];

// ─────────────────────────────────────────────────────────────
// Provinces for other Latin American countries (coming soon)
// ─────────────────────────────────────────────────────────────
const COLOMBIA_PROVINCES: Province[] = [
  { id: 'bogota', name: 'Bogotá D.C.', region: 'Centro', cantons: [{ id: 'bogota', name: 'Bogotá', isPopular: true }] },
  { id: 'antioquia', name: 'Antioquia', region: 'Noroccidente', cantons: [{ id: 'medellin', name: 'Medellín', isPopular: true }, { id: 'bello', name: 'Bello' }, { id: 'envigado', name: 'Envigado' }] },
  { id: 'valle-cauca', name: 'Valle del Cauca', region: 'Suroccidente', cantons: [{ id: 'cali', name: 'Cali', isPopular: true }, { id: 'buenaventura', name: 'Buenaventura' }] },
  { id: 'atlantico', name: 'Atlántico', region: 'Caribe', cantons: [{ id: 'barranquilla', name: 'Barranquilla', isPopular: true }] },
  { id: 'bolivar', name: 'Bolívar', region: 'Caribe', cantons: [{ id: 'cartagena', name: 'Cartagena', isPopular: true }] },
  { id: 'santander', name: 'Santander', region: 'Nororiente', cantons: [{ id: 'bucaramanga', name: 'Bucaramanga', isPopular: true }] },
];

const PERU_PROVINCES: Province[] = [
  { id: 'lima', name: 'Lima', region: 'Costa', cantons: [{ id: 'lima', name: 'Lima', isPopular: true }, { id: 'callao', name: 'Callao' }, { id: 'miraflores', name: 'Miraflores', isPopular: true }] },
  { id: 'arequipa', name: 'Arequipa', region: 'Sur', cantons: [{ id: 'arequipa', name: 'Arequipa', isPopular: true }] },
  { id: 'la-libertad', name: 'La Libertad', region: 'Norte', cantons: [{ id: 'trujillo', name: 'Trujillo', isPopular: true }] },
  { id: 'piura', name: 'Piura', region: 'Norte', cantons: [{ id: 'piura', name: 'Piura', isPopular: true }] },
  { id: 'cusco', name: 'Cusco', region: 'Sur', cantons: [{ id: 'cusco', name: 'Cusco', isPopular: true }] },
];

const VENEZUELA_PROVINCES: Province[] = [
  { id: 'caracas', name: 'Distrito Capital', region: 'Centro Norte', cantons: [{ id: 'caracas', name: 'Caracas', isPopular: true }] },
  { id: 'zulia', name: 'Zulia', region: 'Occidente', cantons: [{ id: 'maracaibo', name: 'Maracaibo', isPopular: true }] },
  { id: 'miranda', name: 'Miranda', region: 'Centro Norte', cantons: [{ id: 'los-teques', name: 'Los Teques', isPopular: true }, { id: 'petare', name: 'Petare' }] },
  { id: 'carabobo', name: 'Carabobo', region: 'Centro Norte', cantons: [{ id: 'valencia', name: 'Valencia', isPopular: true }] },
  { id: 'lara', name: 'Lara', region: 'Noroccidente', cantons: [{ id: 'barquisimeto', name: 'Barquisimeto', isPopular: true }] },
];

const BOLIVIA_PROVINCES: Province[] = [
  { id: 'la-paz', name: 'La Paz', region: 'Occidente', cantons: [{ id: 'la-paz', name: 'La Paz', isPopular: true }, { id: 'el-alto', name: 'El Alto', isPopular: true }] },
  { id: 'santa-cruz', name: 'Santa Cruz', region: 'Oriente', cantons: [{ id: 'santa-cruz', name: 'Santa Cruz de la Sierra', isPopular: true }] },
  { id: 'cochabamba', name: 'Cochabamba', region: 'Centro', cantons: [{ id: 'cochabamba', name: 'Cochabamba', isPopular: true }] },
  { id: 'oruro', name: 'Oruro', region: 'Occidente', cantons: [{ id: 'oruro', name: 'Oruro', isPopular: true }] },
  { id: 'potosi', name: 'Potosí', region: 'Sur', cantons: [{ id: 'potosi', name: 'Potosí', isPopular: true }] },
];

const MEXICO_PROVINCES: Province[] = [
  { id: 'cdmx', name: 'Ciudad de México', region: 'Centro', cantons: [{ id: 'cdmx', name: 'Ciudad de México', isPopular: true }] },
  { id: 'jalisco', name: 'Jalisco', region: 'Occidente', cantons: [{ id: 'guadalajara', name: 'Guadalajara', isPopular: true }, { id: 'zapopan', name: 'Zapopan' }] },
  { id: 'nuevo-leon', name: 'Nuevo León', region: 'Norte', cantons: [{ id: 'monterrey', name: 'Monterrey', isPopular: true }] },
  { id: 'puebla', name: 'Puebla', region: 'Centro', cantons: [{ id: 'puebla', name: 'Puebla', isPopular: true }] },
  { id: 'quintana-roo', name: 'Quintana Roo', region: 'Sureste', cantons: [{ id: 'cancun', name: 'Cancún', isPopular: true }, { id: 'playa-del-carmen', name: 'Playa del Carmen', isPopular: true }] },
  { id: 'guerrero', name: 'Guerrero', region: 'Sur', cantons: [{ id: 'acapulco', name: 'Acapulco', isPopular: true }] },
];

const ARGENTINA_PROVINCES: Province[] = [
  { id: 'buenos-aires', name: 'Buenos Aires', region: 'Centro', cantons: [{ id: 'buenos-aires', name: 'Buenos Aires', isPopular: true }, { id: 'mar-del-plata', name: 'Mar del Plata', isPopular: true }] },
  { id: 'cordoba', name: 'Córdoba', region: 'Centro', cantons: [{ id: 'cordoba', name: 'Córdoba', isPopular: true }] },
  { id: 'santa-fe', name: 'Santa Fe', region: 'Centro', cantons: [{ id: 'rosario', name: 'Rosario', isPopular: true }] },
  { id: 'mendoza', name: 'Mendoza', region: 'Cuyo', cantons: [{ id: 'mendoza', name: 'Mendoza', isPopular: true }] },
  { id: 'tucuman', name: 'Tucumán', region: 'Norte', cantons: [{ id: 'tucuman', name: 'Tucumán', isPopular: true }] },
];

const CHILE_PROVINCES: Province[] = [
  { id: 'santiago', name: 'Región Metropolitana', region: 'Centro', cantons: [{ id: 'santiago', name: 'Santiago', isPopular: true }, { id: 'providencia', name: 'Providencia', isPopular: true }, { id: 'las-condes', name: 'Las Condes', isPopular: true }] },
  { id: 'valparaiso', name: 'Valparaíso', region: 'Centro', cantons: [{ id: 'valparaiso', name: 'Valparaíso', isPopular: true }, { id: 'vina-del-mar', name: 'Viña del Mar', isPopular: true }] },
  { id: 'biobio', name: 'Biobío', region: 'Sur', cantons: [{ id: 'concepcion', name: 'Concepción', isPopular: true }] },
  { id: 'araucania', name: 'La Araucanía', region: 'Sur', cantons: [{ id: 'temuco', name: 'Temuco', isPopular: true }] },
];

// ─────────────────────────────────────────────────────────────
// MAIN COUNTRIES ARRAY
// ─────────────────────────────────────────────────────────────
export const COUNTRIES: Country[] = [
  {
    id: 'ecuador',
    name: 'Ecuador',
    flag: '🇪🇨',
    code: 'EC',
    tagline: 'Cariñosas.top — El Original',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=1200',
    available: true,
    accentColor: '#D4A843',
    provinces: ECUADOR_PROVINCES,
  },
  {
    id: 'colombia',
    name: 'Colombia',
    flag: '🇨🇴',
    code: 'CO',
    tagline: 'Las más calientes de Colombia',
    image: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#FFD700',
    provinces: COLOMBIA_PROVINCES,
  },
  {
    id: 'peru',
    name: 'Perú',
    flag: '🇵🇪',
    code: 'PE',
    tagline: 'Encuentros exclusivos en Perú',
    image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#D4000C',
    provinces: PERU_PROVINCES,
  },
  {
    id: 'venezuela',
    name: 'Venezuela',
    flag: '🇻🇪',
    code: 'VE',
    tagline: 'Belleza venezolana sin igual',
    image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#CF142B',
    provinces: VENEZUELA_PROVINCES,
  },
  {
    id: 'bolivia',
    name: 'Bolivia',
    flag: '🇧🇴',
    code: 'BO',
    tagline: 'Altiplano y pasión',
    image: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#D52B1E',
    provinces: BOLIVIA_PROVINCES,
  },
  {
    id: 'mexico',
    name: 'México',
    flag: '🇲🇽',
    code: 'MX',
    tagline: 'Las más ardientes de México',
    image: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#006847',
    provinces: MEXICO_PROVINCES,
  },
  {
    id: 'argentina',
    name: 'Argentina',
    flag: '🇦🇷',
    code: 'AR',
    tagline: 'Pasión porteña y elegancia',
    image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#74ACDF',
    provinces: ARGENTINA_PROVINCES,
  },
  {
    id: 'chile',
    name: 'Chile',
    flag: '🇨🇱',
    code: 'CL',
    tagline: 'Lo más selecto de Chile',
    image: 'https://images.unsplash.com/photo-1557804483-ef3ae78eca57?auto=format&fit=crop&q=80&w=1200',
    available: false,
    accentColor: '#D52B1E',
    provinces: CHILE_PROVINCES,
  },
];

// ─────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────
export const getCountryById = (id: string) => COUNTRIES.find(c => c.id === id);
export const getProvinceById = (countryId: string, provinceId: string) => {
  const country = getCountryById(countryId);
  return country?.provinces.find(p => p.id === provinceId);
};

export const REGION_COLORS: Record<string, string> = {
  'Sierra':    '#D4A843',
  'Costa':     '#3B82F6',
  'Oriente':   '#22C55E',
  'Insular':   '#A855F7',
  'Centro':    '#D4A843',
  'Norte':     '#3B82F6',
  'Sur':       '#22C55E',
  'Occidente': '#F97316',
  'Oriente-lat': '#22C55E',
  'Caribe':    '#06B6D4',
  'Nororiente':'#3B82F6',
  'Suroccidente': '#22C55E',
};
