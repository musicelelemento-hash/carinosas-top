import { supabase } from "@/lib/supabase";

export const MODEL_CATALOG_PAGE_SIZE = 24;

export interface CatalogModel {
  id: string;
  name: string;
  age: number;
  location: string;
  city: string;
  images: string[];
  imageUrl: string;
  isBoosted: boolean;
  is_verified_4k: boolean;
  is_online: boolean;
  country_code?: string;
  created_at?: string;
  voice_greeting_url?: string;
  description: string | null;
  whatsapp: string;
  sector: string | null;
  tags: string[] | null;
  plan_type: string;
  personal_note: string;
}

export interface ModelCatalogCursor {
  id: string;
  createdAt: string;
}

export interface ModelCatalogPage {
  models: CatalogModel[];
  nextCursor: ModelCatalogCursor | null;
  hasMore: boolean;
  error?: boolean;
}

export interface ModelCatalogFilters {
  query?: string;
  city?: string;
  online?: boolean;
  verified4k?: boolean;
  vip?: boolean;
  maxHourlyRate?: number;
  tag?: string;
  countryCode?: string;
  sort?: "newest";
  createdAfter?: string;
}

interface DbModel {
  id: string;
  name: string;
  age: number;
  sector: string | null;
  city: string;
  images: string[] | null;
  is_boosted?: boolean;
  plan_type: string;
  is_verified_4k: boolean;
  is_online?: boolean;
  country_code?: string;
  created_at: string;
  voice_greeting_url?: string;
  description: string | null;
  whatsapp: string;
  tags: string[] | null;
  personal_note?: string;
  hourly_rate?: number | string;
}

const EXCLUDED_DEMO_ID_PATTERN = "a1000000-0000-0000-0000-0000000000%";
function mapModel(model: DbModel): CatalogModel {
  const images = model.images?.filter(Boolean) ?? [];
  return {
    id: model.id,
    name: model.name,
    age: model.age,
    location: model.sector ? `${model.sector}, ${model.city}` : model.city,
    city: model.city,
    images,
    imageUrl: images[0] ?? "",
    isBoosted: Boolean(model.is_boosted) || model.plan_type === "Diamante" || model.plan_type === "VIP Elite",
    is_verified_4k: model.is_verified_4k,
    is_online: Boolean(model.is_online),
    country_code: model.country_code,
    created_at: model.created_at,
    voice_greeting_url: model.voice_greeting_url,
    description: model.description,
    whatsapp: model.whatsapp,
    sector: model.sector,
    tags: model.tags,
    plan_type: model.plan_type,
    personal_note: model.personal_note || "",
  };
}

function isValidCursor(cursor: ModelCatalogCursor): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cursor.id)
    && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/.test(cursor.createdAt)
    && Number.isFinite(Date.parse(cursor.createdAt));
}

