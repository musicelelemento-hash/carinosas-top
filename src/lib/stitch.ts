import { CITIES } from "./cities";

/**
 * Stitch Content Engine - Cariñosas.top
 * Luxury Copywriting, Smart Tagging and Quality Control for the Ecuador Market.
 */

export interface StitchResponse {
  transformedText: string;
  tags: string[];
  suggestions: string[];
  planRecommendation: 'Silver' | 'Gold';
}

const CITY_TAGS: Record<string, string[]> = {
  'Quito': ['#Cumbayá', '#LaCarolina', '#QuitoElite', '#DiscreciónTotal'],
  'Guayaquil': ['#Samborondón', '#PuertoSantaAna', '#GuayaquilVIP', '#Exclusividad'],
  'Cuenca': ['#CuencaElite', '#CentroHistórico', '#AzuayVIP'],
  'Manta': ['#MantaVIP', '#Murciélago', '#CostaLujo'],
  'Machala': ['#MachalaVIP', '#CapitalBananera', '#ElOroElite'],
  'Pasaje': ['#PasajeVIP', '#ExclusividadOro', '#Discreción'],
  'Santo Domingo': ['#SantoDomingoElite', '#TsáchilaVIP', '#Lujo'],
  'Quevedo': ['#QuevedoVIP', '#RíosElite', '#Exclusivo'],
};

export const StitchEngine = {
  /**
   * Transforms basic descriptions into luxury copywriting.
   */
  transformDescription(text: string, city: string): string {
    const baseText = text.toLowerCase();
    
    // Logic for luxury transformation based on city
    if (baseText.includes('chicos') || baseText.includes('hombres')) {
      return `Descubre la exclusividad en el corazón de ${city}. Una experiencia diseñada para caballeros que exigen lo mejor, donde la elegancia y la discreción son nuestra prioridad absoluta.`;
    }
    
    if (baseText.includes('diversión') || baseText.includes('pasar bien')) {
      return `Eleva tus sentidos en ${city}. Te invito a disfrutar de un encuentro de alto nivel, rodeada de lujo y el trato preferencial que mereces.`;
    }

    return `Sumérgete en un mundo de sofisticación en ${city}. Un espacio creado para quienes valoran la distinción y buscan una compañía de clase mundial.`;
  },

  /**
   * Generates smart SEO tags based on location.
   */
  generateTags(city: string): string[] {
    const province = CITIES.find(c => c.name === city || c.id === city)?.province || 'Ecuador';
    const baseTags = [`#${city.replace(/\s+/g, '')}VIP`, `#${province}Elite`, '#Exclusividad', '#Discreción'];
    
    // Add specific high-end tags for major areas
    if (CITY_TAGS[city]) {
      return [...CITY_TAGS[city], ...baseTags.slice(2)];
    }
    
    return baseTags;
  },

  /**
   * Analyzes photo metadata/simulated quality.
   */
  analyzePhotoQuality(photos: any[]): { score: number; feedback: string } {
    // Simulated analysis: in a real scenario, this would check resolution, lighting via AI
    if (photos.length < 3) {
      return { 
        score: 40, 
        feedback: 'Tu perfil luciría mejor con más variedad. Sube al menos 3 fotos profesionales para activar el Plan Oro.' 
      };
    }
    
    return { 
      score: 95, 
      feedback: '¡Excelente calidad! Tus fotos cumplen con los estándares VIP.' 
    };
  },

  /**
   * Plan conversion logic for the assistant.
   */
  getConversionPitch(isInterested: boolean): string {
    if (isInterested) {
      return "En Cariñosas.top garantizamos Cero Fakes y posicionamiento nacional. Tu inversión en el Plan Oro te otorga visibilidad prioritaria en los sectores más exclusivos de tu ciudad, asegurando clientes de élite y discreción absoluta.";
    }
    return "Únete a la plataforma más exclusiva de Ecuador. El Plan Oro es tu llave para dominar el mercado VIP en tu región.";
  },

  /**
   * Returns quick drafts for mobile users to pick from.
   */
  getQuickDrafts(city: string): Record<string, string> {
    return {
      'Elegante': `Busco caballeros distinguidos en ${city} que aprecien la elegancia y la buena compañía en un ambiente exclusivo.`,
      'Atrevida': `Nueva en ${city} y con ganas de romper la rutina. Si buscas una experiencia intensa y real, soy la indicada.`,
      'Nueva': `Recién llegada a ${city}. Ven a conocerme y descubre por qué soy la favorita de los clientes más exigentes.`,
    };
  },

  /**
   * Returns a random tip for mobile users.
   */
  getMobileTip(): string {
    const tips = [
      "📸 Tip: Las fotos con luz natural reciben un 40% más de atención.",
      "✨ Tip: Un mensaje personalizado en el bio genera más confianza.",
      "📱 Tip: Mantén tu WhatsApp activo para no perder clientes elite.",
      "🔒 Tip: La discreción es nuestra prioridad, igual que la tuya."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  },

  /**
   * Admin-only utility for rapid transformation.
   */
  quickTransform(rawText: string, city: string): { text: string, tags: string[] } {
    return {
      text: this.transformDescription(rawText, city),
      tags: this.generateTags(city)
    };
  }
};
