import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export interface VipPassWebhookPayload {
  event: "vip_pass.created" | "vip_pass.activated" | "booking.requested";
  passCode: string;
  holderName: string;
  tierLevel: "Plata" | "Oro" | "Diamante" | "Alpha Founder";
  tierType: "gentleman" | "muse";
  paymentMethod?: string;
  metadata?: Record<string, unknown>;
}

export async function POST(request: Request) {
  try {
    const payload: VipPassWebhookPayload = await request.json();

    if (!payload.passCode || !payload.holderName) {
      return NextResponse.json(
        { error: "Campos passCode y holderName requeridos." },
        { status: 400 }
      );
    }

    // Record audit event in Supabase
    await supabase.from("audit_logs").insert({
      event_type: `COMPOSIO_${payload.event.toUpperCase()}`,
      metadata: {
        pass_code: payload.passCode,
        holder: payload.holderName,
        tier: payload.tierLevel,
        source: "composio_saas_orchestrator",
        timestamp: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: `Evento ${payload.event} procesado exitosamente por Composio Hook.`,
      passCode: payload.passCode
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error procesando webhook";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
