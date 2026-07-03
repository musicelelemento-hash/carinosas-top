import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ECUADOR_CITIES = [
  "Quito", "Guayaquil", "Cuenca", "Manta", "Machala", "Ambato", "Loja", "Riobamba", 
  "Esmeraldas", "Ibarra", "Santo Domingo", "Quevedo", "Babahoyo", "Milagro", "Pasaje", 
  "Portoviejo", "Salinas", "Cumbayá", "Samborondón"
];

const PLAN_PRIORITY: Record<string, number> = {
  'VIP Elite': 0,
  'Diamante': 0,
  'Oro': 1,
  'Premium': 2,
  'Plata': 2,
  'Anuncio Gratis': 3,
  'Gratis': 3,
  'Básico': 3
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message || typeof message !== "string") {
      return NextResponse.json({ reply: "Hola. ¿En qué te puedo colaborar el día de hoy? Cuéntame qué tipo de compañía o ciudad buscas." }, { status: 400 });
    }

    const query = message.toLowerCase();

    // 1. Extract potential filters from query
    // 1.1 City detection
    let detectedCity = "";
    for (const city of ECUADOR_CITIES) {
      if (query.includes(city.toLowerCase())) {
        detectedCity = city;
        break;
      }
    }

    // 1.2 Age detection (look for numbers 18-40)
    let detectedAge: number | null = null;
    const ageMatch = query.match(/\b(1[89]|[23]\d|40)\b/);
    if (ageMatch) {
      detectedAge = parseInt(ageMatch[0]);
    }

    // 1.3 Keyword/Category detection
    const keywords = {
      verified: query.includes("verificad") || query.includes("real") || query.includes("fake") || query.includes("foto"),
      massage: query.includes("masaje") || query.includes("relax") || query.includes("terapia"),
      blonde: query.includes("rubia") || query.includes("mona") || query.includes("gringa"),
      brunette: query.includes("morena") || query.includes("negra") || query.includes("canela"),
      slender: query.includes("delgada") || query.includes("flaca") || query.includes("esbelta"),
      vip: query.includes("vip") || query.includes("elite") || query.includes("exclusiv") || query.includes("lujo")
    };

    // 2. Fetch all models to filter and score in-memory
    const { data: rawModels, error } = await supabase
      .from("models")
      .select("id, name, city, sector, plan_type, age, images, tags, description, is_verified_4k, is_online");

    if (error) throw error;

    const models = rawModels || [];

    // 3. Compute relevance scores
    const scoredModels = models.map((model: any) => {
      let score = 0;

      // City matching (Highest weight)
      if (detectedCity) {
        if (model.city.toLowerCase() === detectedCity.toLowerCase() || 
            (model.sector && model.sector.toLowerCase().includes(detectedCity.toLowerCase()))) {
          score += 15;
        } else {
          // Deduct score if query mentions a city but this model is elsewhere
          score -= 5;
        }
      }

      // Age matching
      if (detectedAge && model.age) {
        const diff = Math.abs(model.age - detectedAge);
        if (diff === 0) score += 8;
        else if (diff === 1) score += 4;
        else if (diff === 2) score += 2;
      }

      // Keyword matching
      if (keywords.verified && (model.is_verified_4k || model.is_verified)) score += 5;
      
      const descText = (model.description || "").toLowerCase();
      const tagsText = (model.tags || []).join(" ").toLowerCase();

      if (keywords.massage && (descText.includes("masaje") || tagsText.includes("masaje"))) score += 4;
      if (keywords.blonde && (descText.includes("rubia") || tagsText.includes("rubia"))) score += 4;
      if (keywords.brunette && (descText.includes("morena") || descText.includes("canela") || tagsText.includes("morena"))) score += 4;
      if (keywords.slender && (descText.includes("delgad") || descText.includes("esbelt") || tagsText.includes("delgad"))) score += 4;
      if (keywords.vip && (model.plan_type === "VIP Elite" || model.plan_type === "Diamante")) score += 4;

      // Plan tier boosts
      if (model.plan_type === "VIP Elite") score += 5;
      else if (model.plan_type === "Diamante") score += 4;
      else if (model.plan_type === "Premium" || model.plan_type === "Oro") score += 2;
      else if (model.plan_type === "Plata") score += 1;

      // Online status boost
      if (model.is_online) score += 1;

      return { ...model, score };
    });

    // 4. Sort and filter
    // If the query was general, sort by score but allow default high-tier models
    // Filter out models with negative scores if a specific query was made
    const filteredModels = scoredModels
      .filter(m => detectedCity || detectedAge || Object.values(keywords).some(Boolean) ? m.score > 0 : true)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        // Fallback to plan priority
        const priorityA = PLAN_PRIORITY[a.plan_type] ?? 99;
        const priorityB = PLAN_PRIORITY[b.plan_type] ?? 99;
        return priorityA - priorityB;
      });

    // Take top 5 recommendations
    const recommendations = filteredModels.slice(0, 5);

    // 5. Generate conversational response
    let reply = "";
    if (recommendations.length > 0) {
      const names = recommendations.map(m => m.name).slice(0, 3).join(", ");
      
      if (detectedCity) {
        reply = `He encontrado excelentes opciones en ${detectedCity}. Te recomiendo especialmente a ${names}. Pulsa sobre sus perfiles aquí abajo para ver sus fotos exclusivas y contactarlas directo por WhatsApp.`;
      } else if (detectedAge) {
        reply = `Tengo perfiles que coinciden con la edad que buscas, tales como ${names}. Puedes explorar sus detalles y disponibilidad a continuación.`;
      } else if (Object.values(keywords).some(Boolean)) {
        reply = `Analicé el catálogo según tus preferencias y encontré estas opciones ideales para ti: ${names}. ¿Qué opinas?`;
      } else {
        reply = `Hola. Te presento nuestra selección exclusiva recomendada para hoy: ${names}. ¿Deseas filtrar por alguna ciudad en particular o buscar alguna característica?`;
      }
    } else {
      reply = `Lo siento, no tengo perfiles con esa descripción exacta en este momento. Te presento nuestras recomendaciones VIP destacadas que te pueden interesar:`;
      // If empty recommendations, fallback to top VIP models
      const fallbackModels = scoredModels
        .sort((a, b) => (PLAN_PRIORITY[a.plan_type] ?? 99) - (PLAN_PRIORITY[b.plan_type] ?? 99))
        .slice(0, 4);
      recommendations.push(...fallbackModels);
    }

    // Format models output for the client
    const clientModels = recommendations.map((m: any) => ({
      id: m.id,
      name: m.name,
      city: m.city,
      sector: m.sector,
      plan_type: m.plan_type,
      age: m.age,
      imageUrl: m.images && m.images[0] ? m.images[0] : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=800",
      is_verified_4k: m.is_verified_4k
    }));

    return NextResponse.json({
      reply,
      models: clientModels
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ 
      reply: "Disculpa, he tenido un inconveniente de conexión con el catálogo premium. Por favor, reintenta tu pregunta.",
      models: []
    }, { status: 500 });
  }
}
