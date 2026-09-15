"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/track";

/**
 * Registra una vista de página de ciudad (`city_page_view`) una vez por sesión
 * por ciudad. Fire-and-forget: nunca bloquea UI ni muestra nada.
 */
export default function CityViewTracker({ city, slug }: { city: string; slug: string }) {
  useEffect(() => {
    try {
      if (typeof window === "undefined") return;
      const seenKey = `city_seen_${slug}`;
      if (sessionStorage.getItem(seenKey)) return;
      sessionStorage.setItem(seenKey, "1");
      trackEvent("city_page_view", { city, slug });
    } catch {
      // silencioso — el tracking nunca debe romper la experiencia
    }
  }, [city, slug]);

  return null;
}