function cleanSearchValue(value: unknown, maxLength = 80): string {
  if (typeof value !== "string") return "";
  return value
    .normalize("NFKC")
    .replace(/[^\p{L}\p{N}\s'’-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function normalizeFilters(input?: ModelCatalogFilters): ModelCatalogFilters {
  if (!input || typeof input !== "object") return {};
  const filters: ModelCatalogFilters = {};
  const query = cleanSearchValue(input.query);
  const city = cleanSearchValue(input.city, 60);
  const tag = cleanSearchValue(input.tag, 50);
  const countryCode = typeof input.countryCode === "string" && /^[A-Z]{2,3}$/i.test(input.countryCode)
    ? input.countryCode.toUpperCase()
    : "";
  if (query) filters.query = query;
  if (city) filters.city = city;
  if (tag) filters.tag = tag;
  if (countryCode) filters.countryCode = countryCode;
  if (input.online === true) filters.online = true;
  if (input.verified4k === true) filters.verified4k = true;
  if (input.vip === true) filters.vip = true;
  if (typeof input.createdAfter === "string" && Number.isFinite(Date.parse(input.createdAfter))) {
    const createdAfter = new Date(input.createdAfter);
    if (createdAfter.getTime() <= Date.now()) filters.createdAfter = createdAfter.toISOString();
  }
  if (typeof input.maxHourlyRate === "number" && Number.isFinite(input.maxHourlyRate)) {
    filters.maxHourlyRate = Math.max(60, Math.min(1000, Math.round(input.maxHourlyRate)));
  }
  return filters;
}

export async function getModelCatalogPage(
  cursor?: ModelCatalogCursor | null,
  inputFilters?: ModelCatalogFilters,
): Promise<ModelCatalogPage> {
  if (cursor && !isValidCursor(cursor)) {
    return { models: [], nextCursor: null, hasMore: false, error: true };
  }

  const pageLimit = MODEL_CATALOG_PAGE_SIZE + 1;
  const filters = normalizeFilters(inputFilters);
  const fields = "id, name, age, sector, city, images, is_boosted, plan_type, is_verified_4k, is_online, country_code, created_at, voice_greeting_url, description, whatsapp, tags, personal_note, hourly_rate";
  const fallbackFields = "id, name, age, sector, city, images, plan_type, is_verified_4k, is_online, created_at, description, whatsapp, tags, hourly_rate";

  try {
    const buildQuery = (selection: string) => {
      let query = supabase
        .from("models")
        .select(selection)
        .not("id", "like", EXCLUDED_DEMO_ID_PATTERN)
        .order("created_at", { ascending: false })
        .order("id", { ascending: false })
        .limit(pageLimit);

      const searchExpressions = filters.query ? (() => {
        const term = `%${filters.query}%`;
        return [
          `name.ilike.${term}`,
          `city.ilike.${term}`,
          `sector.ilike.${term}`,
          `description.ilike.${term}`,
          `tags.cs.{${filters.query}}`,
        ];
      })() : [];
      if (filters.city) {
        const city = `%${filters.city}%`;
        query = query.ilike("city", city);
      }
      if (filters.tag) query = query.contains("tags", [filters.tag]);
      if (filters.online) query = query.eq("is_online", true);
      if (filters.verified4k) query = query.eq("is_verified_4k", true);
      if (filters.vip) query = query.in("plan_type", ["VIP Elite", "Diamante", "Premium"]);
      if (filters.maxHourlyRate !== undefined) query = query.lte("hourly_rate", filters.maxHourlyRate);
      if (filters.countryCode) query = query.eq("country_code", filters.countryCode);
      if (filters.createdAfter) query = query.gte("created_at", filters.createdAfter);

      if (cursor && searchExpressions.length) {
        const terms = searchExpressions.flatMap((expression) => [
          `and(created_at.lt.${cursor.createdAt},${expression})`,
          `and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id},${expression})`,
        ]);
        query = query.or(terms.join(","));
      } else if (cursor) {
        query = query.or(`created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`);
      } else if (searchExpressions.length) {
        query = query.or(searchExpressions.join(","));
      }
      return query;
    };

    let { data, error } = await buildQuery(fields);
    if (error) {
      const fallback = await buildQuery(fallbackFields);
      data = fallback.data;
      error = fallback.error;
    }
    if (error || !data) return { models: [], nextCursor: null, hasMore: false, error: true };

    const rows = data as unknown as DbModel[];
    const hasMore = rows.length > MODEL_CATALOG_PAGE_SIZE;
    const pageRows = rows.slice(0, MODEL_CATALOG_PAGE_SIZE);
    const last = pageRows[pageRows.length - 1];

    return {
      models: pageRows.map(mapModel),
      nextCursor: hasMore && last?.created_at ? { id: last.id, createdAt: last.created_at } : null,
      hasMore,
    };
  } catch (error) {
    console.error("Model catalog page fetch failed:", error);
    return { models: [], nextCursor: null, hasMore: false, error: true };
  }
}
