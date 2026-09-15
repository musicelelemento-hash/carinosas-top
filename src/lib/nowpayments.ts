import { createHmac, timingSafeEqual } from "node:crypto";

export const NOWPAYMENTS_API_BASE = "https://api.nowpayments.io/v1";

export const ALLOWED_VIP_TIERS = [
  "Plata",
  "Oro",
  "Diamante",
  "Alpha Founder",
] as const;
export type VipTier = (typeof ALLOWED_VIP_TIERS)[number];

export const ALLOWED_PAY_CURRENCIES = ["usdttrc20", "usdtbsc20"] as const;
export type VipPayCurrency = (typeof ALLOWED_PAY_CURRENCIES)[number];

export const DEFAULT_PAY_CURRENCY: VipPayCurrency = "usdttrc20";

export interface NowPaymentsPayment {
  payment_id: number;
  payment_status: string;
  pay_address: string;
  pay_amount?: number | string;
  price_amount?: number | string;
  price_currency?: string;
  pay_currency?: string;
  actually_paid?: number | string;
  order_id?: string | null;
  order_description?: string | null;
  purchase_id?: string | null;
  payin_hash?: string | null;
  created_at?: string;
  updated_at?: string;
}

export class NowPaymentsError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "NowPaymentsError";
    this.status = status;
  }
}

/**
 * Precios por tier (USD) impuestos por el servidor. El cliente NUNCA decide el
 * monto: evita que se cree un pago de $0.01 para un pase Diamante.
 * Se pueden sobreescribir con la variable de entorno VP_TIER_PRICES (JSON).
 */
export const DEFAULT_VIP_TIER_PRICES: Record<VipTier, number> = {
  Plata: 29,
  Oro: 39,
  Diamante: 49,
  "Alpha Founder": 75,
};

export function loadTierPrices(): Record<VipTier, number> {
  const defaults: Record<VipTier, number> = { ...DEFAULT_VIP_TIER_PRICES };
  const raw = process.env.VP_TIER_PRICES;
  if (raw && raw.trim()) {
    try {
      const parsed = JSON.parse(raw) as Partial<Record<string, unknown>>;
      const out: Partial<Record<VipTier, number>> = {};
      for (const tier of ALLOWED_VIP_TIERS) {
        const v = parsed[tier];
        if (typeof v === "number" && Number.isFinite(v) && v > 0) {
          out[tier] = v;
        }
      }
      if (ALLOWED_VIP_TIERS.every((t) => out[t] !== undefined)) {
        return out as Record<VipTier, number>;
      }
      console.warn(
        "[nowpayments] VP_TIER_PRICES incompleto; usando precios por defecto."
      );
    } catch {
      console.warn(
        "[nowpayments] VP_TIER_PRICES no es JSON válido; usando precios por defecto."
      );
    }
  }
  return defaults;
}

export function getTierPriceUsd(tier?: string | null): number | null {
  if (!tier || !(ALLOWED_VIP_TIERS as readonly string[]).includes(tier)) {
    return null;
  }
  const price = loadTierPrices()[tier as VipTier];
  return typeof price === "number" && Number.isFinite(price) ? price : null;
}

export function buildPassCode(existing?: string | null): string {
  if (existing) {
    const clean = existing
      .replace(/[^A-Z0-9-]/gi, "")
      .toUpperCase()
      .slice(0, 30);
    if (clean.length >= 6) return clean;
  }
  const rnd = Math.floor(1000 + Math.random() * 9000);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ALPHA-${rnd}-${suffix}`;
}

export function sanitizePassCode(code?: string | null): string {
  return (code || "")
    .replace(/[^A-Z0-9-]/gi, "")
    .toUpperCase()
    .slice(0, 30);
}

export function sanitizeHolderName(name?: string | null): string {
  return (name || "Socio VIP Confidencial")
    .replace(/<[^>]*>?/gm, "")
    .replace(/[{}$;`]/g, "")
    .trim()
    .slice(0, 80);
}

/**
 * payment_hash interno para pagos automáticos: `np_<payment_id>|<centavos>`.
 * El centaje permite validar el monto en el webhook sin depender de la tabla
 * de precios (que puede cambiar entre la creación y el pago).
 */
export function encodePaymentHash(
  paymentId: number,
  priceAmountUsd: number | string
): string {
  const cents = Math.round(Number(priceAmountUsd) * 100);
  return `np_${paymentId}|${cents}`;
}

export function decodePaymentHash(
  hash: string | null | undefined
): { paymentId: number | null; amountCents: number | null } {
  if (!hash) return { paymentId: null, amountCents: null };
  const m = /^np_(\d+)\|(\d+)$/.exec(hash);
  if (!m) return { paymentId: null, amountCents: null };
  return { paymentId: Number(m[1]), amountCents: Number(m[2]) };
}

export function vipIpnCallbackUrl(siteUrl?: string | null): string {
  const base = (
    siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "https://carinosas.top"
  ).replace(/\/$/, "");
  return `${base}/api/webhooks/vip-pass`;
}

/**
 * Verifica la firma HMAC-SHA512 del IPN de NOWPayments (header
 * `x-nowpayments-sig`) contra el body crudo recibido y el IPN secret.
 * Fail-closed: sin signature o sin secret devuelve false.
 */
export function verifyIpnSignature(
  rawBody: string,
  signature: string | null,
  secret: string | undefined
): boolean {
  if (!signature || !secret) return false;
  const received = signature.trim().toLowerCase();
  const computed = createHmac("sha512", secret).update(rawBody).digest("hex");
  if (received.length !== computed.length) return false;
  return timingSafeEqual(
    Buffer.from(received, "latin1"),
    Buffer.from(computed, "latin1")
  );
}

async function npFetch<T>(
  path: string,
  apiKey: string,
  init?: { method?: string; body?: unknown }
): Promise<T> {
  const res = await fetch(`${NOWPAYMENTS_API_BASE}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: init?.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: "no-store",
  });
  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? ((await res.json()) as Record<string, unknown>)
    : null;
  if (!res.ok) {
    const detail =
      data && typeof data.error === "string"
        ? data.error
        : res.statusText || "Error NOWPayments";
    throw new NowPaymentsError(detail, res.status);
  }
  return data as T;
}

export async function createNowPaymentsOrder(input: {
  apiKey: string;
  priceAmountUsd: number;
  payCurrency: string;
  orderId: string;
  orderDescription: string;
  ipnCallbackUrl: string;
}): Promise<NowPaymentsPayment> {
  return npFetch<NowPaymentsPayment>("/payment", input.apiKey, {
    method: "POST",
    body: {
      price_amount: input.priceAmountUsd,
      price_currency: "usd",
      pay_currency: input.payCurrency,
      order_id: input.orderId,
      order_description: input.orderDescription,
      ipn_callback_url: input.ipnCallbackUrl,
    },
  });
}

export async function getNowPaymentsPayment(
  apiKey: string,
  paymentId: number
): Promise<NowPaymentsPayment> {
  return npFetch<NowPaymentsPayment>(`/payment/${paymentId}`, apiKey);
}