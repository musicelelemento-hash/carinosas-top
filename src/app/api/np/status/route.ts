import { NextResponse } from "next/server";
import {
  getNowPaymentsPayment,
  NowPaymentsError,
} from "@/lib/nowpayments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawPid = searchParams.get("payment_id") || "";
  const paymentId = Number(rawPid.replace(/\D/g, ""));
  if (!paymentId) {
    return NextResponse.json(
      { error: "payment_id inválido." },
      { status: 400 }
    );
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

  try {
    const p = await getNowPaymentsPayment(apiKey, paymentId);
    return NextResponse.json({
      success: true,
      paymentId: p.payment_id,
      paymentStatus: p.payment_status,
      payAddress: p.pay_address,
      payAmount: Number(p.pay_amount),
      actuallyPaid: Number(p.actually_paid || 0),
      payCurrency: p.pay_currency,
      priceAmount: Number(p.price_amount),
      priceCurrency: p.price_currency,
      payinHash: p.payin_hash || null,
    });
  } catch (err) {
    if (err instanceof NowPaymentsError && err.status === 404) {
      return NextResponse.json(
        { success: false, error: "Orden NOWPayments no encontrada." },
        { status: 404 }
      );
    }
    console.error("[np/status] error:", err);
    return NextResponse.json(
      { success: false, error: "Error consultando el estado del pago." },
      { status: 502 }
    );
  }
}