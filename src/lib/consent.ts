export const CONSENT_VERSION = "v0-2026-08-21";

export const CONSENT_POINTS: readonly string[] = [
  "Autorizas usar TUS fotos (no de terceros) en tu perfil de Cariñosas.top.",
  "Puedes pedir difuminar el rostro hasta que completes la verificación 4K.",
  "En cualquier momento puedes pedir borrar tu perfil y fotos (derecho de supresión).",
  "No publicamos tu dirección, solo zona aproximada + distancia (privacidad).",
];

export const CONSENT_SNAPSHOT = CONSENT_POINTS.map(
  (point, index) => `${index + 1}. ${point}`
).join("\n");