/**
 * ==============================================================================
 * CARIÑOSAS.TOP — GEO UTILITIES
 * ==============================================================================
 * Distancias reales con la fórmula de Haversine. Reemplaza las distancias
 * falsas del radar ("(i+1)*1.2 km") por distancias calculadas entre las
 * coordenadas del usuario y las de cada modelo (ya almacenadas en lat/lng).
 * ==============================================================================
 */

/**
 * Velocidad media de la Tierra en km (radio medio).
 */
const EARTH_RADIUS_KM = 6371;

/**
 * Convierte grados a radianes.
 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Distancia en kilómetros entre dos coordenadas (lat/lng) usando Haversine.
 * Devuelve 0 si ambas coordenadas coinciden o faltan.
 */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  if ([lat1, lng1, lat2, lng2].some((v) => v == null || Number.isNaN(v))) {
    return 0;
  }

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

/**
 * Formatea la distancia en una etiqueta legible:
 *  - < 1 km → "850 m"
 *  - en adelante → "1,2 km" (un decimal, coma como separador)
 */
export function formatDistanceKm(distanceKm: number): string {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  return `${distanceKm.toFixed(1).replace(".", ",")} km`;
}
