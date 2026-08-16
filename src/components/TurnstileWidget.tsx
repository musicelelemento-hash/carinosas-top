"use client";

import React, { useEffect, useRef } from "react";

interface TurnstileWidgetProps {
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  siteKey?: string;
  theme?: "dark" | "light" | "auto";
  size?: "normal" | "compact" | "invisible";
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement | string,
        params: {
          sitekey: string;
          theme?: string;
          size?: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

export default function TurnstileWidget({
  onSuccess,
  onError,
  onExpire,
  siteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || "1x00000000000000000000AA",
  theme = "dark",
  size = "normal"
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    const renderWidget = () => {
      if (window.turnstile && containerRef.current && !widgetIdRef.current) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          size,
          callback: (token: string) => onSuccess(token),
          "error-callback": () => onError?.(),
          "expired-callback": () => onExpire?.(),
        });
      }
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      // Load Turnstile script if not present
      if (!document.getElementById("cloudflare-turnstile-script")) {
        const script = document.createElement("script");
        script.id = "cloudflare-turnstile-script";
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.defer = true;
        script.onload = renderWidget;
        document.head.appendChild(script);
      }
    }

    return () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, size, onSuccess, onError, onExpire]);

  return (
    <div className="flex flex-col items-center justify-center my-3">
      <div ref={containerRef} className="rounded-xl overflow-hidden shadow-lg border border-white/10" />
      <p className="text-[10px] text-white/40 mt-1 flex items-center gap-1">
        🔒 Protegido por Cloudflare Turnstile
      </p>
    </div>
  );
}
