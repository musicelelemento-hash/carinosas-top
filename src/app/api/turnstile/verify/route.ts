import { NextResponse } from "next/server";

// P0 anti-fachada: la clave secreta de Turnstile NO tiene fallback a la "test key"
// de Cloudflare en producción. Esa test key daba por válida cualquier verificación,
// dejando la "protección antibot" decorativa. Ahora fallamos en frío.
const TURNSTILE_SECRET_KEY = process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
const secretKeyMissing = !TURNSTILE_SECRET_KEY;

export async function POST(request: Request) {
  try {
    const { token, remoteip } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, error: "El token de Turnstile es requerido." },
        { status: 400 }
      );
    }

    if (secretKeyMissing) {
      return NextResponse.json(
        { success: false, error: "La verificación antibot no está configurada." },
        { status: 500 }
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
