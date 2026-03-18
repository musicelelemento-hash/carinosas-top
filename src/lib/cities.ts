export interface City {
  id: string;
  name: string;
  province: string;
  region: 'Costa' | 'Sierra' | 'Oriente' | 'Insular';
  isPopular: boolean;
}

export const CITIES: City[] = [
  // AZUAY
  { id: 'cuenca', name: 'Cuenca', province: 'Azuay', region: 'Sierra', isPopular: true },
  { id: 'gualaceo', name: 'Gualaceo', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'paute', name: 'Paute', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'santiago', name: 'Santiago', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'sigsig', name: 'Sígsig', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'girón', name: 'Girón', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'san-fernando', name: 'San Fernando', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'santa-isabel', name: 'Santa Isabel', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'pucará', name: 'Pucará', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'nabón', name: 'Nabón', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'oña', name: 'Oña', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'chordéleg', name: 'Chordéleg', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'el-pan', name: 'El Pan', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'sevilla-de-oro', name: 'Sevilla de Oro', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'guachapala', name: 'Guachapala', province: 'Azuay', region: 'Sierra', isPopular: false },
  { id: 'camilo-ponce-enríquez', name: 'Camilo Ponce Enríquez', province: 'Azuay', region: 'Sierra', isPopular: false },

  // BOLÍVAR
  { id: 'guaranda', name: 'Guaranda', province: 'Bolívar', region: 'Sierra', isPopular: true },
  { id: 'chillanes', name: 'Chillanes', province: 'Bolívar', region: 'Sierra', isPopular: false },
  { id: 'chimbo', name: 'Chimbo', province: 'Bolívar', region: 'Sierra', isPopular: false },
  { id: 'echeandía', name: 'Echeandía', province: 'Bolívar', region: 'Sierra', isPopular: false },
  { id: 'san-miguel-bolivar', name: 'San Miguel', province: 'Bolívar', region: 'Sierra', isPopular: false },
  { id: 'caluma', name: 'Caluma', province: 'Bolívar', region: 'Sierra', isPopular: false },
  { id: 'las-naves', name: 'Las Naves', province: 'Bolívar', region: 'Sierra', isPopular: false },

  // CAÑAR
  { id: 'azogues', name: 'Azogues', province: 'Cañar', region: 'Sierra', isPopular: true },
  { id: 'biblián', name: 'Biblián', province: 'Cañar', region: 'Sierra', isPopular: false },
  { id: 'cañar', name: 'Cañar', province: 'Cañar', region: 'Sierra', isPopular: false },
  { id: 'la-troncal', name: 'La Troncal', province: 'Cañar', region: 'Costa', isPopular: true },
  { id: 'el-tambo', name: 'El Tambo', province: 'Cañar', region: 'Sierra', isPopular: false },
  { id: 'déleg', name: 'Déleg', province: 'Cañar', region: 'Sierra', isPopular: false },
  { id: 'suscal', name: 'Suscal', province: 'Cañar', region: 'Sierra', isPopular: false },

  // CARCHI
  { id: 'tulcán', name: 'Tulcán', province: 'Carchi', region: 'Sierra', isPopular: true },
  { id: 'bolívar-carchi', name: 'Bolívar', province: 'Carchi', region: 'Sierra', isPopular: false },
  { id: 'espejo', name: 'Espejo', province: 'Carchi', region: 'Sierra', isPopular: false },
  { id: 'mira', name: 'Mira', province: 'Carchi', region: 'Sierra', isPopular: false },
  { id: 'montúfar', name: 'Montúfar', province: 'Carchi', region: 'Sierra', isPopular: false },
  { id: 'san-pedro-de-huaca', name: 'San Pedro de Huaca', province: 'Carchi', region: 'Sierra', isPopular: false },

  // COTOPAXI
  { id: 'latacunga', name: 'Latacunga', province: 'Cotopaxi', region: 'Sierra', isPopular: true },
  { id: 'la-maná', name: 'La Maná', province: 'Cotopaxi', region: 'Sierra', isPopular: false },
  { id: 'pangua', name: 'Pangua', province: 'Cotopaxi', region: 'Sierra', isPopular: false },
  { id: 'pujilí', name: 'Pujilí', province: 'Cotopaxi', region: 'Sierra', isPopular: false },
  { id: 'salcedo', name: 'Salcedo', province: 'Cotopaxi', region: 'Sierra', isPopular: false },
  { id: 'saquisilí', name: 'Saquisilí', province: 'Cotopaxi', region: 'Sierra', isPopular: false },
  { id: 'sigchos', name: 'Sigchos', province: 'Cotopaxi', region: 'Sierra', isPopular: false },

  // CHIMBORAZO
  { id: 'riobamba', name: 'Riobamba', province: 'Chimborazo', region: 'Sierra', isPopular: true },
  { id: 'alausí', name: 'Alausí', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'colta', name: 'Colta', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'chambo', name: 'Chambo', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'chunchi', name: 'Chunchi', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'guamote', name: 'Guamote', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'guano', name: 'Guano', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'pallatanga', name: 'Pallatanga', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'penipe', name: 'Penipe', province: 'Chimborazo', region: 'Sierra', isPopular: false },
  { id: 'cumandá', name: 'Cumandá', province: 'Chimborazo', region: 'Sierra', isPopular: false },

  // EL ORO
  { id: 'machala', name: 'Machala', province: 'El Oro', region: 'Costa', isPopular: true },
  { id: 'arenillas', name: 'Arenillas', province: 'El Oro', region: 'Costa', isPopular: false },
  { id: 'atahualpa', name: 'Atahualpa', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'balsas', name: 'Balsas', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'chilla', name: 'Chilla', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'el-guabo', name: 'El Guabo', province: 'El Oro', region: 'Costa', isPopular: false },
  { id: 'huaquillas', name: 'Huaquillas', province: 'El Oro', region: 'Costa', isPopular: true },
  { id: 'marcabelí', name: 'Marcabelí', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'pasaje', name: 'Pasaje', province: 'El Oro', region: 'Costa', isPopular: true },
  { id: 'piñas', name: 'Piñas', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'portovelo', name: 'Portovelo', province: 'El Oro', region: 'Sierra', isPopular: false },
  { id: 'santa-rosa', name: 'Santa Rosa', province: 'El Oro', region: 'Costa', isPopular: false },
  { id: 'zaruma', name: 'Zaruma', province: 'El Oro', region: 'Sierra', isPopular: true },
  { id: 'las-lajas', name: 'Las Lajas', province: 'El Oro', region: 'Costa', isPopular: false },

  // ESMERALDAS
  { id: 'esmeraldas', name: 'Esmeraldas', province: 'Esmeraldas', region: 'Costa', isPopular: true },
  { id: 'eloy-alfaro', name: 'Eloy Alfaro', province: 'Esmeraldas', region: 'Costa', isPopular: false },
  { id: 'muisne', name: 'Muisne', province: 'Esmeraldas', region: 'Costa', isPopular: false },
  { id: 'quinindé', name: 'Quinindé', province: 'Esmeraldas', region: 'Costa', isPopular: false },
  { id: 'san-lorenzo', name: 'San Lorenzo', province: 'Esmeraldas', region: 'Costa', isPopular: false },
  { id: 'atacames', name: 'Atacames', province: 'Esmeraldas', region: 'Costa', isPopular: true },
  { id: 'rioverde', name: 'Rioverde', province: 'Esmeraldas', region: 'Costa', isPopular: false },

  // GUAYAS
  { id: 'guayaquil', name: 'Guayaquil', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'alfredo-baquerizo-moreno', name: 'Alfredo Baquerizo Moreno', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'balao', name: 'Balao', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'balzar', name: 'Balzar', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'colimes', name: 'Colimes', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'daule', name: 'Daule', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'durán', name: 'Durán', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'el-empalme', name: 'El Empalme', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'el-triunfo', name: 'El Triunfo', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'milagro', name: 'Milagro', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'naranjal', name: 'Naranjal', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'naranjito', name: 'Naranjito', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'palestina', name: 'Palestina', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'pedro-carbo', name: 'Pedro Carbo', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'samborondón', name: 'Samborondón', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'santa-lucía', name: 'Santa Lucía', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'salitre', name: 'Salitre', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'san-jacinto-de-yaguachi', name: 'San Jacinto de Yaguachi', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'playas', name: 'Playas', province: 'Guayas', region: 'Costa', isPopular: true },
  { id: 'simón-bolívar-guayas', name: 'Simón Bolívar', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'coronel-marcelino-maridueña', name: 'Coronel Marcelino Maridueña', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'lomas-de-sargentillo', name: 'Lomas de Sargentillo', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'nobol', name: 'Nobol', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'general-antonio-elizalde', name: 'General Antonio Elizalde', province: 'Guayas', region: 'Costa', isPopular: false },
  { id: 'isidro-ayora', name: 'Isidro Ayora', province: 'Guayas', region: 'Costa', isPopular: false },

  // IMBABURA
  { id: 'ibarra', name: 'Ibarra', province: 'Imbabura', region: 'Sierra', isPopular: true },
  { id: 'antonio-ante', name: 'Antonio Ante', province: 'Imbabura', region: 'Sierra', isPopular: false },
  { id: 'cotacachi', name: 'Cotacachi', province: 'Imbabura', region: 'Sierra', isPopular: false },
  { id: 'otavalo', name: 'Otavalo', province: 'Imbabura', region: 'Sierra', isPopular: true },
  { id: 'pimampiro', name: 'Pimampiro', province: 'Imbabura', region: 'Sierra', isPopular: false },
  { id: 'san-miguel-de-urcuquí', name: 'San Miguel de Urcuquí', province: 'Imbabura', region: 'Sierra', isPopular: false },

  // LOJA
  { id: 'loja', name: 'Loja', province: 'Loja', region: 'Sierra', isPopular: true },
  { id: 'calvas', name: 'Calvas', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'catamayo', name: 'Catamayo', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'celica', name: 'Celica', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'chaguarpamba', name: 'Chaguarpamba', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'espíndola', name: 'Espíndola', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'gonzanamá', name: 'Gonzanamá', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'macará', name: 'Macará', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'paltas', name: 'Paltas', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'puyango', name: 'Puyango', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'saraguro', name: 'Saraguro', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'sozoranga', name: 'Sozoranga', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'zapotillo', name: 'Zapotillo', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'pindal', name: 'Pindal', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'quilanga', name: 'Quilanga', province: 'Loja', region: 'Sierra', isPopular: false },
  { id: 'olmedo-loja', name: 'Olmedo', province: 'Loja', region: 'Sierra', isPopular: false },

  // LOS RÍOS
  { id: 'babahoyo', name: 'Babahoyo', province: 'Los Ríos', region: 'Costa', isPopular: true },
  { id: 'baba', name: 'Baba', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'montalvo', name: 'Montalvo', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'puebloviejo', name: 'Puebloviejo', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'quevedo', name: 'Quevedo', province: 'Los Ríos', region: 'Costa', isPopular: true },
  { id: 'urdaneta', name: 'Urdaneta', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'ventanas', name: 'Ventanas', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'vinces', name: 'Vinces', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'palenque', name: 'Palenque', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'buena-fe', name: 'Buena Fe', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'valencia', name: 'Valencia', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'mocache', name: 'Mocache', province: 'Los Ríos', region: 'Costa', isPopular: false },
  { id: 'quinsaloma', name: 'Quinsaloma', province: 'Los Ríos', region: 'Costa', isPopular: false },

  // MANABÍ
  { id: 'portoviejo', name: 'Portoviejo', province: 'Manabí', region: 'Costa', isPopular: true },
  { id: 'bolívar-manabi', name: 'Bolívar', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'chone', name: 'Chone', province: 'Manabí', region: 'Costa', isPopular: true },
  { id: 'el-carmen', name: 'El Carmen', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'flavio-alfaro', name: 'Flavio Alfaro', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'jipijapa', name: 'Jipijapa', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'junín', name: 'Junín', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'manta', name: 'Manta', province: 'Manabí', region: 'Costa', isPopular: true },
  { id: 'montecristi', name: 'Montecristi', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'paján', name: 'Paján', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'pichincha-manabi', name: 'Pichincha', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'rocafuerte', name: 'Rocafuerte', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'santa-ana', name: 'Santa Ana', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'sucre', name: 'Sucre', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'tosagua', name: 'Tosagua', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: '24-de-mayo', name: '24 de Mayo', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'pedernales', name: 'Pedernales', province: 'Manabí', region: 'Costa', isPopular: true },
  { id: 'olmedo-manabi', name: 'Olmedo', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'puerto-lópez', name: 'Puerto López', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'jama', name: 'Jama', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'jaramijó', name: 'Jaramijó', province: 'Manabí', region: 'Costa', isPopular: false },
  { id: 'san-vicente', name: 'San Vicente', province: 'Manabí', region: 'Costa', isPopular: false },

  // MORONA SANTIAGO
  { id: 'macas', name: 'Macas', province: 'Morona Santiago', region: 'Oriente', isPopular: true },
  { id: 'gualaquiza', name: 'Gualaquiza', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'limón-indanza', name: 'Limón Indanza', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'palora', name: 'Palora', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'santiago-de-mendez', name: 'Santiago de Méndez', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'sucúa', name: 'Sucúa', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'huamboya', name: 'Huamboya', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'san-juan-bosco', name: 'San Juan Bosco', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'taisha', name: 'Taisha', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'logroño', name: 'Logroño', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'pablo-sexto', name: 'Pablo Sexto', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'tiwintza', name: 'Tiwintza', province: 'Morona Santiago', region: 'Oriente', isPopular: false },
  { id: 'sevilla-don-bosco', name: 'Sevilla Don Bosco', province: 'Morona Santiago', region: 'Oriente', isPopular: false },

  // NAPO
  { id: 'tena', name: 'Tena', province: 'Napo', region: 'Oriente', isPopular: true },
  { id: 'archidona', name: 'Archidona', province: 'Napo', region: 'Oriente', isPopular: false },
  { id: 'el-chaco', name: 'El Chaco', province: 'Napo', region: 'Oriente', isPopular: false },
  { id: 'quijos', name: 'Quijos', province: 'Napo', region: 'Oriente', isPopular: false },
  { id: 'carlos-julio-arosemena-tola', name: 'Carlos Julio Arosemena Tola', province: 'Napo', region: 'Oriente', isPopular: false },

  // PASTAZA
  { id: 'puyo', name: 'Puyo', province: 'Pastaza', region: 'Oriente', isPopular: true },
  { id: 'mera', name: 'Mera', province: 'Pastaza', region: 'Oriente', isPopular: false },
  { id: 'santa-clara', name: 'Santa Clara', province: 'Pastaza', region: 'Oriente', isPopular: false },
  { id: 'arajuno', name: 'Arajuno', province: 'Pastaza', region: 'Oriente', isPopular: false },

  // PICHINCHA
  { id: 'quito', name: 'Quito', province: 'Pichincha', region: 'Sierra', isPopular: true },
  { id: 'cayambe', name: 'Cayambe', province: 'Pichincha', region: 'Sierra', isPopular: false },
  { id: 'mejía', name: 'Mejía', province: 'Pichincha', region: 'Sierra', isPopular: false },
  { id: 'pedro-moncayo', name: 'Pedro Moncayo', province: 'Pichincha', region: 'Sierra', isPopular: false },
  { id: 'rumiñahui', name: 'Rumiñahui', province: 'Pichincha', region: 'Sierra', isPopular: true },
  { id: 'san-miguel-de-los-bancos', name: 'San Miguel de los Bancos', province: 'Pichincha', region: 'Sierra', isPopular: false },
  { id: 'pedro-vicente-maldonado', name: 'Pedro Vicente Maldonado', province: 'Pichincha', region: 'Sierra', isPopular: false },
  { id: 'puerto-quito', name: 'Puerto Quito', province: 'Pichincha', region: 'Sierra', isPopular: false },

  // TUNGURAHUA
  { id: 'ambato', name: 'Ambato', province: 'Tungurahua', region: 'Sierra', isPopular: true },
  { id: 'baños', name: 'Baños de Agua Santa', province: 'Tungurahua', region: 'Sierra', isPopular: true },
  { id: 'cevallos', name: 'Cevallos', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'mocha', name: 'Mocha', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'patate', name: 'Patate', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'pelileo', name: 'Pelileo', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'pillaro', name: 'Píllaro', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'quero', name: 'Quero', province: 'Tungurahua', region: 'Sierra', isPopular: false },
  { id: 'tisaleo', name: 'Tisaleo', province: 'Tungurahua', region: 'Sierra', isPopular: false },

  // ZAMORA CHINCHIPE
  { id: 'zamora', name: 'Zamora', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: true },
  { id: 'chinchipe', name: 'Chinchipe', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'nangaritza', name: 'Nangaritza', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'yacuambi', name: 'Yacuambi', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'yantzaza', name: 'Yantzaza', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'el-pangui', name: 'El Pangui', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'centinela-del-condor', name: 'Centinela del Cóndor', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'palanda', name: 'Palanda', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },
  { id: 'paquisha', name: 'Paquisha', province: 'Zamora Chinchipe', region: 'Oriente', isPopular: false },

  // SUCUMBÍOS
  { id: 'lago-agrio', name: 'Lago Agrio', province: 'Sucumbíos', region: 'Oriente', isPopular: true },
  { id: 'gonzalo-pizarro', name: 'Gonzalo Pizarro', province: 'Sucumbíos', region: 'Oriente', isPopular: false },
  { id: 'putumayo', name: 'Putumayo', province: 'Sucumbíos', region: 'Oriente', isPopular: false },
  { id: 'shushufindi', name: 'Shushufindi', province: 'Sucumbíos', region: 'Oriente', isPopular: false },
  { id: 'sucumbíos-canton', name: 'Sucumbíos', province: 'Sucumbíos', region: 'Oriente', isPopular: false },
  { id: 'cascales', name: 'Cascales', province: 'Sucumbíos', region: 'Oriente', isPopular: false },
  { id: 'cuyabeno', name: 'Cuyabeno', province: 'Sucumbíos', region: 'Oriente', isPopular: false },

  // ORELLANA
  { id: 'francisco-de-orellana', name: 'Francisco de Orellana', province: 'Orellana', region: 'Oriente', isPopular: true },
  { id: 'aguarico', name: 'Aguarico', province: 'Orellana', region: 'Oriente', isPopular: false },
  { id: 'la-joya-de-los-sachas', name: 'La Joya de los Sachas', province: 'Orellana', region: 'Oriente', isPopular: false },
  { id: 'loreto', name: 'Loreto', province: 'Orellana', region: 'Oriente', isPopular: false },

  // SANTO DOMINGO DE LOS TSÁCHILAS
  { id: 'santo-domingo', name: 'Santo Domingo', province: 'Santo Domingo de los Tsáchilas', region: 'Sierra', isPopular: true },
  { id: 'la-concordia', name: 'La Concordia', province: 'Santo Domingo de los Tsáchilas', region: 'Costa', isPopular: false },

  // SANTA ELENA
  { id: 'santa-elena', name: 'Santa Elena', province: 'Santa Elena', region: 'Costa', isPopular: true },
  { id: 'la-libertad', name: 'La Libertad', province: 'Santa Elena', region: 'Costa', isPopular: true },
  { id: 'salinas', name: 'Salinas', province: 'Santa Elena', region: 'Costa', isPopular: true },

  // GALÁPAGOS
  { id: 'san-cristóbal', name: 'San Cristóbal', province: 'Galápagos', region: 'Insular', isPopular: true },
  { id: 'isabela', name: 'Isabela', province: 'Galápagos', region: 'Insular', isPopular: false },
  { id: 'santa-cruz', name: 'Santa Cruz', province: 'Galápagos', region: 'Insular', isPopular: true },
];

export const getPopularCities = () => CITIES.filter(c => c.isPopular);
export const getProvinces = () => Array.from(new Set(CITIES.map(c => c.province))).sort();
export const getCitiesByProvince = (province: string) => CITIES.filter(c => c.province === province).sort((a, b) => a.name.localeCompare(b.name));
