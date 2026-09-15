import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const CRITICAL_ENVS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "NOWPAYMENTS_API_KEY",
  "NOWPAYMENTS_IPN_SECRET",
  "CLOUDFLARE_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_WHATSAPP_CONCIERGE",
] as const;

async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  if (!token) return false;
  try {
    const { default: crypto } = await import("crypto");
    const ADMIN_SECRET = process.env.ADMIN_SECRET;
    if (!ADMIN_SECRET) return false;

    const parts = token.split(".");
    if (parts.length !== 2) return false;
    const [ts, sig] = parts;
    const expected = crypto.createHmac("sha256", ADMIN_SECRET).update(`${ts}:admin-session-v2`).digest("hex");
    if (sig !== expected) return false;
    const age = Date.now() - parseInt(ts, 10);
    return age < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const envs = CRITICAL_ENVS.map((key) => ({
    key,
    configured: Boolean(process.env[key] && process.env[key]!.length > 0),
  }));

  return NextResponse.json({ envs });
}
