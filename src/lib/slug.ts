/**
 * CARIÑOSAS.TOP — SLUG UTILITIES (SEO)
 * Genera URLs limpias por ciudad tipo /quito, /machala, /medellin
 * en lugar de los query params (?city=Quito) que duplicaban contenido en el sitemap.
 */

/** Normaliza texto a un slug URL-friendly (sin acentos, espacios → guiones). */
export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita acentos
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
}

/**
 * Extrae el nombre base de ciudad de un nombre de cantón.
 * "Machala (Puerto Bolívar)" → "Machala"
 * "Quito (La Carolina)"     → "Quito"
 * Usa el primer token antes de " (" para emparejar con models.city.
 */
export function cityBaseName(cantonName: string): string {
  return cantonName.split(" (")[0].trim();
}

/** Capitaliza ("machala" → "Machala", "quito-norte" → "Quito Norte"). */
export function humanizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
