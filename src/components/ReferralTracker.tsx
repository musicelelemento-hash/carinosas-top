"use client";

import { useEffect } from "react";
import { trackReferralVisitAction } from "@/app/actions/referrals";

/**
 * Registra automáticamente una visita por código de referido
 * cuando el usuario llega al home con ?ref= en la URL.
 * Lógica fire-and-forget: no bloquea UI ni muestra nada.
 */
export default function ReferralTracker() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const ref = params.get("ref");
      if (!ref) return;

      // Evitar registrar la misma visita dos veces en la misma sesión
      const seenKey = `ref_seen_${ref}`;
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, "1");

      trackReferralVisitAction(ref);
    } catch {
      // silencioso — tracking nunca debe romper la experiencia
    }
  }, []);

  return null;
}
