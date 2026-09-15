import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { trackEvent } from "@/lib/track";
import {
  ALLOWED_PAY_CURRENCIES,
  ALLOWED_VIP_TIERS,
  buildPassCode,
  createNowPaymentsOrder,
  DEFAULT_PAY_CURRENCY,
  encodePaymentHash,
  getNowPaymentsPayment,
  getTierPriceUsd,
  NowPaymentsError,
  sanitizeHolderName,
  sanitizePassCode,
  type VipPayCurrency,
  type VipTier,
  vipIpnCallbackUrl,
} from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface CreatePaymentRequest {
  holderName?: string;
  tierLevel?: string;
  tierType?: string;
  payCurrency?: string;
  passCode?: string;
  sessionKey?: string;
}

const PENDING_PASS_SELECT =
  "pass_code, holder_name, tier_type, tier_level, status, payment_hash";

export async function POST(request: Request) {
  let body: CreatePaymentRequest;
  try {
    body = (await request.json()) as CreatePaymentRequest;
  } catch {
    return NextResponse.json({ error: "JSON inválido." }, { status: 400 });
  }

  const apiKey = process.env.NOWPAYMENTS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Pasarela crypto no configurada (falta NOWPAYMENTS_API_KEY). Contacta con soporte.",
      },
      { status: 503 }
    );
  }

  const tierLevel = (ALLOWED_VIP_TIERS as readonly string[]).includes(
    body.tierLevel || ""
  )
    ? (body.tierLevel as VipTier)
    : null;
  if (!tierLevel) {
    return NextResponse.json(
      { error: "Tier de pase inválido." },
      { status: 400 }
    );
  }

  const priceUsd = getTierPriceUsd(tierLevel);
  if (priceUsd === null) {
    return NextResponse.json(
      { error: "No hay precio configurado para este tier." },
      { status: 400 }
    );
  }

  const tierType = body.tierType === "muse" ? "muse" : "gentleman";
  const payCurrency: VipPayCurrency = (
    ALLOWED_PAY_CURRENCIES as readonly string[]
  ).includes(body.payCurrency || "")
    ? (body.payCurrency as VipPayCurrency)
    : DEFAULT_PAY_CURRENCY;
  const holderName = sanitizeHolderName(body.holderName);
  const passCode = buildPassCode(sanitizePassCode(body.passCode));
  const orderDescription = `Pase VIP ${tierLevel} · ${
    tierType === "muse" ? "Musa" : "Caballero"
  } · Cariñosas.top`;
  const ipnCallbackUrl = vipIpnCallbackUrl();

  // Idempotencia: si existe un pase pendiente con orden NOWPayments activa,
  // reutilizarlo en vez de duplicar pagos con el mismo order_id.
  const { data: existing, error: lookupErr } = await supabaseAdmin
    .from("vip_passes")
    .select(PENDING_PASS_SELECT)
    .eq("pass_code", passCode)
    .maybeSingle();

  if (lookupErr) {
    console.error("[np/create-payment] lookup error:", lookupErr);
    return NextResponse.json(
      { error: "Error interno consultando el pase." },
      { status: 500 }
    );
  }

  if (existing?.status === "active") {
    return NextResponse.json(
      { error: "Este código de pase ya está activo." },
      { status: 409 }
    );
  }

  let payment;
  const reused = /^np_/.test(existing?.payment_hash || "");
  if (reused && existing?.payment_hash) {
    const parsed = /^np_(\d+)/.exec(existing.payment_hash);
    const npPaymentId = parsed ? Number(parsed[1]) : null;
    if (npPaymentId) {
      try {
        const found = await getNowPaymentsPayment(apiKey, npPaymentId);
        if (found && found.payment_id === npPaymentId) {
          payment = found;
        }
      } catch (err) {
        console.warn(
          `[np/create-payment] orden ${npPaymentId} no reutilizable:`,
          err instanceof Error ? err.message : err
        );
      }
    }
  }

  if (!payment) {
    try {
      payment = await createNowPaymentsOrder({
        apiKey,
        priceAmountUsd: priceUsd,
        payCurrency,
        orderId: passCode,
        orderDescription,
        ipnCallbackUrl,
      });
    } catch (err) {
      if (err instanceof NowPaymentsError) {
        console.error("[np/create-payment] NOWPayments error:", err.message);
        return NextResponse.json(
          {
            error: "No se pudo crear la orden en NOWPayments.",
            detail: err.message,
          },
          { status: 502 }
        );
      }
      console.error("[np/create-payment] error inesperado:", err);
      return NextResponse.json(
        { error: "Error inesperado creando la orden de pago." },
        { status: 502 }
      );
    }
  }

  const npPaymentId = Number(payment.payment_id);
  if (!npPaymentId) {
    return NextResponse.json(
      { error: "NOWPayments no devolvió un payment_id válido." },
      { status: 502 }
    );
  }

  const paymentHash = encodePaymentHash(
    npPaymentId,
    payment.price_amount ?? priceUsd
  );

  if (existing) {
    const { error: updErr } = await supabaseAdmin
      .from("vip_passes")
      .update({
        holder_name: holderName,
        tier_type: tierType,
        tier_level: tierLevel,
        status: "pending",
        payment_method: "crypto_usdt",
        payment_hash: paymentHash,
      })
      .eq("pass_code", passCode);
    if (updErr) {
      console.error("[np/create-payment] update error:", updErr);
      return NextResponse.json(
        { error: "Error interno guardando el pase." },
        { status: 500 }
      );
    }
  } else {
    const { error: insErr } = await supabaseAdmin.from("vip_passes").insert([
      {
        pass_code: passCode,
        holder_name: holderName,
        tier_type: tierType,
        tier_level: tierLevel,
        status: "pending",
        payment_method: "crypto_usdt",
        payment_hash: paymentHash,
        origin_country: "EC",
        is_international_valid: true,
      },
    ]);
    if (insErr) {
      console.error("[np/create-payment] insert error:", insErr);
      return NextResponse.json(
        { error: "Error interno guardando el pase." },
        { status: 500 }
      );
    }
  }

  await trackEvent("vip_checkout_created", {
    tier: tierLevel,
    amountUsd: priceUsd,
    paymentId: npPaymentId,
    payCurrency,
    sessionKey: body.sessionKey,
  });

  const { error: auditErr } = await supabaseAdmin.from("audit_logs").insert({
    event_type: "NWP_PAYMENT_CREATED",
    metadata: {
      pass_code: passCode,
      tier_level: tierLevel,
      price_amount: priceUsd,
      price_currency: "usd",
      payment_id: npPaymentId,
      source: "np_create_payment",
    },
  });
  if (auditErr) {
    console.error("[np/create-payment] audit error:", auditErr);
  }

  return NextResponse.json({
    success: true,
    passCode,
    paymentId: npPaymentId,
    paymentStatus: payment.payment_status,
    payAddress: payment.pay_address,
    payAmount: Number(payment.pay_amount),
    payCurrency: payment.pay_currency,
    priceAmount: Number(payment.price_amount),
    priceCurrency: payment.price_currency,
  });
}