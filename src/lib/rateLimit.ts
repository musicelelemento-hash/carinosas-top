type Entry = { count: number; resetAt: number };

const requests = new Map<string, Entry>();

/** Lightweight process-local protection for API routes and server actions. */
export function isRateLimited(key: string, limit: number, windowMs: number) {
  const now = Date.now();

  // Periodic cleanup if cache size exceeds threshold
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

export function getClientKey(headers: Headers, scope: string) {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return `${scope}:${forwarded || headers.get("x-real-ip") || "unknown"}`;
}
