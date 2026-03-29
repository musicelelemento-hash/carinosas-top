import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    // 1. Identificar ciudad o intención
    let city = null;
    if (query.includes("quito")) city = "Quito";
    else if (query.includes("guayaquil")) city = "Guayaquil";
    else if (query.includes("cuenca")) city = "Cuenca";
    else if (query.includes("manta")) city = "Manta";

    // 2. Consulta a Supabase
    let supabaseQuery = supabase.from('models').select('id, name, city, sector, plan_type');

    if (city) {
      supabaseQuery = supabaseQuery.ilike('city', `%${city}%`);
    }

    const { data: models, error } = await supabaseQuery.limit(5);

    if (error) throw error;

    // 3. Formatear Respuesta
    let responseText = "";
    if (models && models.length > 0) {
      const names = models.map(m => m.name).join(", ");
      if (city) {
        responseText = `He encontrado algunas opciones excelentes en ${city}: ${names}. ¿Te gustaría ver el perfil de alguna en específico?`;
      } else {
        responseText = `Actualmente tenemos perfiles destacados como ${names}. ¿Buscas a alguien en alguna ciudad en particular?`;
      }
    } else {
      responseText = "Lo siento, no he encontrado resultados exactos para tu búsqueda. ¿Te gustaría que te recomiende nuestras modelos VIP del momento?";
    }

    return NextResponse.json({
      reply: responseText,
      models: models || []
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ reply: "Hubo un pequeño error de conexión con mi base de datos Élite. ¿Podrías intentarlo de nuevo?" }, { status: 500 });
  }
}
