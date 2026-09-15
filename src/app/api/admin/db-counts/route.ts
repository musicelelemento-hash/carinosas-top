import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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
    return Date.now() - parseInt(ts, 10) < 24 * 60 * 60 * 1000;
  } catch {
    return false;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [modelsRes, leadsRes, verifRes, vipRes, bookingsRes, eventsRes] = await Promise.all([
      supabaseAdmin.from("models").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("recruitment_leads").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("verification_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("vip_passes").select("id", { count: "exact", head: true }).eq("status", "active"),
      supabaseAdmin.from("booking_requests").select("id", { count: "exact", head: true }),
      supabaseAdmin.from("tracking_events").select("id", { count: "exact", head: true }).gte("created_at", weekAgo),
    ]);

    return NextResponse.json({
      models: modelsRes.count ?? 0,
      leads: leadsRes.count ?? 0,
      verificationPending: verifRes.count ?? 0,
      vipPassesActive: vipRes.count ?? 0,
      bookings: bookingsRes.count ?? 0,
      trackingEvents7d: eventsRes.count ?? 0,
    });
  } catch (err) {
    console.error("db-counts error:", err);
    return NextResponse.json({
      models: null,
      leads: null,
      verificationPending: null,
      vipPassesActive: null,
      bookings: null,
      trackingEvents7d: null,
    });
  }
}
