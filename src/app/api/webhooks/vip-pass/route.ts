import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { trackEvent } from "@/lib/track";
import {
  decodePaymentHash,
  getTierPriceUsd,
  sanitizePassCode,
  verifyIpnSignature,
} from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export interface VipPassWebhookPayload {
  event: "vip_pass.created" | "vip_pass.activated" | "booking.requested";
  passCode: string;
  holderName: string;
  tierLevel: "Plata" | "Oro" | "Diamante" | "Alpha Founder";
  tierType: "gentleman" | "muse";
  paymentMethod?: string;
  metadata?: Record<string, unknown>;
}

const NP_SUCCESS_STATUSES = new Set(["finished", "confirmed"]);
const MAX_BODY_BYTES = 200_000;

export async function POST(request: Request) {
  const rawBody = await request.text();
  if (rawBody.length < 2 || rawBody.length > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Body inválido." }, { status: 400 });
  }

  const sig = request.headers.get("x-nowpayments-sig");
  if (sig) {
    return handleNowPaymentsIpn(rawBody, sig);
  }

  return handleLegacyComposioWebhook(rawBody);
}

async function handleNowPaymentsIpn(rawBody: string, signature: string) {
  const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
  if (!ipnSecret) {
    console.error(
      "[vip-pass webhook] NOWPAYMENTS_IPN_SECRET no configurado — IPN rechazado (fail-closed)."
    );
    return NextResponse.json(
      { error: "IPN secret no configurado en el servidor." },
      { status: 500 }
    );
  }

  if (!verifyIpnSignature(rawBody, signature, ipnSecret)) {
    console.error("[vip-pass webhook] Firma IPN inválida.");
    return NextResponse.json(
      { error: "Firma IPN inválida." },
      { status: 403 }
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(rawBody) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const paymentId = Number(payload.payment_id);
  const paymentStatus =
    typeof payload.payment_status === "string" ? payload.payment_status : "";
  const passCode = sanitizePassCode(
    typeof payload.order_id === "string" ? payload.order_id : ""
  );
  const priceCurrency =
    typeof payload.price_currency === "string"
      ? payload.price_currency.toLowerCase()
      : "";
  const priceAmount = Number(payload.price_amount);
  const payCurrency =
    typeof payload.pay_currency === "string" ? payload.pay_currency : "";
  const payAddress =
    typeof payload.pay_address === "string" ? payload.pay_address : "";
  const payinHash =
    typeof payload.payin_hash === "string" ? payload.payin_hash : "";

  if (!passCode || !paymentId) {
    return NextResponse.json({ success: true });
  }

  if (!NP_SUCCESS_STATUSES.has(paymentStatus)) {
    if (paymentStatus === "expired") {
      await supabaseAdmin
        .from("vip_passes")
        .update({ status: "expired" })
        .eq("pass_code", passCode)
        .eq("status", "pending");
    }
    return NextResponse.json({ success: true });
  }

  const { data: pass, error: lookupErr } = await supabaseAdmin
    .from("vip_passes")
    .select("pass_code, tier_level, status, payment_hash, payment_method")
    .eq("pass_code", passCode)
    .maybeSingle();

  if (lookupErr) {
    console.error("[vip-pass webhook] lookup error:", lookupErr);
    return NextResponse.json(
      { error: "Error consultando el pase." },
      { status: 500 }
    );
  }

  if (!pass) {
    console.warn(`[vip-pass webhook] IPN para pase inexistente: ${passCode}`);
    return NextResponse.json({ success: true, processed: false });
  }

  if (pass.status === "active") {
    return NextResponse.json({ success: true, processed: true });
  }

  if (pass.status !== "pending") {
    console.warn(
      `[vip-pass webhook] IPN de pase en estado "${pass.status}" — no activado.`
    );
    return NextResponse.json({ success: true, processed: false });
  }

  const decoded = decodePaymentHash(pass.payment_hash);
  let amountValid;
  if (decoded.paymentId !== null && decoded.amountCents !== null) {
    amountValid =
      decoded.paymentId === paymentId &&
      Math.round(priceAmount * 100) === decoded.amountCents &&
      priceCurrency === "usd";
  } else {
    const expected = getTierPriceUsd(pass.tier_level);
    amountValid =
      expected !== null &&
      Math.abs(priceAmount - expected) < 0.01 &&
      priceCurrency === "usd";
  }

  if (!amountValid) {
    console.error(
      `[vip-pass webhook] Monto/divisa no coinciden para ${passCode}: recibido ${priceAmount} ${priceCurrency} (payment ${paymentId}). No se activa.`
    );
    await supabaseAdmin.from("audit_logs").insert({
      event_type: "NWP_PAYMENT_MISMATCH",
      metadata: {
        pass_code: passCode,
        payment_id: paymentId,
        received_amount: priceAmount,
        received_currency: priceCurrency,
        source: "np_ipn",
      },
    });
    return NextResponse.json({ success: true, processed: false });
  }

  const updatedHash = payinHash
    ? `${pass.payment_hash || ""}|${payinHash.slice(0, 32)}`.slice(0, 150)
    : pass.payment_hash;

  const { error: updErr } = await supabaseAdmin
    .from("vip_passes")
    .update({ status: "active", payment_hash: updatedHash })
    .eq("pass_code", passCode)
    .eq("status", "pending");

  if (updErr) {
    console.error("[vip-pass webhook] activación fallida:", updErr);
    return NextResponse.json(
      { error: "Error activando el pase." },
      { status: 500 }
    );
  }

  await trackEvent("vip_payment_confirmed", {
    tier: pass.tier_level,
    paymentId,
    payCurrency,
    payAddress,
  });

  const { error: auditErr } = await supabaseAdmin.from("audit_logs").insert({
    event_type: "NWP_PAYMENT_CONFIRMED",
    metadata: {
      pass_code: passCode,
      payment_id: paymentId,
      payment_status: paymentStatus,
      price_amount: priceAmount,
      price_currency: priceCurrency,
      pay_currency: payCurrency,
      pay_address: payAddress,
      source: "np_ipn",
    },
  });
  if (auditErr) {
    console.error("[vip-pass webhook] audit error:", auditErr);
  }

  return NextResponse.json({
    success: true,
    processed: true,
    passCode,
  });
}

async function handleLegacyComposioWebhook(rawBody: string) {
  let payload: VipPassWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as VipPassWebhookPayload;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  if (!payload.passCode || !payload.holderName) {
    return NextResponse.json(
      { error: "Campos passCode y holderName requeridos." },
      { status: 400 }
    );
  }

  await supabase.from("audit_logs").insert({
    event_type: `COMPOSIO_${String(payload.event || "").toUpperCase()}`,
    metadata: {
      pass_code: payload.passCode,
      holder: payload.holderName,
      tier: payload.tierLevel,
      source: "composio_saas_orchestrator",
      timestamp: new Date().toISOString(),
    },
  });

  return NextResponse.json({
    success: true,
    message: `Evento ${payload.event} procesado exitosamente por Composio Hook.`,
    passCode: payload.passCode,
  });
}