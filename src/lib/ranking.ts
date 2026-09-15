/**
 * CARIÑOSAS.TOP — MOTOR DE RECOMENDACIÓN DEL FEED (Hook loop / recompensa variable)
 * ==============================================================================
 * Objetivo: que el feed se sienta "vivo" y personalizado (el patrón TikTok),
 * en lugar de una lista estática ordenada solo por plan.
 *
 * Reglas de ranking (con "recompensa variable"):
 *  1. Verificadas 4K + en línea + destacadas suben (señal de calidad/confianza).
 *  2. Coincidencia de ciudad del usuario pesa (geolocalización como señal dominante).
 *  3. Mezcla de "nuevas" y "destacadas" para mantener la incertidumbre (¿qué sigue?).
 *  4. Un ligero componente pseudo-aleatorio pero DETERMINISTA (hash del id)
 *     para no repetir el mismo orden en cada visita (evita feed aburrido).
 *
 * NO fabrica datos: solo reordena los perfiles reales que ya vienen de la BD.
 */

type RankableModel = {
  id: string;
  is_verified_4k?: boolean;
  is_online?: boolean;
  isBoosted?: boolean;
  plan_type?: string;
  city?: string;
  created_at?: string;
};

const PLAN_WEIGHT: Record<string, number> = {
  "VIP Elite": 0,
  "Diamante": 0,
  "Oro": 1,
  "Premium": 2,
  "Plata": 2,
  "Anuncio Gratis": 3,
  "Gratis": 3,
  "Básico": 3,
};

/** Hash determinista simple para el componente pseudo-aleatorio. */
function hashId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * Ordena los modelos para el feed infinito.
 * `userCity` es la ciudad preferida del usuario si se conoce (opcional).
 * Genérico: conserva el tipo completo del modelo (no lo reduce), para no
 * perder campos (location, imageUrl, etc.) que usan los componentes.
 */
export function rankModels<T extends RankableModel>(models: T[], userCity?: string): T[] {
  return [...models].sort((a, b) => {
    const cityA = a.city || "";
    const cityB = b.city || "";

    // 0) Señal de calidad/confianza: verificadas + en línea + destacadas primero.
    const scoreA =
      (a.is_verified_4k ? 1 : 0) +
      (a.is_online ? 1 : 0) +
      (a.isBoosted || a.plan_type === "VIP Elite" || a.plan_type === "Diamante" ? 1 : 0);
    const scoreB =
      (b.is_verified_4k ? 1 : 0) +
      (b.is_online ? 1 : 0) +
      (b.isBoosted || b.plan_type === "VIP Elite" || b.plan_type === "Diamante" ? 1 : 0);

    if (scoreA !== scoreB) return scoreB - scoreA;

    // 1) Peso del plan.
    const planA = PLAN_WEIGHT[a.plan_type as string] ?? 99;
    const planB = PLAN_WEIGHT[b.plan_type as string] ?? 99;
    if (planA !== planB) return planA - planB;

    // 2) Coincidencia de ciudad del usuario (señal de geolocalización).
    if (userCity) {
      const uc = userCity.toLowerCase();
      const cA = cityA.toLowerCase().includes(uc) ? 1 : 0;
      const cB = cityB.toLowerCase().includes(uc) ? 1 : 0;
      if (cA !== cB) return cB - cA;
    }

    // 3) "Recompensa variable": mezcla nuevas (recientes) y destacadas mediante
    //    el hash del id. Orden estable pero no idéntico entre visitas.
    const timeA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const timeB = b.created_at ? new Date(b.created_at).getTime() : 0;
    if (timeA !== timeB) return timeB - timeA;

    return hashId(b.id) - hashId(a.id);
  });
}
