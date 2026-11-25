type Entry = { count: number; resetAt: number };

/** Minimal shape of a Cloudflare KV binding; avoids depending on @cloudflare/workers-types. */
interface RateLimitKV {
  get(key: string): Promise<string | null>;
  put(key: string, value: string, options?: { expirationTtl?: number }): Promise<void>;
}

const requests = new Map<string, Entry>();

/**
 * Fallback de proceso: solo protege la instancia donde corre. Es lo único
 * disponible fuera de Cloudflare Workers (Vercel, dev local) o si el
 * namespace RATE_LIMIT_KV todavía no existe.
 */
function isRateLimitedInMemory(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();

  if (requests.size > 2000) {
    for (const [k, v] of requests.entries()) {
      if (v.resetAt <= now) requests.delete(k);
    }
  }

  const entry = requests.get(key);

  if (!entry || entry.resetAt <= now) {
    requests.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count += 1;
  return entry.count > limit;
}

/** Intenta obtener el binding KV del runtime de Cloudflare Workers (OpenNext). */
async function getRateLimitKV(): Promise<RateLimitKV | null> {
  try {
    const { getCloudflareContext } = await import("@opennextjs/cloudflare");
    const { env } = await getCloudflareContext({ async: true });
    const kv = (env as Record<string, unknown>).RATE_LIMIT_KV;
    if (kv && typeof (kv as RateLimitKV).get === "function") {
      return kv as RateLimitKV;
    }
    return null;
  } catch {
    // No estamos en Cloudflare Workers (p. ej. build, Vercel, `next dev` local).
    return null;
  }
}

/**
 * Protección de fuerza bruta/spam compartida entre instancias vía Cloudflare KV
 * (binding RATE_LIMIT_KV, ver wrangler.jsonc) cuando el runtime es Cloudflare
 * Workers. Si el binding no está disponible todavía -el namespace no se ha
 * creado, o se corre en Vercel/local- cae a un contador en memoria del
 * proceso: sigue protegiendo esa instancia, pero no coordina entre instancias.
 *
 * KV no soporta incrementos atómicos, así que hay una ventana de carrera
 * get+put bajo alta concurrencia; para los límites de este proyecto (intentos
 * de login, mensajes de chat) es una mejora real frente al contador aislado
 * por instancia, no un contador exacto.
 */
export async function isRateLimited(key: string, limit: number, windowMs: number): Promise<boolean> {
  const kv = await getRateLimitKV();
  if (!kv) {
    return isRateLimitedInMemory(key, limit, windowMs);
  }

  const now = Date.now();
  const raw = await kv.get(key);
  const entry: Entry | null = raw ? JSON.parse(raw) : null;
  const ttlSeconds = Math.max(60, Math.ceil(windowMs / 1000) + 5);

  if (!entry || entry.resetAt <= now) {
    await kv.put(key, JSON.stringify({ count: 1, resetAt: now + windowMs }), {
      expirationTtl: ttlSeconds,
    });
    return false;
  }

  entry.count += 1;
  await kv.put(key, JSON.stringify(entry), {
    expirationTtl: Math.max(60, Math.ceil((entry.resetAt - now) / 1000) + 5),
  });
  return entry.count > limit;
}

export function getClientKey(headers: Headers, scope: string) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${scope}:${forwarded || headers.get("x-real-ip") || "unknown"}`;
}
