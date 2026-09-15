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
    const [verifRes, leadsRes, vipRes] = await Promise.all([
      supabaseAdmin.from("verification_requests").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabaseAdmin.from("recruitment_leads").select("id", { count: "exact", head: true }).in("status", ["new", "contacted"]),
      supabaseAdmin.from("vip_passes").select("id", { count: "exact", head: true }).eq("status", "pending"),
    ]);

    return NextResponse.json({
      verificationPending: verifRes.count ?? 0,
      newLeads: leadsRes.count ?? 0,
      pendingPayments: vipRes.count ?? 0,
    });
  } catch (err) {
    console.error("action-queue error:", err);
    return NextResponse.json({
      verificationPending: 0,
      newLeads: 0,
      pendingPayments: 0,
    });
  }
}
