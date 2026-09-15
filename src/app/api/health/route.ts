import { NextResponse } from "next/server";

/**
 * /api/health — Endpoint de salud y keep-alive.
 * Sirve para: (a) monitorización, y (b) mantener "despiertos" servicios free
 * (render.com se duerme tras ~15 min sin tráfico). Un cron (GitHub Actions o
 * cron-job.org) golpea esta ruta cada 10 min; aquí hacemos ping a RENDER_URL.
 */
export async function GET() {
  const target = process.env.RENDER_URL;
  if (target) {
    try {
      await fetch(target, {
        method: "GET",
        signal: AbortSignal.timeout(8000),
      });
    } catch {
      // No bloquear la respuesta por un fallo del ping.
    }
  }
  return NextResponse.json({ ok: true, ts: new Date().toISOString() });
}
