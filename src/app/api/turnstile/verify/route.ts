import { NextResponse } from "next/server";

const TURNSTILE_SECRET_KEY = 
  process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY || "1x0000000000000000000000000000000AA"; // Cloudflare test secret key

export async function POST(request: Request) {
  try {
    const { token, remoteip } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "El token de Turnstile es requerido." },
        { status: 400 }
      );
    }

    const formData = new URLSearchParams();
    formData.append("secret", TURNSTILE_SECRET_KEY);
    formData.append("response", token);
    if (remoteip) {
      formData.append("remoteip", remoteip);
    }

    const verificationResponse = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
      }
    );

    const outcome = await verificationResponse.json();

    if (outcome.success) {
      return NextResponse.json({
        success: true,
        challenge_ts: outcome.challenge_ts,
        hostname: outcome.hostname,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Verificación antibot fallida.",
          errorCodes: outcome["error-codes"],
        },
        { status: 403 }
      );
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
